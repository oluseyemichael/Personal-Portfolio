import { useRef, useEffect, useState } from 'react';
import { Scene } from './scene/Scene.jsx';
import { ZoneOverlays } from './components/ZoneOverlays.jsx';
import { ProgressIndicator } from './components/ProgressIndicator.jsx';
import { Header } from './components/Header.jsx';
import { useScrollProgress } from './hooks/useScrollProgress.js';

export default function App() {
  // Get smoothed scroll progress for UI overlays (needs to trigger renders)
  const scrollProgress = useScrollProgress(0.08);

  // Also keep a ref version for the camera (no re-render needed, updates every frame)
  const scrollRef = useRef(0);

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  return (
    <>
      {/* Fixed 3D canvas underneath everything */}
      <div className="canvas-container">
        <Scene scrollRef={scrollRef} />
      </div>

      {/* Cinematic vignette between scene and UI */}
      <div className="vignette" aria-hidden="true" />

      {/* UI overlays on top of canvas */}
      <div className="ui-overlay">
        <Header />
        <ZoneOverlays scrollProgress={scrollProgress} />
        <ProgressIndicator scrollProgress={scrollProgress} />
      </div>

      {/* Invisible scroll proxy - gives the page height to scroll through */}
      <div className="scroll-container" aria-hidden="true" />
    </>
  );
}
