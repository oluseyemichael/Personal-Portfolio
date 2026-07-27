import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { positionCurve, lookAtCurve, easeScroll } from './CameraPath.js';

/**
 * Moves the camera along the spline based on scroll progress.
 * `scrollRef` is a ref object holding the current scroll value (0 to 1).
 * Using a ref instead of state prevents re-renders every scroll frame.
 */
export function CameraRig({ scrollRef }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const t = easeScroll(scrollRef.current);
    positionCurve.getPointAt(t, targetPos.current);
    lookAtCurve.getPointAt(t, targetLookAt.current);

    // Smoothly interpolate the camera toward the target position.
    // The lerp factor is tuned for 60fps; scale it by delta so the
    // camera glides at the same speed regardless of frame rate.
    const smoothing = 1 - Math.pow(1 - 0.1, delta * 60);
    camera.position.lerp(targetPos.current, smoothing);
    camera.lookAt(targetLookAt.current);
  });

  return null;
}
