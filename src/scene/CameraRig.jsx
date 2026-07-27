import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { positionCurve, lookAtCurve, easeScroll } from './CameraPath.js';

const UP = new THREE.Vector3(0, 1, 0);
const MAX_PITCH = 1.3; // radians - keeps the view from flipping past vertical
const LOOK_SPEED = 0.004;

/**
 * Moves the camera along the spline based on scroll progress, exactly
 * as before. On top of that, dragging with the mouse anywhere on the
 * canvas free-looks around: it rotates the spline's look-at direction
 * by the accumulated drag yaw/pitch, so visitors can spin 360 and see
 * whatever's around them at their current point in the descent. Scroll
 * position and pacing are untouched - only where the camera is
 * *pointed* changes, never where it *is*. Mouse-only (checked via
 * pointerType) so it doesn't fight touch-scrolling on mobile.
 */
export function CameraRig({ scrollRef }) {
  const { camera, gl } = useThree();
  const targetPos = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const right = useRef(new THREE.Vector3());
  const finalLookAt = useRef(new THREE.Vector3());

  const yaw = useRef(0);
  const pitch = useRef(0);
  const dragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const dom = gl.domElement;

    const onPointerDown = (e) => {
      if (e.pointerType !== 'mouse') return;
      dragging.current = true;
      lastPointer.current = { x: e.clientX, y: e.clientY };
    };
    const onPointerMove = (e) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      lastPointer.current = { x: e.clientX, y: e.clientY };
      yaw.current -= dx * LOOK_SPEED;
      pitch.current = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, pitch.current - dy * LOOK_SPEED));
    };
    const onPointerUp = () => { dragging.current = false; };

    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [gl]);

  useFrame((_, delta) => {
    const t = easeScroll(scrollRef.current);
    positionCurve.getPointAt(t, targetPos.current);
    lookAtCurve.getPointAt(t, targetLookAt.current);

    // Smoothly interpolate the camera toward the target position.
    // The lerp factor is tuned for 60fps; scale it by delta so the
    // camera glides at the same speed regardless of frame rate.
    const smoothing = 1 - Math.pow(1 - 0.1, delta * 60);
    camera.position.lerp(targetPos.current, smoothing);

    // Apply the drag-accumulated yaw/pitch on top of the spline's
    // look-at direction, around the camera's current position.
    direction.current.copy(targetLookAt.current).sub(camera.position);
    direction.current.applyAxisAngle(UP, yaw.current);
    right.current.copy(direction.current).cross(UP).normalize();
    direction.current.applyAxisAngle(right.current, pitch.current);
    finalLookAt.current.copy(camera.position).add(direction.current);

    camera.lookAt(finalLookAt.current);
  });

  return null;
}
