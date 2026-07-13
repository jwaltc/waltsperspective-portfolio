# CONTEXT.md

## Parallax System

Parallax sections use scroll-scrubbed image sequences. Each section extracts frames from the original video file, analyzes them to find the most visually dynamic zone, re-extracts at higher density from that zone, then maps frames to scroll position. Scrolling literally scrubs through the sequence. Do not use CSS parallax, video autoplay, or any other mechanic. When fixing any parallax section, only touch that section's component. Do not suggest architectural changes unless asked.

### Pipeline

For each parallax section, follow this pipeline:

**Step 1 — Extract:** Pull frames from the original video file at regular intervals. Save as numbered PNGs.

**Step 2 — Analyze:** Review frames and identify where depth changes most, something moves closer or farther, or composition shifts most significantly. That is the target zone.

**Step 3 — Select:** Re-extract at higher density from the target zone only.

**Step 4 — Build:** Map selected frames to scroll position in order. Each scroll increment advances one frame.

### Scrub Window + Easing (added Jul 2026)

Each parallax `<canvas>` accepts optional data attributes that reshape how raw scroll progress (0 = section top enters viewport bottom, 1 = section bottom exits viewport top) maps to frames:

- `data-scrub-start` / `data-scrub-end` — the slice of raw progress the scrub is active in. Before `start` the sequence holds frame 0; by `end` it reaches the last frame. Lets the sequence begin after the section is partly on screen and finish before it leaves.
- `data-scrub-ease` — exponent applied to remapped progress. `> 1` = starts slow, accelerates toward the end (per Walt's direction: slow entrance, speeds up as the subject appears).

Current values: drone strip `0.15 / 0.8 / 1.7`, boomerang strip `0.12 / 0.85 / 1.5`, hero tree unset (linear full-range). Implemented in `updateParallax()` in js/main.js.

The drone strip is also displayed as a centered vertical 9:16 panel (`.ambient-strip--1` in CSS) rather than a full-width horizontal strip — the canvas cover-crops the horizontal frames to portrait.

### Section Instructions

**Tree shot** — Target zone is where sunlight bleeds through the top of the tree. Start just before the sun peaks and move through it.

**Drone shot** — Aerial shot of Walt laying down. Find the most dynamic depth shift in the clip.

**Boomerang** — This clip plays forward then reverses. Find where the motion is cleanest and most dynamic. Zoom out so the full frame is visible — full body and complete skyline. Build the sequence forward then backward to match the boomerang.
