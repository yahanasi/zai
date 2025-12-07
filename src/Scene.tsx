// src/Scene.tsx
import { Suspense } from "react";
import { OrbitControls, Environment, Sparkles } from "@react-three/drei";
import SignatureTree from "./SignatureTree";
import Effects from "./post/Effects";

const Scene = () => {
  return (
    <>
      <color attach="background" args={["#020617"]} />
      <fog attach="fog" args={["#020617", 12, 40]} />

      <ambientLight intensity={0.15} />
      {/* 主金色聚光灯 */}
      <spotLight
        intensity={1.5}
        angle={0.6}
        penumbra={0.6}
        position={[6, 10, 6]}
        color={"#facc15"}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      {/* 辅助祖母绿冷光 */}
      <spotLight
        intensity={0.9}
        angle={0.7}
        penumbra={0.8}
        position={[-5, 7, -4]}
        color={"#22c55e"}
      />
      {/* 顶部柔光 */}
      <directionalLight
        intensity={0.25}
        position={[0, 6, 0]}
        color={"#fefce8"}
      />

      <Suspense fallback={null}>
        <Environment preset="studio" />
      </Suspense>

      <Suspense fallback={null}>
        <SignatureTree />
      </Suspense>

      <Sparkles
        count={100}
        speed={0.4}
        opacity={0.7}
        scale={[12, 8, 10]}
        size={3}
        color="#facc15"
      />

      <OrbitControls
        enablePan={false}
        minDistance={4}
        maxDistance={10}
        maxPolarAngle={Math.PI / 1.9}
        target={[0, 1.7, 0]}
      />

      <Effects />
    </>
  );
};

export default Scene;
