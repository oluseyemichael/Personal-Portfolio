import { useEffect, useState } from 'react';

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
 * True when the viewport is narrow (< 768px) or the device/browser
 * cannot do WebGL. Drives routing between the 3D Scene and the 2D
 * fallback in App.jsx.
 */
export function useDeviceCapability() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === 'undefined' ? false : computeIsMobile(),
  );

  useEffect(() => {
    const update = () => setIsMobile(computeIsMobile());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return isMobile;
}
