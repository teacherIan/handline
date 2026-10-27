# Handline

Lines drawn by hand: SVG arrows that loop, land on real elements, and draw on
the way a pen does.

Design doc, with live figures: https://claude.ai/artifact/9P4krKBDewiEcH64Fi5XUM

```tsx
<div style={{ position: 'relative' }}>
  <span ref={label}>Gallery</span>
  <button ref={button} />
  <HandlineLayer>
    <Handline from={label} to={button} gesture="loop" pen="pencil" reach="center" play="in-view" />
  </HandlineLayer>
</div>
```

## Run

```sh
npm install
npm run dev     # the lab: http://localhost:5180 — drag the ends, every option in a panel
npm test        # node:test, bundled by esbuild; no test framework
npm run check   # typecheck + tests
npm run build   # dist/handline.js (ESM) and dist/handline.iife.js (no React, `Handline` global)
```

## Use it

The package ships TypeScript source. A Vite or other bundler project can
depend on it directly (`"handline": "github:teacherIan/handline"`) or copy
`src/` in. React is an optional peer; `handline/vanilla` has no React in it.

### A line between two things

| Prop                      | What it does                                                                                                                                                                                                                                                                            |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from`, `to`              | An element, a ref, a point `{ x, y }`, or `{ target, at: [x, y], offset, shape, space, radius }`. The end is trimmed to its element's shape (a full border-radius on a square box is a circle); with `at` it aims at that point of the element. A start with `at` begins exactly there. |
| `reach`                   | How far into the target the tip goes, px from its edge along the line: negative stops short (default `-6`), positive goes past the edge, `'center'` reaches the aim point. A reach that would leave an arrowhead straddling the border snaps to 2 px short or fully inside.             |
| `gesture`                 | `'arc' 'wave' 'loop' 'loops' 'spring' 'hook' 'swoop' 'straight'`, an authored path `{ kind: 'path', d, size? }`, or a spec. Waves, loops and springs can ride an authored curve with `along`, and `flip` sides.                                                                         |
| `side`, `bow`             | Which way it bulges (`'left'`, `'right'`, or `'auto'`, which keeps inside the layer and off `avoid` — `avoid` only counts with `'auto'`), and how much.                                                                                                                                 |
| `pen`                     | `'ink' 'pencil' 'graphite' 'chalk' 'marker' 'fineliner'`, or overrides: `{ base: 'ink', width: 1.5, jitter: 0.3 }`.                                                                                                                                                                     |
| `head`, `tail`            | Heads: `'chevron' 'open' 'harpoon' 'triangle' 'tick' 'dot' 'none'`. Tails: `'dot' 'ring' 'hook' 'tick' 'none'`.                                                                                                                                                                         |
| `marks`, `ring`           | Woodworker's ticks, scribe and dimension marks; a hand-drawn ring around the target.                                                                                                                                                                                                    |
| `play`                    | `true` draws on, `false` draws out, `'in-view'` draws the first time its target is half on screen.                                                                                                                                                                                      |
| `delay`, `follow`, `once` | Wait before drawing; keep re-measuring for N ms (anchors that slide in by CSS); draw once per tab session.                                                                                                                                                                              |
| `seed`                    | Same seed, same line, on every render and in a prerender. Unseeded lines each get their own.                                                                                                                                                                                            |
| `nudge`                   | A push on the line's middle, ends fixed — for a line that sways.                                                                                                                                                                                                                        |

`<HandlineArt d viewBox>` draws an authored path in its own box with the same
pen. Without React: `createLine(layerEl, spec)` returns `play()`, `undraw()`,
`playInView()`, `show()`, `hide()`, `update()`, `destroy()`; `play()` and `undraw()` resolve
`true` when they reach their end and `false` when something took over.
`buildLine()` and `toSVGString()` are pure.

## Rules it keeps

- **No SVG filters.** Weight, wander and grain are geometry; the grain is a
  mask of seeded specks. A filter can't change weight and re-renders every
  frame of a draw-on.
- **One frame loop, changed strokes only.** A line is many short strokes;
  per-stroke animations fell to ~6 fps at sixty lines.
- **Same seed, same line.** Adding marks never changes the line under them.
- **Reduced motion shows the line drawn. Nothing loops.**
- **Lines are decoration** (`aria-hidden`); the label and the target carry
  the meaning. Keep real text out of a `HandlineLayer`.
- **Colours with alpha are fine**: the alpha is applied once to the whole
  line, so overlapping stroke ends don't bead.

## Files

| File          | Does                                                                   |
| ------------- | ---------------------------------------------------------------------- |
| `geom.ts`     | SVG path → dense polylines, arc length, curvature, trim and cut        |
| `random.ts`   | seeded streams and 1-D noise; each feature forks its own               |
| `gestures.ts` | the shape between two points, built at the real length                 |
| `fit.ts`      | turn a gesture to face the target, pick a side, trim, reach            |
| `pen.ts`      | wander, width, timing; cut into constant-width strokes                 |
| `ends.ts`     | heads, tails, ticks/scribe/dimension marks, the ring                   |
| `build.ts`    | `buildLine` / `buildArt`: description in, `Drawing` out — pure         |
| `dom.ts`      | `InkView`: a `Drawing` as SVG, drawn on/out from one timeline position |
| `clock.ts`    | one frame loop for every drawing line                                  |
| `track.ts`    | one layout tracker: reads before writes, once a frame                  |
| `anchor.ts`   | element / ref / point → point + trim shape, in the layer's own px      |
| `line.ts`     | `createLine`: a live line between anchors, no framework                |
| `react.tsx`   | `<Handline>`, `<HandlineArt>`, `<HandlineLayer>`                       |

## Where it's used

- [Doug's Found Wood](https://github.com/teacherIan/dfw_website): the menu
  arrows (desktop and phone) and the back button.
- Planned: the Burr and Burton four-year plan's "you are here".
