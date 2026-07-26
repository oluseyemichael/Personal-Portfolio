# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install
npm run dev      # vite dev server at http://localhost:3000
npm run build    # production build to dist/
npm run preview  # preview the production build locally
npm run lint     # eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0
```

There is no test suite. There is no ESLint config file checked in yet, so `npm run lint` will fail until one is added — don't assume it works without checking first.

## What this is

A single-page 3D portfolio ("Every Layer") built with React Three Fiber. The whole experience is one continuous vertical scroll: the user scrolls down and a virtual camera descends through five stacked "layers" of a system (Product → Application → Server → Network → Bare Metal), mirroring the career arc described in `src/config/content.js`. There is no routing and no separate pages — scroll position is the only navigation state.

## Architecture

**Scroll drives everything, via a ref, not React state, for the hot path.**
`useScrollProgress` (`src/hooks/useScrollProgress.js`) reads `window.scrollY` against document height, smooths it with a per-frame lerp, and exposes it as React state for UI overlays that need re-renders (`ZoneOverlays`, `ProgressIndicator`). `App.jsx` also mirrors that value into a plain `useRef` (`scrollRef`) each time it changes, and passes the ref (not the state) down into the `Scene`/`CameraRig`. `CameraRig` reads `scrollRef.current` inside `useFrame` every frame — this deliberately avoids triggering a React re-render 60 times a second. When touching scroll-to-3D wiring, preserve this split: state for DOM/UI, ref for the R3F render loop.

**The camera path is a spline, not per-layer camera cuts.**
`src/scene/CameraPath.js` defines `LAYERS` (the Y position of each of the 5 layers) and `cameraWaypoints` (position + lookAt pairs), then builds two `THREE.CatmullRomCurve3` curves (`positionCurve`, `lookAtCurve`) through those waypoints. `easeScroll()` remaps linear scroll progress (0-1) into an eased t value. `CameraRig.jsx` samples both curves at that t every frame and lerps the real camera toward the sampled point. To adjust *where* the camera goes or *when* it arrives at a layer, edit the waypoints/`LAYERS` in `CameraPath.js` — don't add imperative camera jumps elsewhere.

**Content and visual/design tokens are fully decoupled from components.**
- `src/config/content.js` is the only place with actual copy: bio, story timeline, 5 projects (each tagged with a `layer` field matching a `LAYERS` key), skills, credentials, contact info. No component should hardcode text.
- `src/config/theme.js` is the only place with colors, emissive intensities, scene proportions (fog distances, particle count), and the scroll `zones` (start/end fractions of 0-1 mapped to each named section — Welcome/About/Work/Skills/Contact). `hex()` converts a `#rrggbb` string to the numeric form `THREE.Color`/materials expect.
- Changing either file re-themes or re-writes the whole experience without touching scene code.

**Two parallel layer concepts, kept distinct:** `LAYERS` in `CameraPath.js` (5 keys: surface/application/server/network/metal — literal Y depths in 3D space) and `zones` in `theme.js` (5 keys: landing/about/work/skills/contact — 0-1 fractions of scroll used to decide which `ZoneOverlays` text is showing). They're conceptually aligned (each 3D layer corresponds to one scroll zone) but are separate data structures serving separate consumers (3D scene vs. DOM overlay) — a change to one does not automatically move the other.

**`Scene.jsx`** is the composition root for all 3D content: sets up the `Canvas`, fog, clear color, one point light per layer (position keyed off `LAYERS`), and mounts `AbstractAvatar`, `StackLayers` (the actual five environments), `Cables` (connectors between layers), `DepthMarkers` (submarine-style depth readout), `Particles` (atmosphere), and `CameraRig`, in that order (order matters for transparency/fog blending).

**DOM/UI overlay sits in a separate absolutely-positioned layer over the canvas**, driven by the same `scrollProgress` state: `Header`, `ZoneOverlays` (picks copy from `content.js` based on which `theme.zones` range the scroll progress falls in), `ProgressIndicator`. `App.jsx` also renders an invisible `.scroll-container` div purely to give the page scrollable height — the canvas itself is fixed/non-scrolling; scrolling only ever moves through this proxy element.

## Project status

Per `README.md`, this is "Sprint 0.5." Known-incomplete by design, not by omission: the avatar is a placeholder abstract shape (real avatar is Sprint 1), project nodes aren't yet clickable, there's no AI companion yet, and there's no mobile 2D fallback. Don't "fix" these as if they were bugs unless asked.

`src/config/content.js` still has placeholder GitHub/LinkedIn URLs (`YOUR_GITHUB_USERNAME`, `YOUR_LINKEDIN_HANDLE`) pending the site owner filling them in.

## Deploy

Static Vite build deployed to Vercel (`vercel.json` present); no server-side code in this repo.
