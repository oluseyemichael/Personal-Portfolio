// Central design tokens for the entire experience.
// Change values here to re-theme the whole scene.

export const theme = {
  colors: {
    // Backgrounds
    bgDeep: '#050818',       // Near-black navy
    bgMid: '#0A0E24',        // Base navy
    bgLight: '#101635',      // Slightly lifted navy
    fog: '#0A0E24',          // Scene fog color

    // Accents (warm amber/gold)
    accentPrimary: '#FFC145',   // Main glow color
    accentSecondary: '#F59E0B', // Deeper amber
    accentTertiary: '#FBBF24',  // Bright highlight
    accentDeep: '#D97706',      // Rich orange

    // Text
    textPrimary: '#FFF8E7',    // Warm cream
    textMuted: 'rgba(255, 248, 231, 0.6)',
    textSubtle: 'rgba(255, 248, 231, 0.35)',
  },

  // Emissive intensities for the 3D materials
  emissive: {
    nodeIdle: 1.2,
    nodeHover: 2.5,
    connection: 0.8,
    avatar: 1.5,
    particle: 0.6,
  },

  // Scene proportions
  scene: {
    totalPathLength: 100,      // World units along the camera spline
    fogNear: 15,
    fogFar: 80,
    particleCount: 300,        // Background atmosphere particles
  },

  // Content zones along the scroll path (0 to 1 normalized).
  zones: {
    landing: { start: 0.0, end: 0.15, label: 'Welcome' },
    about:   { start: 0.15, end: 0.35, label: 'About' },
    work:    { start: 0.35, end: 0.65, label: 'Work' },
    skills:  { start: 0.65, end: 0.85, label: 'Skills' },
    contact: { start: 0.85, end: 1.0,  label: 'Contact' },
  },
};

// Convert hex string to THREE.Color-friendly value
export const hex = (c) => parseInt(c.replace('#', ''), 16);
