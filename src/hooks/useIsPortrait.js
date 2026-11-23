import { useEffect, useState } from 'react';

// Portrait phones and tablets get their own composition: the 3D object sits
// in the upper part of the screen and the copy in a bottom sheet area.
const PORTRAIT_RATIO = 0.9;

const check = () =>
  typeof window !== 'undefined' && window.innerWidth / window.innerHeight < PORTRAIT_RATIO;

export function useIsPortrait() {
  const [portrait, setPortrait] = useState(check);

  useEffect(() => {
    const update = () => setPortrait(check());
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  return portrait;
}
