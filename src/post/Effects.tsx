// src/post/Effects.tsx
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

function Effects() {
  return (
    <EffectComposer multisampling={2}>
      {/* 强调金色高光 */}
      <Bloom
        intensity={0.7}              // 原来比较高，这里改小
        luminanceThreshold={0.6}     // 更高阈值，只有最亮的才发光
        luminanceSmoothing={0.2}
        radius={0.6}
      />
      {/* 轻微暗角，增加电影感 */}
      <Vignette offset={0.3} darkness={0.7} eskil={false} />
    </EffectComposer>
  );
}

export default Effects;
