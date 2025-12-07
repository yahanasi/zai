// src/App.tsx
import { useMemo, useRef, useState, useEffect } from "react";
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

/** 右下角 BGM 控制按钮：自动尝试播放 + 第一次点击强制解锁 */
const BgmControl = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [autoTried, setAutoTried] = useState(false);

  // 保证在 /zai/ 这种子路径下也能找到 bgm.mp3
  const src = useMemo(
    () => `${import.meta.env.BASE_URL}bgm.flac`,
    []
  );

  // 第一次挂载时，尝试自动播放
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio
      .play()
      .then(() => {
        // 自动播放成功
        setPlaying(true);
        setAutoTried(true);
      })
      .catch((err) => {
        console.warn("自动播放 BGM 被阻止或失败：", err);
        setPlaying(false);
        setAutoTried(true);
      });
  }, []);

  // 如果自动播放失败：监听“第一次用户交互”，再强制播放一次
  useEffect(() => {
    if (!autoTried || playing) return;

    const handler = () => {
      const audio = audioRef.current;
      if (!audio) return;

      audio
        .play()
        .then(() => {
          setPlaying(true);
          // 成功后解绑监听
          window.removeEventListener("pointerdown", handler);
          window.removeEventListener("keydown", handler);
        })
        .catch((err) => {
          console.warn("用户交互后播放 BGM 仍失败：", err);
        });
    };

    window.addEventListener("pointerdown", handler);
    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("pointerdown", handler);
      window.removeEventListener("keydown", handler);
    };
  }, [autoTried, playing]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch((err) => {
          console.error("手动播放 BGM 失败：", err);
        });
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        loop
        preload="auto"
      />
      <button className="bgm-button" onClick={togglePlay}>
        {playing ? "⏸ BGM" : "▶ BGM"}
      </button>
    </>
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

      {/* 左上角祝福卡片 */}
      <div className="hud">
        <div className="hud-brand">耗子 · 梦仔Lark</div>
        <h1 className="hud-title">仔 圣诞快乐</h1>
        <p className="hud-subtitle">2025年的仔圣诞节快乐❤️❤️❤️</p>
      </div>

      {/* 右下角 BGM 按钮 */}
      <BgmControl />
    </div>
  );
}

export default App;
