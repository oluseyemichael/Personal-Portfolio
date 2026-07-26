import { useEffect, useRef, useState } from 'react';

/**
 * Returns a smoothed scroll progress value between 0 and 1.
 * Uses lerp for smoothing to avoid raw scroll jitter.
 * The value updates on every animation frame.
 */
export function useScrollProgress(smoothing = 0.08) {
  const [progress, setProgress] = useState(0);
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const updateTarget = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      targetRef.current = scrollHeight > 0 ? Math.min(1, Math.max(0, scrollTop / scrollHeight)) : 0;
    };

    const animate = () => {
      // Lerp toward the target for smoothness
      currentRef.current += (targetRef.current - currentRef.current) * smoothing;
      setProgress(currentRef.current);
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', updateTarget, { passive: true });
    window.addEventListener('resize', updateTarget);
    updateTarget();
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', updateTarget);
      window.removeEventListener('resize', updateTarget);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [smoothing]);

  return progress;
}
