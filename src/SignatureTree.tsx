// src/SignatureTree.tsx
import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshReflectorMaterial } from "@react-three/drei";
import { Group, Mesh, Vector3 } from "three";

type Ornament = {
  position: [number, number, number];
  color: string;
  size: number;
};

const GOLD = "#facc15";
const EMERALD = "#065f46";
const EMERALD_DARK = "#022c22";

function SignatureTree() {
  const groupRef = useRef<Group | null>(null);
  const [starActive, setStarActive] = useState(false);

  // 整棵树缓慢旋转 + 轻微浮动
  useFrame((state) => {
    const g = groupRef.current;
    if (!g) return;

    const t = state.clock.getElapsedTime();

    const targetRotY = Math.sin(t * 0.12) * 0.2 + state.pointer.x * 0.4;
    g.rotation.y += (targetRotY - g.rotation.y) * 0.04;

    const targetY = 0.2 + Math.sin(t * 0.8) * 0.03;
    g.position.y += (targetY - g.position.y) * 0.06;
  });

  const ornaments = useMemo<Ornament[]>(() => {
    const arr: Ornament[] = [];
    const layers = [
      { y: 2.0, radius: 0.8 },
      { y: 1.4, radius: 1.1 },
      { y: 0.8, radius: 1.35 },
      { y: 0.3, radius: 1.6 },
    ];
    const colors = ["#facc15", "#f97316", "#fbbf24", "#fef3c7"];

    layers.forEach((layer, i) => {
      const count = 7 + i * 2;
      for (let j = 0; j < count; j++) {
        const angle = (j / count) * Math.PI * 2 + i * 0.2;
        const radius = layer.radius * (0.9 + Math.random() * 0.15);
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = layer.y + (Math.random() - 0.5) * 0.08;

        arr.push({
          position: [x, y, z],
          color: colors[(i + j) % colors.length],
          size: 0.08 + Math.random() * 0.04,
        });
      }
    });

    return arr;
  }, []);

  return (
    <group ref={groupRef} position={[0, 0.1, 0]} castShadow receiveShadow>
      {/* 镜面地台 */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        receiveShadow
      >
        <circleGeometry args={[4, 64]} />
        <MeshReflectorMaterial
          blur={[400, 80]}
          resolution={1024}
          mixBlur={0.9}
          mixStrength={3}
          roughness={0.2}
          metalness={0.8}
          mirror={0.5}
          color={EMERALD_DARK}
        />
      </mesh>

      {/* 底座 */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.6, 1.8, 0.25, 64]} />
        <meshStandardMaterial
          metalness={0.9}
          roughness={0.25}
          color={EMERALD_DARK}
          emissive={"#022c22"}
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.4, 1.6, 0.18, 64]} />
        <meshStandardMaterial
          metalness={1}
          roughness={0.18}
          color={GOLD}
          emissive={GOLD}
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* 树干 */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.24, 0.9, 32]} />
        <meshStandardMaterial
          metalness={0.9}
          roughness={0.35}
          color={"#78350f"}
          emissive={"#451a03"}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* 祖母绿树层 */}
      <TreeLayer
        y={1.3}
        radius={1.25}
        height={1.2}
        tilt={0.02}
        color={EMERALD}
      />
      <TreeLayer
        y={1.9}
        radius={1.0}
        height={1.0}
        tilt={-0.025}
        color={EMERALD}
      />
      <TreeLayer
        y={2.4}
        radius={0.8}
        height={0.8}
        tilt={0.03}
        color={EMERALD}
      />
      <TreeLayer
        y={2.8}
        radius={0.55}
        height={0.7}
        tilt={-0.02}
        color={EMERALD}
      />

      {/* 顶部金星（可点击让星星更亮） */}
      <Star
        position={[0, 3.4, 0]}
        active={starActive}
        onToggle={() => setStarActive((v) => !v)}
      />

      {/* 金属球饰品 */}
      {ornaments.map((orn, index) => (
        <Ornament key={index} data={orn} starActive={starActive} />
      ))}
    </group>
  );
}

type TreeLayerProps = {
  y: number;
  radius: number;
  height: number;
  tilt?: number;
  color: string;
};

function TreeLayer({ y, radius, height, tilt = 0, color }: TreeLayerProps) {
  const ref = useRef<Mesh | null>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(t * 0.3 + y) * 0.04;
  });

  return (
    <mesh
      ref={ref}
      position={[0, y, 0]}
      rotation={[tilt, 0, -tilt]}
      castShadow
      receiveShadow
    >
      <coneGeometry args={[radius, height, 64, 1, true]} />
      <meshStandardMaterial
        color={color}
        metalness={0.7}
        roughness={0.25}
        emissive={color}
        emissiveIntensity={0.35}
        transparent
        opacity={0.96}
      />
    </mesh>
  );
}

type StarProps = {
  position: [number, number, number];
  active: boolean;
  onToggle: () => void;
};

function Star({ position, active, onToggle }: StarProps) {
  const ref = useRef<Mesh | null>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!ref.current) return;
    ref.current.rotation.y = t * 0.8;
    ref.current.position.y =
      position[1] + (active ? Math.sin(t * 3.0) * 0.06 : 0);
  });

  return (
    <mesh
      ref={ref}
      position={position}
      onClick={onToggle}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "default";
      }}
      castShadow
    >
      <octahedronGeometry args={[0.32, 1]} />
      <meshStandardMaterial
        color={GOLD}
        metalness={1}
        roughness={0.1}
        emissive={GOLD}
        emissiveIntensity={active ? 1.0 : 0.6}
      />
    </mesh>
  );
}

type OrnamentProps = {
  data: Ornament;
  starActive: boolean;
};

function Ornament({ data, starActive }: OrnamentProps) {
  const ref = useRef<Mesh | null>(null);
  const [hovered, setHovered] = useState(false);
  const basePos = useMemo(() => new Vector3(...data.position), [data.position]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!ref.current) return;

    const hoverOffset = hovered ? 0.07 : 0;
    const pulse = starActive ? Math.sin(t * 3 + basePos.x * 2) * 0.03 : 0;
    ref.current.position.set(
      basePos.x,
      basePos.y + hoverOffset + pulse,
      basePos.z
    );
  });

  return (
    <mesh
      ref={ref}
      position={data.position}
      castShadow
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = "default";
      }}
    >
      <sphereGeometry args={[data.size, 32, 32]} />
      <meshStandardMaterial
        color={data.color}
        metalness={1}
        roughness={0.15}
        emissive={data.color}
        emissiveIntensity={hovered ? 1.1 : 0.5}
      />
    </mesh>
  );
}

export default SignatureTree;
