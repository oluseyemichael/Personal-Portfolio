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

  // Descend to WORK (server layer) - wide perspective framing server rack array
  { position: [0, -21.8, 8.5], lookAt: [0, -24, 0] },
  { position: [-2, -28, 6.5],   lookAt: [0, -31, 0] },

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

// Camera spline parameter (0-1, by arc length) at which each layer is
// framed best. Found by locating the spline point nearest the waypoint
// chosen as that layer's hero shot.
const HERO_WAYPOINTS = [0, 2, 4, 6, 8];
function nearestT(target) {
  let best = 0;
  let bestD = Infinity;
  const p = new THREE.Vector3();
  for (let i = 0; i <= 800; i++) {
    const t = i / 800;
    positionCurve.getPointAt(t, p);
    const d = p.distanceToSquared(target);
    if (d < bestD) { bestD = d; best = t; }
  }
  return best;
}
const LAYER_T = HERO_WAYPOINTS.map((w) => nearestT(new THREE.Vector3(...cameraWaypoints[w].position)));

// Scroll position (0-1) at the centre of each layer's dwell. Layers are
// evenly spaced: zones are 0.2 wide, centred at 0.1, 0.3, 0.5, 0.7, 0.9.
const smootherstep = (x) => x * x * x * (x * (x * 6 - 15) + 10);

/**
 * Maps linear scroll to a spline parameter. The camera eases to a near
 * stop at the heart of every layer (so each one is actually framed while
 * its copy is on screen) and travels between them in the gaps.
 */
export function easeScroll(s) {
  const n = LAYER_T.length;
  const centre = (i) => 0.1 + i * 0.2;
  if (s <= centre(0)) return LAYER_T[0];
  if (s >= centre(n - 1)) return LAYER_T[n - 1];
  const i = Math.min(n - 2, Math.floor((s - 0.1) / 0.2));
  const u = (s - centre(i)) / 0.2;
  return LAYER_T[i] + (LAYER_T[i + 1] - LAYER_T[i]) * smootherstep(u);
}
