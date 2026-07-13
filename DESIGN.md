# Design Principles for Walt's Portfolio

## Design Thinking
Before coding, commit to a BOLD aesthetic direction:
- Purpose: Attract freelance video editing clients. Show craft, not just work.
- Tone: Refined minimalism with cinematic warmth. Dark, clean, intentional.
- Differentiation: The site should feel EDITED. Like every element earned its place. The same philosophy Walt applies to video applied to web design.

## Aesthetic Direction
- Typography: DM Sans as primary body font. Choose a distinctive display font for the hero headline that has real character. NOT Inter, Roboto, Arial, or any generic system font. Consider something with weight and personality for "Walt" and the tagline.
- Color: Warm charcoal dominant (#2A2A2A range). Avoid pure black (#000). Accent color should be subtle and warm, not neon or cold. Think amber, warm white (#F5F0EB range), muted gold. Text should be warm off-white, not stark white.
- Motion: Scroll-triggered reveals with staggered timing. Parallax depth on ambient video sections. Subtle hover states on portfolio pieces. One well-orchestrated page load with staggered reveals creates more delight than scattered micro-interactions.
- Spatial Composition: Generous negative space. Let the content breathe. Asymmetric layout moments where it makes sense. The hero section can break the grid. Portfolio section should feel curated, not crammed.
- Backgrounds: Atmosphere and depth, not flat. Subtle grain or noise texture on the charcoal. Layered parallax creates depth. Ambient video loops add life without demanding attention.

## What to Avoid
- Generic AI aesthetics (purple gradients, cookie-cutter layouts, overused component patterns)
- Corporate template energy
- Overdesigned elements that fight for attention
- Anything that feels "assembled from parts" instead of intentionally crafted
- Cluttered layouts. This site should feel like it was edited down.
- Default fonts (Inter, Roboto, Arial, system fonts)
- Pure black backgrounds or stark white text
- Cliched hero sections with stock photos

## The Vibe Check
Before finalizing any section, ask: does this feel like a site built by someone who thinks in stories and subtraction? If it feels like a template, redesign it. If it feels busy, cut something. The site IS the portfolio. How it feels proves the editing philosophy before anyone clicks a single video.

## Technical Guidelines
- Use CSS variables for all colors, spacing, and typography
- CSS-only animations where possible (use Intersection Observer for scroll triggers)
- Smooth scroll behavior for nav links
- Lazy load all video content
- Mobile-first responsive design
- Clean, well-commented code
- HTML, CSS, vanilla JS only. No frameworks.
- Deploy target: Vercel free tier
