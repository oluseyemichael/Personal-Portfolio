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
`src/scene/CameraPath.js` defines `LAYERS` (the Y position of each of the 5 layers) and `cameraWaypoints` (position + lookAt pairs), then builds two `THREE.CatmullRomCurve3` curves (`positionCurve`, `lookAtCurve`) through those waypoints. `easeScroll()` maps scroll (0-1) to the spline parameter by keyframes: the camera slows to a near stop at the centre of each layer (scroll 0.1/0.3/0.5/0.7/0.9) and travels between them. The layer hero shots are found automatically from waypoints 0/2/4/6/8 (`HERO_WAYPOINTS`), so if you move those waypoints the dwell points follow. `CameraRig.jsx` samples both curves at that t every frame and lerps the real camera toward the sampled point. To adjust *where* the camera goes or *when* it arrives at a layer, edit the waypoints/`LAYERS` in `CameraPath.js` — don't add imperative camera jumps elsewhere.

**Content and visual/design tokens are fully decoupled from components.**
- `src/config/content.js` is the only place with actual copy (facts are sourced from the two CV PDFs in this folder; the AI guide reads the whole object, so keep it accurate; no em dashes, first-person plain voice). Besides bio/projects/skills it holds `copy` (headings and microcopy), `now` (current roles, both ongoing) and `stats` (the number grid on About): bio, story timeline, 5 projects (each tagged with a `layer` field matching a `LAYERS` key), skills, credentials, contact info. No component should hardcode text.
- `src/config/theme.js` is the only place with colors, emissive intensities, scene proportions (fog distances, particle count), and the scroll `zones` (start/end fractions of 0-1 mapped to each named section — Welcome/About/Work/Skills/Contact). `hex()` converts a `#rrggbb` string to the numeric form `THREE.Color`/materials expect.
- Changing either file re-themes or re-writes the whole experience without touching scene code.

**Two parallel layer concepts, kept distinct:** `LAYERS` in `CameraPath.js` (5 keys: surface/application/server/network/metal — literal Y depths in 3D space) and `zones` in `theme.js` (5 keys: landing/about/work/skills/contact — 0-1 fractions of scroll used to decide which `ZoneOverlays` text is showing). They're conceptually aligned (each 3D layer corresponds to one scroll zone) but are separate data structures serving separate consumers (3D scene vs. DOM overlay) — a change to one does not automatically move the other.

**`Scene.jsx`** is the composition root: `Canvas`, tight fog (9-38), one lighting language (hemisphere + warm directional key, plus an `Environment` map on tier 3), `StackLayers`, `Particles`, `CameraRig`, and post-processing on tiers 2-3. `StackLayers.jsx` composes the layers: `HeroStack` (landing: five labelled slabs, one per layer; 5 clicks fires the easter egg), `ApplicationLayer` (drifting service panels), `ServerRack` (see below), `NetworkLayer` (skills constellation; names appear on hover) and `MetalLayer` (circuit floor + core). The rack and constellation deliberately sit in the right half of the screen because the copy occupies the left; keep that composition when adding things.

**`ServerRack.jsx`** builds a real 19" rack from boxes. Each project is a 2U `ProjectUnit` whose title/role are drei `Text` on the faceplate, with pointer handlers on the unit group (hover pulls it out of the rack; click calls `onSelectProject`). Filler units (switch, blanks, UPS) are decoration. Don't use `<Html>` labels in the scene: they were the cause of the earlier floating-pill look and cost DOM updates per frame.

**DOM/UI overlay sits in a separate absolutely-positioned layer over the canvas**, driven by the same `scrollProgress` state: `Header`, `ZoneOverlays` (copy from `content.js` per `theme.zones` range, plus a left scrim for legibility; the Work list rows are real buttons that open `ProjectDetail`, same as clicking a rack unit) and `ProgressIndicator`. Zones are 0.2 wide each and carry a `focus` scroll position used by every jump control. Heading type scales with viewport height (`.h-display`, `.h-hero` in `styles.css`) so copy does not hit the header on short screens. `App.jsx` also renders an invisible `.scroll-container` div purely to give the page scrollable height — the canvas itself is fixed/non-scrolling; scrolling only ever moves through this proxy element.

## Runtime features layered on the scene

