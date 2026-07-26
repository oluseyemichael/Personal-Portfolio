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

## Status: Sprint 0.5

Working now:
- Vertical scroll-driven camera descent through 5 distinct layer environments
- Real content from Michael's CV (bio, 5 projects, skills, contact)
- Warm amber/gold on deep navy design system
- Progress indicator, branded loading screen, zone text overlays

Not yet built (later sprints):
- Real 3D avatar (Sprint 1) - currently an abstract glowing figure
- Clickable project nodes with detail overlays (Sprint 2)
- AI companion powered by Claude (Sprint 3)
- Mobile 2D fallback (Sprint 3)

## TODO for Michael

Open `src/config/content.js` and replace:
- `YOUR_GITHUB_USERNAME` with your GitHub username
- `YOUR_LINKEDIN_HANDLE` with your LinkedIn handle

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
    StackLayers.jsx   # All five layer environments
    NeuralNode.jsx    # Glowing node (used by network layer)
    Connection.jsx    # Glowing link (used by network layer)
    AbstractAvatar.jsx# Placeholder figure at the surface
    Particles.jsx     # Vertical atmosphere shaft
  components/
    Header.jsx
    ZoneOverlays.jsx  # Text per layer, driven by content.js
    ProgressIndicator.jsx
```

## Design Tokens

Change `src/config/theme.js` to re-theme everything. Change `src/config/content.js` to update any text, project, or link. No content lives inside components.
