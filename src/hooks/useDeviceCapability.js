import { useEffect, useState } from 'react';
import { getGPUTier } from 'detect-gpu';

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

function computeIsMobile() {
  return window.innerWidth < 768 || !hasWebGL();
}

/**
 * Drives routing between the 3D Scene and the 2D fallback, plus how
 * hard the 3D scene is allowed to push the GPU.
 *
 * `isMobile` starts from a synchronous viewport/WebGL check (no flash).
 * `detect-gpu`'s tier classification resolves shortly after and can
 * only make things more conservative: a weak GPU (tier 0-1) forces
 * the 2D fallback even on a wide desktop viewport, and tier 2 dials
 * bloom/particles down instead of running full effects.
 */
export function useDeviceCapability() {
  const [state, setState] = useState(() => ({
    isMobile: typeof window === 'undefined' ? false : computeIsMobile(),
    gpuTier: 3,
  }));

  useEffect(() => {
    const update = () => setState((s) => ({ ...s, isMobile: s.isMobile || computeIsMobile() }));
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    let cancelled = false;
    getGPUTier()
      .then(({ tier }) => {
        if (cancelled) return;
        setState((s) => ({
          isMobile: s.isMobile || tier <= 1,
          gpuTier: tier >= 3 ? 3 : 2,
        }));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
