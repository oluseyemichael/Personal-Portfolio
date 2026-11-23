import { useThree } from '@react-three/fiber';

/** True when the canvas is taller than wide (phones held upright). Keep the
 *  threshold in sync with src/hooks/useIsPortrait.js. */
export function usePortrait() {
  return useThree((s) => s.size.width / s.size.height < 0.9);
}
