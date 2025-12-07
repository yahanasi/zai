// src/App.tsx
import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";
import "./App.css";

type SnowFlake = {
  id: number;
  left: string;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
};

const SnowOverlay = () => {
  const flakes = useMemo<SnowFlake[]>(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        size: 4 + Math.random() * 4,
        duration: 10 + Math.random() * 10,
        delay: Math.random() * 10,
        opacity: 0.3 + Math.random() * 0.4,
      })),
    []
  );

  return (
    <div className="snow-overlay">
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: flake.left,
            width: flake.size,
            height: flake.size,
            animationDuration: `${flake.duration}s`,
            animationDelay: `${flake.delay}s`,
            opacity: flake.opacity,
          }}
        />
      ))}
    </div>
  );
};

function App() {
  return (
    <div className="app-root">
      {/* 雪花前景叠加层 */}
      <SnowOverlay />

      <div className="app-canvas-wrap">
        <Canvas shadows camera={{ position: [0, 2.4, 7], fov: 40 }}>
          <Scene />
        </Canvas>
      </div>

      {/* 左上角卡片 HUD */}
      <div className="hud">
        <div className="hud-brand">耗子 · 梦仔Lark</div>
        <h1 className="hud-title">仔 圣诞快乐</h1>
        <p className="hud-subtitle">2025年的仔圣诞节快乐❤️❤️❤️</p>
      </div>
    </div>
  );
}

export default App;
