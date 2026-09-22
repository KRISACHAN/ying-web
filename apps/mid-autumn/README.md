# @ying-web/mid-autumn

An interactive Mid-Autumn Festival web piece — "共望一轮月" (we look up at the same moon), centered on a detailed moon, a night sky, and a personal note.

Three layers:

1. **See the moon** — a detailed 3D moon with soft, moving moonlight;
2. **Wait for Mid-Autumn** — a clear countdown to the festival (农历八月十五);
3. **Leave a thought** — write a line to someone you miss, or to your future self.

The moon carries longing through composition, light and text. This is an artistic night scene, not a scaled astronomical simulation.

## Festival countdown (real time)

- Before the festival: counts down to this year's Mid-Autumn;
- On the festival day: shows **「今夕月圆」**;
- After the day ends: rolls over to wait for next year.

All dates use the browser's local-time-zone midnight. The countdown uses real time and is independent of scene animation. The lunar table covers 1900–2099; outside that range the UI shows an explicit notice.

## Moonlit scene

- **Moon surface**: LROC color and LOLA elevation maps add color and subtle relief; the camera remains steady.
- **Rotation**: press the moon with the left mouse button or a finger, then drag in any direction for continuous 360° rotation. Pointer capture keeps the gesture active after the finger leaves the sphere; the displayed rotation smoothly follows touch samples. Background parallax pauses during a drag.
- **Spatial depth**: the Milky Way panorama forms the far spherical dome. Stars, faint haze and golden dust occupy different 3D depths and respond with restrained near/far parallax. The camera and moon framing stay steady.
- **Moonlight**: 3D shells behind the moon produce a gently pulsing glow and two broad outward waves. Their light fades before each shell's edge.
- **Stars and meteors**: near and far stars twinkle individually, while nearby dust stays crisp. A few meteors cross quickly at different depths, with a bright head and a thin trail; the moon can occlude them.
- **Continuous motion**: ambient moon and galaxy motion, the background glow and spreading waves loop automatically, including while a note is open. There is no playback toggle. Reduced-motion settings disable these automatic effects and meteors while direct moon dragging remains available.

## Leave a thought (note time)

- Optional name field + a message within 120 characters, stored only in this browser's `localStorage`;
- Clearly labeled "kept only in this browser, never sent to anyone". No cross-device or permanence promises;
- Viewable, editable and deletable after saving; storage failures are reported; user text renders as plain text, never HTML;
- No name/email/location collection, no pre-seeded fake messages.

## Tech stack

React 18 · TypeScript · Vite 5 · Three.js / @react-three/fiber / @react-three/postprocessing · plain CSS.

Bundled local textures: moon color/elevation (NASA LRO/LROC, LOLA) and the ESO all-sky Milky Way — no external asset dependency.

## Structure

- `src/utils/lunar.ts`, `src/utils/festival.ts` — lunar conversion and festival state (pure functions);
- `src/hooks/useMidAutumn.ts`, `useNow.ts` — real time and festival info;
- `src/three/Moon.tsx` — moon shading, hit testing and smooth rotation;
- `src/three/Starfield.tsx`, `Nebula.tsx`, `SpaceDepth.tsx` — near and far stars, volumetric haze, dust and galaxy;
- `src/three/MoonAtmosphere.tsx`, `ShootingStars.tsx` — spatial moonlight waves and meteors at varied depths;
- `src/three/sceneState.ts`, `useScenePointer.ts` — shared pointer position and parallax state;
- `src/styles/global.css` — text layer, responsive layout and the no-WebGL fallback;
- `src/notes/*` — note storage and panel;
- `src/App.tsx` — information layer and composition.

Per-frame motion updates refs / scene objects only, never re-renders the page.

## Development & verification

```bash
pnpm install
pnpm --filter @ying-web/mid-autumn dev      # http://localhost:5175
pnpm --filter @ying-web/mid-autumn build

node --experimental-strip-types scripts/verify-lunar.ts   # lunar dates and historical festivals
node --experimental-strip-types scripts/verify-core.ts    # festival boundaries
```

### Time debugging (dev only)

In dev mode a draggable floating button sits near the lower-right. Click it to **freeze the current time to any moment** — Mid-Autumn day 00:00 / 12:00, the day before, post-festival rollover, the post-2099 unsupported edge, or a fully custom time — so every UI state can be previewed without changing the system clock. One click restores real time. It is mounted only under `import.meta.env.DEV`; the production build strips the UI and its styles entirely.

### Fallbacks

- Without WebGL a CSS starfield is shown; countdown and notes still work;
- Under `prefers-reduced-motion`, automatic ambient effects, waves and meteors stop while direct moon dragging remains available;
- Mobile lays out the info zone and scene separately so the countdown is never occluded, and the note opens as a bottom sheet.
