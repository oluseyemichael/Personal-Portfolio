// Central design tokens for the entire experience.
// Warm amber/gold theme on deep navy space backdrop.

export const theme = {
  colors: {
    // Deep navy & space backgrounds (original theme)
    bgDeep: '#050818',       // Near-black navy
    bgMid: '#0A0E24',        // Core base navy
    bgLight: '#101635',      // Elevated surface navy
    fog: '#0A0E24',          // Scene fog color

    // Metallic chassis & glass panel accents
    metalDark: '#121829',    // Brushed dark aluminum
    metalMid: '#1e293b',     // Machined steel frame
    metalSteel: '#475569',   // Polished steel
    metalSilver: '#CBD5E1',  // Chrome / silver collar highlights
    glassBorder: 'rgba(255, 255, 255, 0.12)', // Crisp glass rim border
    glassBg: 'rgba(10, 14, 36, 0.72)',         // Frosted glass card backdrop

    // Accents (Warm Amber / Gold primary system)
    accentPrimary: '#FFC145',   // Main warm golden glow
    accentSecondary: '#F59E0B', // Rich amber accent
    accentTertiary: '#FBBF24',  // Bright golden highlight
    accentDeep: '#D97706',      // Rich orange/burnished amber
    statusOk: '#10B981',        // Telemetry green indicator

    // Text & HUD Labels (Warm Cream)
    textPrimary: '#FFF8E7',    // Warm cream white
    textMuted: 'rgba(255, 248, 231, 0.65)',
    textSubtle: 'rgba(255, 248, 231, 0.35)',
  },

  // Emissive intensities for 3D materials
  emissive: {
    nodeIdle: 0.8,
    nodeHover: 2.0,
    connection: 0.6,
    avatar: 1.2,
    particle: 0.5,
  },

  // Scene proportions & path physics
  scene: {
    totalPathLength: 100,      // World units along camera spline
    fogNear: 12,
    fogFar: 80,
    particleCount: 350,        // Atmospheric dust particles
  },

  // Content zones along the scroll path (0 to 1 normalized).
  zones: {
    landing: { start: 0.0, end: 0.15, label: 'Product', code: '00_SURFACE' },
    about:   { start: 0.15, end: 0.35, label: 'About', code: '01_APPLICATION' },
    work:    { start: 0.35, end: 0.65, label: 'Work', code: '02_SERVER' },
    skills:  { start: 0.65, end: 0.85, label: 'Skills', code: '03_NETWORK' },
    contact: { start: 0.85, end: 1.0,  label: 'Contact', code: '04_BARE_METAL' },
  },
};

// Convert hex string to THREE.Color-friendly value
export const hex = (c) => parseInt(c.replace('#', ''), 16);



