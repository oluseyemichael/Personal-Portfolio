import { useRef, useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { ZoneOverlays } from './components/ZoneOverlays.jsx';
import { ProgressIndicator } from './components/ProgressIndicator.jsx';
import { ProjectDetail } from './components/ProjectDetail.jsx';
import { MobileFallback } from './components/MobileFallback.jsx';
import { SceneErrorBoundary } from './components/SceneErrorBoundary.jsx';
import { SoundToggle } from './components/SoundToggle.jsx';
import { Header } from './components/Header.jsx';
import { useScrollProgress } from './hooks/useScrollProgress.js';
import { useDeviceCapability } from './hooks/useDeviceCapability.js';
import { useKonamiCode } from './hooks/useKonamiCode.js';
import { trackEvent } from './analytics.js';

const SCROLL_MILESTONES = [25, 50, 75, 100];

// Lazy-loaded so the ~1MB three/r3f bundle downloads after the critical
// shell paints, instead of blocking it. The HTML/CSS loading screen
// (index.html) covers this gap with no JS dependency of its own.
const Scene = lazy(() => import('./scene/Scene.jsx').then((m) => ({ default: m.Scene })));

export default function App() {
  const { isMobile, gpuTier } = useDeviceCapability();

  // Get smoothed scroll progress for UI overlays (needs to trigger renders)
  const scrollProgress = useScrollProgress(0.08);

  // Also keep a ref version for the camera (no re-render needed, updates every frame)
  const scrollRef = useRef(0);

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  const [selectedProject, setSelectedProject] = useState(null);

  const reachedMilestones = useRef(new Set());
  useEffect(() => {
    const percent = scrollProgress * 100;
    for (const milestone of SCROLL_MILESTONES) {
      if (percent >= milestone && !reachedMilestones.current.has(milestone)) {
        reachedMilestones.current.add(milestone);
        trackEvent('scroll_depth', { percent: milestone });
      }
    }
  }, [scrollProgress]);

  const handleSelectProject = (project) => {
    if (project) trackEvent('project_click', { project: project.id });
    setSelectedProject(project);
  };

  // Easter eggs: the Konami code, or 5 clicks on the landing avatar,
  // both dispatch a window 'easter-egg' event that this toast listens
  // for (AbstractAvatar.jsx dispatches its own on the 5-click gag).
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  useEffect(() => {
    const onEasterEgg = (e) => {
      trackEvent('easter_egg');
      setToast(e.detail?.message ?? 'You found an easter egg.');
      clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = setTimeout(() => setToast(null), 3500);
    };
    window.addEventListener('easter-egg', onEasterEgg);
    return () => {
      window.removeEventListener('easter-egg', onEasterEgg);
      clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const activateKonami = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent('easter-egg', { detail: { message: 'Konami code. You were paying attention.' } }),
    );
  }, []);
  useKonamiCode(activateKonami);

  if (isMobile) {
    return <MobileFallback />;
  }

  return (
    <SceneErrorBoundary>
      {/* Fixed 3D canvas underneath everything */}
      <div className="canvas-container">
        <Suspense fallback={<div className="w-full h-full bg-navy-950" />}>
          <Scene scrollRef={scrollRef} onSelectProject={handleSelectProject} gpuTier={gpuTier} />
        </Suspense>
      </div>

      {/* Cinematic vignette between scene and UI */}
      <div className="vignette" aria-hidden="true" />

      {/* UI overlays on top of canvas */}
      <div className="ui-overlay">
        <Header />
        <ZoneOverlays scrollProgress={scrollProgress} />
        <ProgressIndicator scrollProgress={scrollProgress} />
        <SoundToggle />
      </div>

      {/* Project detail panel, opened by clicking a project node in the 3D scene */}
      <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} />

      {/* Easter egg toast */}
      <div
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 px-5 py-3 rounded-full bg-navy-900/90 border border-gold-400/30 text-cream/90 font-body text-sm whitespace-nowrap pointer-events-none"
        style={{
          opacity: toast ? 1 : 0,
          transform: `translate(-50%, ${toast ? '0' : '8px'})`,
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}
      >
        {toast}
      </div>

      {/* Invisible scroll proxy - gives the page height to scroll through */}
      <div className="scroll-container" aria-hidden="true" />
    </SceneErrorBoundary>
  );
}
