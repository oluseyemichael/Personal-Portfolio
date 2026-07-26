import { useRef, useEffect, useState } from 'react';
import { Scene } from './scene/Scene.jsx';
import { ZoneOverlays } from './components/ZoneOverlays.jsx';
import { ProgressIndicator } from './components/ProgressIndicator.jsx';
import { ProjectDetail } from './components/ProjectDetail.jsx';
import { MobileFallback } from './components/MobileFallback.jsx';
import { Header } from './components/Header.jsx';
import { useScrollProgress } from './hooks/useScrollProgress.js';
import { useDeviceCapability } from './hooks/useDeviceCapability.js';

export default function App() {
  const isMobile = useDeviceCapability();

  // Get smoothed scroll progress for UI overlays (needs to trigger renders)
  const scrollProgress = useScrollProgress(0.08);

  // Also keep a ref version for the camera (no re-render needed, updates every frame)
  const scrollRef = useRef(0);

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  const [selectedProject, setSelectedProject] = useState(null);

  if (isMobile) {
    return <MobileFallback />;
  }

  return (
    <>
      {/* Fixed 3D canvas underneath everything */}
      <div className="canvas-container">
        <Scene scrollRef={scrollRef} onSelectProject={setSelectedProject} />
      </div>

      {/* Cinematic vignette between scene and UI */}
      <div className="vignette" aria-hidden="true" />

      {/* UI overlays on top of canvas */}
      <div className="ui-overlay">
        <Header />
        <ZoneOverlays scrollProgress={scrollProgress} />
        <ProgressIndicator scrollProgress={scrollProgress} />
      </div>

      {/* Project detail panel, opened by clicking a project node in the 3D scene */}
      <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} />

      {/* Invisible scroll proxy - gives the page height to scroll through */}
      <div className="scroll-container" aria-hidden="true" />
    </>
  );
}
