import * as THREE from 'three';

// THE STACK: the camera descends through system layers.
// Layer Y positions:
//   Surface/Product:  y = 0     (Landing)
//   Application:      y = -12   (About)
//   Server:           y = -24   (Work)
//   Network:          y = -36   (Skills)
//   Bare Metal:       y = -48   (Contact)

export const LAYERS = {
  surface: 0,
  application: -12,
  server: -24,
  network: -36,
  metal: -48,
};

export const cameraWaypoints = [
  // LANDING - hovering at the surface, facing the avatar
  { position: [0, 2.8, 8],     lookAt: [0, 1.6, 0] },
  { position: [2.5, 0, 7],     lookAt: [0, -3, 0] },

  // Descend to ABOUT (application layer)
  { position: [4, -9.5, 6],    lookAt: [0, -12, 0] },
  { position: [2, -15, 6],     lookAt: [-1, -19, 0] },

  // Descend to WORK (server layer)
  { position: [-3.5, -21.5, 6.5], lookAt: [0, -24, 0] },
  { position: [-4, -28, 6],    lookAt: [0, -31, 0] },

  // Descend to SKILLS (network layer)
  { position: [0, -33.5, 7],   lookAt: [0, -36, 0] },
  { position: [2.5, -40.5, 6], lookAt: [0, -44, 0] },

  // Arrive at CONTACT (bare metal)
  { position: [0, -45.5, 6.5], lookAt: [0, -48, 0] },
  { position: [0, -46.5, 5],   lookAt: [0, -48.5, -1] },
];

export const positionCurve = new THREE.CatmullRomCurve3(
  cameraWaypoints.map(w => new THREE.Vector3(...w.position)),
  false,
  'catmullrom',
  0.3,
);

export const lookAtCurve = new THREE.CatmullRomCurve3(
  cameraWaypoints.map(w => new THREE.Vector3(...w.lookAt)),
  false,
  'catmullrom',
  0.3,
);

// Ease a linear scroll (0 to 1) into something cinematic
export function easeScroll(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