- **GPU tiering:** `useDeviceCapability` (detect-gpu) yields `gpuTier` 1-3, guessed synchronously from touch capability then refined async. `App` passes it to `Scene`/`StackLayers`, which scale effects (particles, bloom, etc.) — everyone gets the 3D scene, only effects are reduced.
- **Lazy scene:** `Scene` is `React.lazy`-loaded in `App.jsx` so the ~1MB three/r3f chunk loads after the shell; the loading screen lives in plain HTML/CSS in `index.html`. `vite.config.js` splits `three` and `r3f` into manual chunks.
- **Routing:** `App.jsx` `shouldUse2D()` sends a visitor to `MobileFallback` only if WebGL is missing, the browser asks to save data, or `?view=2d` is set (`?view=3d` forces 3D). Phones get the 3D scene in a portrait composition, with a "Lite" link in the header and contact copy as the escape hatch. `SceneErrorBoundary` also falls back to the 2D site if the scene throws.
- **Portrait mode** (canvas aspect < 0.9, so phones and portrait tablets; threshold lives in both `src/hooks/useIsPortrait.js` for the DOM and `src/scene/usePortrait.js` for R3F, keep them in sync): `CameraRig` widens the FOV to 62, shifts the rendered image up with `camera.setViewOffset` (the 3D subject owns the top half, copy owns the bottom) and flattens the camera path's sideways drift. Scene components read `usePortrait()` and centre/scale themselves: thicker hero slabs, a column of service panels, the rack at x=0 with two-line titles and no role line, and a tilted, smaller skills constellation with wrapped labels. `ZoneOverlays`/`Header`/`ProgressIndicator`/`SoundToggle` take a `portrait` prop (bottom-anchored copy, 44px targets, safe-area insets). In the Work layer the rack is the interface; the project list is `sr-only` for screen readers. Touch has no hover, so skill names show on tap for ~2s.
- **LayerGate** (`StackLayers.jsx`) only renders a layer while the camera is within 9 units of it (the first 12 frames render everything so the rack's baked contact shadow captures its subject). It stops neighbouring layers bleeding into a wide portrait view and saves GPU on every device. Any new per-layer content must go inside a gate.
- **2D site (`MobileFallback`):** a mobile-first redesign (sticky section tabs with scroll-spy, the five layers as a tappable index, project rows that open `ProjectDetail`, 44px+ touch targets, safe-area insets, no horizontal scroll). Its sections carry `id="zone-<key>"` so `goToZone` can scroll them. Keep body text at or above cream/60 on navy (about 6.9:1 contrast); cream/40 and below fails WCAG AA for small text.
- **Adaptive quality:** `Scene.jsx` uses drei `PerformanceMonitor` to lower the effective tier at runtime. Avoid `transmission` materials (extra full-scene render pass) and extra lights.
- **AI companion (currently disabled):** the `<AICompanion />` renders in `App.jsx` and `MobileFallback.jsx` are commented out, and `content.copy.built` no longer mentions it. Everything below still exists and works once re-enabled; also restore the "Claude-powered guide" line in `content.copy.built`. `AICompanion.jsx` posts to `/api/chat`. Logic lives in `server/chat.js` (system prompt built from `content.js`, model `claude-haiku-5-5`), exposed by `api/chat.js` on Vercel and by a dev middleware in `vite.config.js`. Needs `ANTHROPIC_API_KEY` (see `.env.example`); without it the widget shows its fallback message. Replies may end in `[[goto:zone]]`, rendered as a navigation button via `src/lib/navigate.js`.
- **Project detail:** clicking a project node in the scene calls `onSelectProject` up to `App`, which renders `ProjectDetail` (2D slide-in panel) outside the canvas.
- **Easter eggs** communicate via a `window` `easter-egg` CustomEvent (Konami code in `useKonamiCode`, avatar 5-click in `AbstractAvatar.jsx`); `App` listens and shows a toast.
- **Sound:** `src/audio/soundEngine.js` is procedural Web Audio (no audio files), silent until the user toggles it via `SoundToggle`.
- **Analytics:** `trackEvent` in `src/analytics.js` no-ops unless `window.plausible` exists (add the script tag to `index.html` to enable).

## Project status

`README.md` was refreshed with the AI companion setup. There is no 3D avatar: the old placeholder figure was replaced by `HeroStack` (a real avatar model is still an open PRD item). `The_Mind_Map_PRD.md` holds the full product plan. The PRD has an "Implementation Status" table at the top.

## Deploy

Vite build deployed to Vercel (`vercel.json` present). The only server-side code is the `api/chat.js` function; set `ANTHROPIC_API_KEY` in Vercel env vars. Note the `vercel.json` catch-all rewrite sends everything to `index.html`, so confirm `/api/chat` still resolves after deploy (an `/api/(.*)` rewrite is already placed above it).
