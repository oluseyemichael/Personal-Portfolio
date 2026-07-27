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

/**
 * The 2D fallback is a true fallback now, not a blanket "mobile" rule:
 * a phone with no WebGL support gets it immediately, and a phone with
 * a weak GPU (tier 0-1, detected async below) gets it once that's known.
 * Viewport width alone no longer forces it - capable phones get the
 * real 3D scene, just with effects dialed down per gpuTier.
 */
function computeIsMobile() {
  return !hasWebGL();
}

/**
 * Drives routing between the 3D Scene and the 2D fallback, plus how
 * hard the 3D scene is allowed to push the GPU.
 *
 * `isMobile` starts from a synchronous WebGL check (no flash).
 * `detect-gpu`'s tier classification resolves shortly after and can
 * only make things more conservative: a weak GPU (tier 0-1) forces
 * the 2D fallback, and tier 2 dials bloom/particles/shadows down
 * instead of running full effects.
 */
export function useDeviceCapability() {
  const [state, setState] = useState(() => ({
    isMobile: typeof window === 'undefined' ? false : computeIsMobile(),
    gpuTier: 3,
  }));

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
