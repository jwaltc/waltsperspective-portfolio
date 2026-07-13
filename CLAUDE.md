# Walt's Portfolio — waltsperspective.univer.se

## What This Is
Single-page portfolio site for Walt, a DC-based short-form video editor. Vanilla HTML + CSS + JS, no framework, no build step. Deployed on Vercel.

## File Structure
```
index.html          — The entire site (single page)
css/styles.css      — All styles, design tokens, responsive breakpoints
js/main.js          — All interactivity: scroll reveal, lightbox, parallax engine, nav
vercel.json         — Vercel deployment config
serve.py            — Local dev server with range requests (for video seeking)
extract_frames.py   — Script to re-extract parallax frames from source videos
CONTEXT.md          — Parallax system spec (how frames map to scroll)
DESIGN.md           — Design system documentation
```

## Assets Map
```
assets/
├── parallax/              ← JPEG frame sequences for scroll-scrub (59 MB)
│   ├── tree/              ← 80 frames → Hero background canvas
│   ├── drone/             ← 119 frames → Ambient Strip 1 canvas
│   └── boomerang/         ← 122 frames → Ambient Strip 2 canvas
├── client-work/           ← Portfolio videos played in lightbox (429 MB)
│   ├── sam-business/      ← sam-agency-structure.mp4
│   ├── todd-spiritual/    ← todd-spiritual-speaking.mp4, ai-faceless-travel.mp4
│   ├── matt/              ← faseat-01.mp4, faseat-02.mp4
│   ├── irish-pub/         ← irish-pub-promo.mp4
│   └── edm-promo/         ← shift-thursdays.mp4
├── ambient-loops/         ← Source videos for parallax extraction (NOT used live)
├── posters/               ← Thumbnail fallback JPEGs for portfolio cards
└── images/                ← SVG placeholder
```

## How It Works

### Parallax Scroll-Scrub
The hero and two ambient strips use `<canvas>` elements. JS preloads JPEG sequences from `assets/parallax/{tree,drone,boomerang}/`, then on scroll:
1. Calculates scroll progress (0–1) for each section
2. Maps progress to a frame index
3. Draws that frame to canvas with cover-fit cropping
4. Uses rAF throttling for 60fps performance

See CONTEXT.md for the full parallax pipeline spec.

### Portfolio Lightbox
Each portfolio card has a `<video>` with a poster frame. Clicking opens a fullscreen lightbox that plays the video.

## Running Locally
```bash
python3 -m http.server 8000
# or for video range-request support:
python3 serve.py
```

## Rules for AI Agents
- **Plan mode** for ANY non-trivial task (3+ steps or architectural decisions)
- **Never modify** the parallax system architecture without asking — see CONTEXT.md
- **When fixing a section**, only touch that section's component
- **Verify before done** — run the server, check it works
- **No frameworks** — this is intentionally vanilla HTML/CSS/JS
- **Simplicity first** — make every change as simple as possible
- **Minimal impact** — changes should only touch what's necessary

## Contact Info (Live on Site)
- Email: waltcoughlan36@gmail.com (with an a, not an i)
- Phone: (571) 587-8852
- Upwork: https://www.upwork.com/freelancers/~0149e3aab5593dfb93
- Vimeo: removed from site per Walt (Jul 8, 2026) — link was redundant

## Open Items
- Hero tagline "Truth through deduction" — Walt is still deciding
- No headshot/portrait photo added yet
- sam-agency-structure.mp4 is 144 MB — may want to compress for production
