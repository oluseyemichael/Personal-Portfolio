import { useRef, useEffect, useState, useCallback, lazy, memo, Suspense } from 'react';
import { ZoneOverlays } from './components/ZoneOverlays.jsx';
import { ProgressIndicator } from './components/ProgressIndicator.jsx';
import { ProjectDetail } from './components/ProjectDetail.jsx';
import { SceneErrorBoundary } from './components/SceneErrorBoundary.jsx';
import { SoundToggle } from './components/SoundToggle.jsx';
// AI guide is switched off for now. To bring it back, uncomment the import and the element, and set ANTHROPIC_API_KEY.
// import { AICompanion } from './components/AICompanion.jsx';
import { MobileFallback } from './components/MobileFallback.jsx';
import { Header } from './components/Header.jsx';
import { useScrollProgress } from './hooks/useScrollProgress.js';
import { useDeviceCapability } from './hooks/useDeviceCapability.js';
import { useIsPortrait } from './hooks/useIsPortrait.js';
import { useKonamiCode } from './hooks/useKonamiCode.js';
import { trackEvent } from './analytics.js';

const SCROLL_MILESTONES = [25, 50, 75, 100];

// Lazy-loaded so the ~1MB three/r3f bundle downloads after the critical
// shell paints, instead of blocking it. The HTML/CSS loading screen
// (index.html) covers this gap with no JS dependency of its own.
const Scene = lazy(() => import('./scene/Scene.jsx').then((m) => ({ default: memo(m.Scene) })));

// Everyone gets the 3D experience (phones included, in a portrait composition)
// unless they ask for the lite site, have no WebGL, or have asked their
// browser to save data. `?view=2d` / `?view=3d` always wins.
function shouldUse2D() {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  if (params.get('view') === '3d') return false;
  if (params.get('view') === '2d') return true;
  if (navigator.connection?.saveData) return true;
  try {
    const c = document.createElement('canvas');
    return !(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return true;
  }
}

export default function App() {
  const [use2D] = useState(shouldUse2D);
  return use2D ? <MobileFallback /> : <ExperienceApp />;
}

function ExperienceApp() {
  const { gpuTier } = useDeviceCapability();
  const portrait = useIsPortrait();

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

  const handleSelectProject = useCallback((project) => {
    if (project) trackEvent('project_click', { project: project.id });
    setSelectedProject(project);
  }, []);
  const handleCloseProject = useCallback(() => setSelectedProject(null), []);

  // Easter eggs: the Konami code, or 5 clicks on the landing avatar,
  // both dispatch a window 'easter-egg' event that this toast listens
  // for (HeroStack.jsx dispatches its own on the 5-click gag).
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
      new CustomEvent('easter-egg', { detail: { message: 'Konami code? Respect.' } }),
    );
  }, []);
  useKonamiCode(activateKonami);



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
        <Header scrollProgress={scrollProgress} portrait={portrait} />
        <ZoneOverlays scrollProgress={scrollProgress} onSelectProject={handleSelectProject} portrait={portrait} />
        <ProgressIndicator scrollProgress={scrollProgress} portrait={portrait} />
        <SoundToggle portrait={portrait} />
        {/* <AICompanion /> */}
      </div>

      {/* Project detail panel, opened by clicking a project node in the 3D scene */}
      <ProjectDetail project={selectedProject} onClose={handleCloseProject} />

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
