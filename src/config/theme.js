// Central design tokens for the WeAreKettle & UnitedCarriers inspired visual system.
// Deep obsidian black, machined steel chassis, crisp bone white typography, cyan HUD indicators.

export const theme = {
  colors: {
    // Deep obsidian & dark space backgrounds
    bgDeep: '#06080F',       // Pure dark obsidian space
    bgMid: '#0B0F19',        // Structural card base
    bgLight: '#121827',      // Elevated surface navy
    fog: '#06080F',          // Scene fog color

    // Metallic chassis & precision rim borders
    metalDark: '#0D1322',    // Dark architectural panel
    metalMid: '#1E293B',     // Steel chassis frame
    metalSteel: '#475569',   // Polished steel
    metalSilver: '#E2E8F0',  // Platinum highlights
    glassBorder: 'rgba(255, 255, 255, 0.10)', // Hairline border
    glassBg: 'rgba(11, 15, 25, 0.85)',         // Dark architectural card backdrop

    // Precision Accents (UnitedCarriers Cyan & Platinum)
    accentPrimary: '#38BDF8',   // Crisp HUD telemetry cyan
    accentSecondary: '#F8FAFC', // Bone white
    accentTertiary: '#94A3B8',  // Platinum slate
    accentDeep: '#0284C7',      // Deep electric blue
    statusOk: '#10B981',        // Telemetry status ok

    // Text & HUD Labels (High-contrast Bone White & Slate)
    textPrimary: '#F8FAFC',    // Bone white
    textMuted: '#94A3B8',      // Slate grey
    textSubtle: 'rgba(148, 163, 184, 0.4)',
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
