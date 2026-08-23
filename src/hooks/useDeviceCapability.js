import { useEffect, useState } from 'react';
import { getGPUTier } from 'detect-gpu';

/**
 * Detects GPU capability tier for performance scaling.
 * Everyone gets the 3D scene — no fallback. Lower-tier GPUs
 * simply get reduced effects (fewer particles, no bloom, no shadows, etc.).
 *
 * gpuTier mapping:
 *   1 = low  (mobile / integrated — minimal effects)
 *   2 = mid  (decent GPU — reduced effects)
 *   3 = high (discrete GPU — full effects)
 */
export function useDeviceCapability() {
  const [gpuTier, setGpuTier] = useState(() => {
    // Start with a sensible guess: mobile devices default to tier 1,
    // desktop defaults to tier 3. detect-gpu will refine this async.
    if (typeof window === 'undefined') return 3;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    return isTouchDevice ? 1 : 3;
  });

  useEffect(() => {
    let cancelled = false;
    getGPUTier()
      .then(({ tier }) => {
        if (cancelled) return;
        setGpuTier(Math.max(1, Math.min(3, tier)));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return { gpuTier };
}
