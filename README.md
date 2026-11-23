# Every Layer

Michael Oluseye's 3D interactive portfolio. A scroll-driven descent through the layers of a living system, from product down to bare metal. Built with React Three Fiber.

## The Concept

Michael's career climbed the stack: support > infrastructure > backend > product. This portfolio inverts that journey for the visitor: you start at the surface (the product layer) and descend through each layer he has worked at.

- **Surface / Product** (Landing): floating UI fragments, avatar greeting
- **Layer 01 / Application** (About): wireframe code structures
- **Layer 02 / Server** (Work): glowing server racks with blinking slot lights
- **Layer 03 / Network** (Skills): topology grid with pulsing links
- **Layer 04 / Bare Metal** (Contact): circuit-trace floor with a glowing core

Tagline: "I've worked at every layer."

## Status

Working: scroll-driven 5-layer descent, real CV content, clickable project nodes with detail panel, skills clusters, procedural sound (off by default), GPU tiering with runtime adaptive quality, portrait 3D mode for phones, plus a lite 2D site for no-WebGL / data-saver / on request (`?view=2d`; `?view=3d` forces 3D), AI companion chat, easter eggs, analytics hooks, OG tags.

Not yet: real 3D avatar, custom domain, Plausible script.

## AI companion

Copy `.env.example` to `.env` and set `ANTHROPIC_API_KEY` (and add the same variable in Vercel). The key stays server-side in `api/chat.js`.

## Setup

Requires Node.js 18+.

```bash
npm install
npm run dev      # opens http://localhost:3000
npm run build    # production build
```

## Deploy to Vercel

1. Push to a GitHub repo
2. vercel.com > Add New Project > import the repo > Deploy

## Project Structure

```
src/
  config/
    theme.js          # Colors, zones, scene constants
    content.js        # ALL portfolio content (bio, projects, skills, contact)
  hooks/
    useScrollProgress.js
  scene/
    Scene.jsx         # Root canvas, lights, fog
    CameraPath.js     # LAYERS constants + descent waypoints
    CameraRig.jsx     # Camera follows scroll along spline
    StackLayers.jsx   # Layer environments (application, network, bare metal)
    HeroStack.jsx     # Landing centrepiece: five slabs, one per layer
    ServerRack.jsx    # 3D rack; each project is a clickable server
    Connection.jsx    # Glowing link (application and network layers)
    Particles.jsx     # Vertical atmosphere shaft
  components/
    Header.jsx
    ZoneOverlays.jsx  # Text per layer, driven by content.js
    ProgressIndicator.jsx
```

## Design Tokens

Change `src/config/theme.js` to re-theme everything. Change `src/config/content.js` to update any text, project, or link. No content lives inside components.
