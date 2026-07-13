# Walt Portfolio — Build Checklist

## Phase 1–4: Original build (Antigravity → here) — DONE
- [x] Scaffold, HTML skeleton, CSS tokens, Vercel config
- [x] Sticky nav, hero, about, parallax strips, portfolio grid, testimonials, contact
- [x] Real Upwork + Vimeo links, real email
- [x] All 5 real Upwork testimonial quotes (updated Jul 2026 — documentary review leads)

---

# Roadmap (Jul 2026)

## Phase A — Work-section reorganization — DONE Jul 7, 2026
- [x] Two groups per Walt: **Client Work** and **Personal Work**, poppiest first
  - Client order: Timothy Digital Living Ep1, Sam Agency, Irish Pub, Shift Thursdays, AOII 2020, AOII 2021, Todd Spiritual, AI Faceless, Faseat 01/02, Narcan PSA
  - Personal: yer (trimmed, ⚠ NEEDS A TITLE — currently "Untitled Film"), Lenses of Perception, Labels, Summer 19, A Stroll Through Mason
  - (⚠ MORE TODD VIDEOS COMING — Walt will add to todd-spiritual/)
- [x] Old-portfolio: only Narcan PSA used; drone shots moved to ambient-loops/parallax-candidates/ for future parallax
- [x] AOII: using the 2020 + 2021 cuts (better quality); 2019 + drafts unused
- [x] Poster JPEGs generated for all 16 cards
- [x] HTML/CSS restructured (portfolio-group__label headings)
- [x] Renamed all files web-safe (kebab-case, no spaces)
- [x] yer.MOV: trimmed to 1:43 + ProRes→H.264 (1 GB → 65 MB) → personal-work/yer-trimmed.mp4
- [x] Timothy: HEVC→H.264 web version (Chrome/Firefox couldn't play the original)
- [x] Untitled 2.mp4 identified = hero tree source → ambient-loops/tree-hero-source.mp4
- [x] edm-personal moved from client-work/ → personal-work/

## Phase B — Asset cleanup (blocker for deploy)
- [ ] Fix `client-work/sorority-recruitment:/` (illegal colon in name) — 2019 + two 689 MB draft dupes live there; Walt says unused on site. Ask before deleting.
- [ ] Resolve duplicates: irish-pub .mov+.mp4, todd-spiritual .MOV+.mp4 — ask Walt before deleting
- [ ] Identify mystery file: `assets/52592AB7….mov` (32 MB)
- [ ] Original yer.MOV (1 GB, ProRes) still in assets/videos/ — archive or delete (trimmed web version exists)
- [ ] Compress remaining heavy live-site videos (sam-agency 144 MB especially); keep originals out of the deploy

## Phase C — Parallax refinements
- [x] Tree hero: KEEP — Walt likes it
- [x] Drone strip: now a centered vertical 9:16 panel (Jul 7) — canvas cover-crops the horizontal frames
- [x] Scrub windows + easing added (Jul 7): strips hold frame 0 until partly on screen, start slow, accelerate, and reach the last frame before scrolling away. Tunable via data-scrub-* attrs — see CONTEXT.md. Drone: 0.15/0.8/1.7. Boomerang: 0.12/0.85/1.5.
- [ ] Walt to judge the feel; tune scrub values if needed
- [ ] Maybe re-extract drone frames vertically cropped for sharper detail (current frames are horizontal, cropped at draw time)

## Phase C.5 — Work section updates (Jul 7)
- [x] "Untitled Film" card removed (it was a duplicate export of Lenses of Perception)
- [x] Lenses of Perception trimmed to 1:43 (full version kept as lenses-of-perception-full.mp4)
- [x] Redundant "Work" heading removed; group labels restyled to match section-label system
- [x] Wide cards (Irish Pub + AOII ×2) stacked into one cell beside Shift Thursdays — no more dead space
- [x] Nebius Academy videos (3) added to Client Work — Jul 8: copied from Downloads, HEVC→H.264, in assets/client-work/nebius-academy/

## Phase C.6 — Showcase restructure (Jul 8)
- [x] Nav split: "Client Work" (#work) + "Personal" (#personal) as separate tabs/sections
- [x] Drone parallax moved between the two sections as the divider
- [x] Featured row: Timothy, Sam, Nebius AI Jobs — the 3-piece first impression
- [x] "Show all client work (11 more)" toggle hides the rest by default
- [x] Compact 3-across grid for vertical cards; wide 16:9 cards pair 2-up
- [x] Cache-busting ?v=2 on css/js (bump when editing during dev)
- [x] Featured reshuffled per Walt (Jul 8): Timothy, **Shift Thursdays** (his beat-matching flex), Nebius AI Jobs. Sam moved into expanded grid.
- [ ] PHOTOS: Walt will drop photos into assets/ (suggest assets/photos/) — then design where they live on the page

## Phase C.7 — Contact + personal cleanup (Jul 8)
- [x] Email fixed sitewide: waltcoughlAn36@gmail.com (was misspelled with an i)
- [x] "Let's make something clean." replaced with "Tell me what you're working on."
- [x] Inquiry form built (name / email / need dropdown / message) → formsubmit.co AJAX, honeypot antispam
- [ ] ⚠ FORM ACTIVATION: first submission emails Walt an activation link — he must click it before submissions arrive
- [x] Personal Work compacted to 3-across; Narcan PSA moved from Client → Personal
- [ ] Instagram link in contact — WAITING ON WALT'S HANDLE
- [ ] Vimeo (vimeo.com/user254187057) + Upwork (~0149e3aab5593dfb93) links — Walt to confirm they're right
- [ ] More personal videos coming (Walt downloading from his Instagram)

## Phase C.8 — Player + polish (Jul 8, later)
- [x] Video seeking fixed: launch.json now runs serve.py (Range/206 support) instead of python -m http.server. NOTE: keep it that way or scrubbing breaks.
- [x] Featured swap: Nebius Math Problem ("amateur solved a 60-year-old math problem") in, AI Jobs to expanded grid
- [x] Nebius descriptions now say "My own AI education series. Me on camera." (they're Walt's, not client deliverables)
- [x] Faseat descriptions now say brand comedy
- [x] Wide cards (Irish + AOII ×2) in one clean row of three — blank cell gone
- [x] Personal Work compacted again: 4-across, Narcan spans 2
- [x] Upwork link confirmed + cleaned (no ?viewMode param) — Jul 8
- [x] Vimeo removed everywhere per Walt (contact, footer, "Full reel on Vimeo" link)
- [ ] Instagram handle — still waiting on Walt
- [ ] ⚠ COLLAGE PHOTO: strip is built below the hero, self-hidden until Walt saves his collage image to **assets/photos/collage.jpg** (exact name). Then judge whether it matches. (Photos parked for later per Walt, Jul 9)

## Phase C.9 — Podcast clips, About rework, mobile pass (Jul 9)
- [x] Medical Podcast clips ×2 added (renamed medical-podcast-01/02, HEVC→H.264, posters) — slotted after Agency Structure; toggle now says "12 more"
- [x] About rewritten around Walt's process: sculptor philosophy, audio/transcript-first, choices-by-removal
- [x] Mobile audit at 375×812: no overflow, hamburger + 6-link menu works, featured cards full-width, drone strip goes full-screen portrait, form stacks 1-col. No fixes needed — breakpoints held up.
- Empty dirs noticed in client-work/: `jim-political`, `Nebius Academy` (dupe of nebius-academy) — harmless, flag for cleanup phase

## Phase C.10 — Aesthetic touch-ups (Jul 10)
- [x] Sections renamed: Client Work → **Commissions**, Personal Work → **Originals** (nav, headings, aria, toggle)
- [x] Group headings enlarged + brightened (were blending into bg)
- [x] Hero periods removed: "Walt's Perspective" / "Truth through deduction"
- [x] Featured now: Timothy, Shift, **Medical Podcast Short 01**; Math Problem moved next to Agency Structure
- [x] Testimonials: full names in (Jul 10) — Stephen Carney, Timothy Trujillo (NEW review, added), Sean Schmidt, Sam Shrimpton, Matthew Bucheit, Sophie Chen. Now 6 cards = clean 3+3.
- [x] Group headings recast in the hero's Cormorant serif, sentence case (all-caps was clunky per Walt)
- [x] 3rd parallax replaced with **Far and Wide** (Jul 10) — boomerang frames kept on disk unused. Lightning in the Sky tested + rejected (512px portrait, goes soft and crops badly in a wide band).
- [x] Blend pass (Jul 10): hero fades into page bg; strip overlays deep eased multi-stop fades; section padding tightened ~25%; contact CTA now "Let's collaborate"
- [x] Far and Wide trimmed 3s (101 frames), scrub slower into middle (ease 2.2)
- [x] Headers iterated: caps → serif → now **DM Sans, gray (--text-muted), sentence case** per Walt (serif reserved for hero + contact CTA)
- [ ] THEN: compression pass + deploy hygiene + Vercel launch (see prior plan)

## Phase D — Copy & identity
- [ ] Hero tagline — "Truth through deduction" still undecided
- [ ] Headshot/portrait photo
- [ ] About/Services copy pass in Walt's voice (walt-voice skill)

## Phase E — Ship
- [ ] Final compression + total-size check (assets/ is ~3.2 GB now; Vercel needs way less)
- [ ] Deploy to Vercel, connect waltsperspective.univer.se
- [ ] Mobile + accessibility pass before launch

## Review
Testimonials updated with all 5 real Upwork reviews (verified in preview). Sorority videos located: `assets/client-work/sorority-recruitment/` and the misnamed `sorority-recruitment:/` folder.
