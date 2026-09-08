/* ============================================================
   main.js — Walt Portfolio
   Covers:
   1.  Hero fade-in on load
   2.  Scroll-triggered section reveals (Intersection Observer)
   3.  Active nav link highlight on scroll
   4.  Smooth-scroll nav links (no reload)
   5.  Mobile hamburger menu
   6.  Portfolio lightbox — click-to-play, fullscreen
   7.  Scroll-scrubbed video (hero + ambient strips)
       video.currentTime = scrollProgress × video.duration
       The video NEVER autoplays. It only moves because the
       user is scrolling.
   8.  Footer year
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. HERO FADE-IN
     Fire immediately so the hero animates on page load.
     Only two elements now: name and tagline.
  ---------------------------------------------------------- */
  document.querySelectorAll('.hero-stagger-1, .hero-stagger-2')
    .forEach(el => {
      requestAnimationFrame(() => setTimeout(() => el.classList.add('is-visible'), 60));
    });


  /* ----------------------------------------------------------
     2. SCROLL REVEAL  (Intersection Observer)
     Watches all .reveal elements; adds .is-visible when they
     enter the viewport. Once revealed, stops observing.
  ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  }


  /* ----------------------------------------------------------
     3. ACTIVE NAV LINK
     Tracks which section is most in-view and highlights the
     matching nav link.
  ---------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  if (sections.length && navLinks.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              link.classList.toggle('is-active', link.dataset.section === id);
            });
          }
        });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );

    sections.forEach((section) => navObserver.observe(section));
  }


  /* ----------------------------------------------------------
     4. SMOOTH-SCROLL NAV LINKS
     Prevent page reload on hash-only links; scroll instead.
     Uses scroll-padding-top in CSS (= nav height) to offset.
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ----------------------------------------------------------
     5. MOBILE HAMBURGER MENU
  ---------------------------------------------------------- */
  const hamburger   = document.querySelector('.nav__hamburger');
  const mobileMenu  = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link');

  if (hamburger && mobileMenu) {
    const openMenu = () => {
      hamburger.setAttribute('aria-expanded', 'true');
      mobileMenu.setAttribute('aria-hidden', 'false');
      mobileMenu.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      mobileMenu.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', () => {
      hamburger.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
    });

    mobileLinks.forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  }


  /* ----------------------------------------------------------
     6. PORTFOLIO LIGHTBOX
     Click any .portfolio-card → open lightbox with video.
  ---------------------------------------------------------- */
  const lightbox      = document.getElementById('lightbox');
  const lightboxVideo = lightbox?.querySelector('.lightbox__video');
  const lightboxClose = lightbox?.querySelector('.lightbox__close');
  const lightboxFS    = lightbox?.querySelector('.lightbox__fullscreen');

  const openLightbox = (videoSrc, aspect) => {
    if (!lightbox || !lightboxVideo) return;
    lightboxVideo.querySelector('source').src = videoSrc || '';
    lightboxVideo.load();
    lightboxVideo.play().catch(() => {});
    const content = lightbox.querySelector('.lightbox__content');
    content.style.maxWidth = aspect === 'horizontal' ? '900px' : '420px';
    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  };

  const closeLightbox = () => {
    if (!lightbox || !lightboxVideo) return;
    lightboxVideo.pause();
    lightboxVideo.querySelector('source').src = '';
    lightbox.setAttribute('hidden', '');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.portfolio-card').forEach(card => {
    card.addEventListener('click', () => {
      openLightbox(card.dataset.videoSrc || '', card.dataset.aspect || 'vertical');
    });
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox && !lightbox.hasAttribute('hidden')) closeLightbox();
  });

  lightboxFS?.addEventListener('click', () => {
    if (!lightboxVideo) return;
    (lightboxVideo.requestFullscreen || lightboxVideo.webkitRequestFullscreen)?.call(lightboxVideo);
  });


  /* ----------------------------------------------------------
     7. SCROLL-SCRUBBED IMAGE SEQUENCES (Parallax)
     ─────────────────────────────────────────────────────────
     Mechanic:
       Each parallax section has a <canvas> with data attributes:
         data-frame-path  — path prefix (e.g. "assets/parallax/tree/frame_")
         data-frame-count — total number of frames

       On scroll, we calculate progress (0–1) for the section,
       map that to a frame index, and drawImage() to the canvas.

     Smoothness strategy — passive scroll + rAF ticking:
       • A passive scroll listener sets a dirty flag and
         queues ONE requestAnimationFrame update.
       • Rapid scroll events are collapsed: only one draw
         per rendered frame, no matter how fast the user scrolls.
       • No video elements. No autoplay. Pure image sequence.
  ---------------------------------------------------------- */

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /**
   * Returns scroll progress (0–1) for an element through
   * the viewport:
   *   0 → element's top is at the bottom of the viewport
   *   1 → element's bottom is at the top of the viewport
   */
  const getScrollProgress = (el) => {
    const rect  = el.getBoundingClientRect();
    const viewH = window.innerHeight;
    const total = viewH + rect.height;
    const travel = viewH - rect.top;
    return Math.max(0, Math.min(1, travel / total));
  };

  /**
   * Preload all frame images for a parallax section.
   * Returns a Promise that resolves to an array of Image objects.
   */
  const preloadFrames = (pathPrefix, count, onFirstFrame) => {
    const frames = [];
    const promises = [];

    for (let i = 0; i < count; i++) {
      const img = new Image();
      const idx = String(i).padStart(4, '0');
      img.src = `${pathPrefix}${idx}.jpg`;

      const p = new Promise((resolve) => {
        img.onload = () => {
          if (i === 0 && onFirstFrame) onFirstFrame(img);
          resolve();
        };
        img.onerror = () => resolve(); // don't block on missing frames
      });

      frames.push(img);
      promises.push(p);
    }

    return Promise.all(promises).then(() => frames);
  };

  /**
   * Size a canvas to fill its container, respecting devicePixelRatio
   * for sharp rendering on retina displays.
   */
  const sizeCanvas = (canvas) => {
    const parent = canvas.parentElement;
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // cap at 2x for perf
    const w = parent.clientWidth;
    const h = parent.clientHeight;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    return { w, h, ctx };
  };

  /**
   * Draw a frame image to a canvas, covering the full area
   * (equivalent to object-fit: cover).
   */
  const drawFrameCover = (ctx, img, canvasW, canvasH) => {
    if (!img || !img.naturalWidth) return;

    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;
    const imgRatio = imgW / imgH;
    const canvasRatio = canvasW / canvasH;

    let sx, sy, sw, sh;

    if (imgRatio > canvasRatio) {
      // Image is wider than canvas — crop sides
      sh = imgH;
      sw = imgH * canvasRatio;
      sx = (imgW - sw) / 2;
      sy = 0;
    } else {
      // Image is taller than canvas — crop top/bottom
      sw = imgW;
      sh = imgW / canvasRatio;
      sx = 0;
      sy = (imgH - sh) / 2;
    }

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvasW, canvasH);
  };

  // ─── Parallax section registry ──────────────────────────────
  // Each entry: { canvas, ctx, scrollEl, frames[], lastIndex, w, h }
  const parallaxSections = [];

  if (!reducedMotion) {

    // Discover all parallax canvases
    const canvases = [
      { id: 'hero-canvas',     scrollSel: '#hero' },
      { id: 'ambient-canvas-1', scrollSel: '.ambient-strip--1' },
      { id: 'ambient-canvas-2', scrollSel: '.ambient-strip--2' },
    ];

    const initPromises = canvases.map(({ id, scrollSel }) => {
      const canvas = document.getElementById(id);
      const scrollEl = document.querySelector(scrollSel);
      if (!canvas || !scrollEl) return Promise.resolve();

      const framePath  = canvas.dataset.framePath;
      const frameCount = parseInt(canvas.dataset.frameCount, 10);
      if (!framePath || !frameCount) return Promise.resolve();

      // Size the canvas immediately
      const { w, h, ctx } = sizeCanvas(canvas);

      // Register the section (frames will be filled after preload)
      const section = {
        canvas, ctx, scrollEl,
        frames: [],
        lastIndex: -1,
        w, h,
        // Optional scrub window + easing (see CONTEXT.md):
        //   start/end — the slice of raw scroll progress the scrub is active in
        //   ease      — exponent; > 1 starts slow and accelerates
        scrub: {
          start: parseFloat(canvas.dataset.scrubStart) || 0,
          end:   parseFloat(canvas.dataset.scrubEnd)   || 1,
          ease:  parseFloat(canvas.dataset.scrubEase)  || 1,
        }
      };
      parallaxSections.push(section);

      // Draw frame 0 the moment it loads, then keep loading the rest
      // in the background so the hero isn't blank while the full
      // sequence downloads.
      return preloadFrames(framePath, frameCount, (firstFrame) => {
        if (firstFrame.naturalWidth) {
          drawFrameCover(ctx, firstFrame, w, h);
        }
      }).then(frames => {
        section.frames = frames;
      });
    });

    // ─── Scroll → rAF ticking ──────────────────────────────────
    let ticking = false;

    const updateParallax = () => {
      parallaxSections.forEach(section => {
        if (!section.frames.length) return;

        let progress = getScrollProgress(section.scrollEl);
        // Remap into the section's scrub window, then apply easing
        const { start, end, ease } = section.scrub;
        progress = Math.max(0, Math.min(1, (progress - start) / (end - start)));
        if (ease !== 1) progress = Math.pow(progress, ease);
        const maxIndex = section.frames.length - 1;
        const index = Math.round(progress * maxIndex);

        // Only redraw if the frame actually changed
        if (index !== section.lastIndex) {
          section.lastIndex = index;
          const frame = section.frames[index];
          if (frame && frame.naturalWidth) {
            drawFrameCover(section.ctx, frame, section.w, section.h);
          }
        }
      });
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });

    // Handle resize — re-size canvases and redraw current frame
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        parallaxSections.forEach(section => {
          const { w, h, ctx } = sizeCanvas(section.canvas);
          section.w = w;
          section.h = h;
          section.ctx = ctx;
          // Redraw current frame at new size
          if (section.lastIndex >= 0 && section.frames[section.lastIndex]) {
            drawFrameCover(ctx, section.frames[section.lastIndex], w, h);
          }
        });
      }, 150);
    });

    // Wait for all frames to preload, then run initial update
    Promise.all(initPromises).then(() => {
      requestAnimationFrame(updateParallax);
    });

    // Also run an immediate update for sections that loaded fast
    requestAnimationFrame(updateParallax);
  }


  /* ----------------------------------------------------------
     8. SHOW-MORE TOGGLE (Client Work)
  ---------------------------------------------------------- */
  const moreToggle = document.querySelector('.portfolio-more__toggle');
  const moreBox = document.getElementById('client-more');

  if (moreToggle && moreBox) {
    const collapsedLabel = moreToggle.textContent.trim();
    moreToggle.addEventListener('click', () => {
      const expanding = moreBox.hasAttribute('hidden');
      moreBox.toggleAttribute('hidden', !expanding);
      moreToggle.setAttribute('aria-expanded', String(expanding));
      moreToggle.textContent = expanding ? 'Show less' : collapsedLabel;
    });
  }


  /* ----------------------------------------------------------
     9. CONTACT FORM
     Posts to formsubmit.co via fetch so the visitor never
     leaves the page. Success/failure shows inline.
  ---------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    const statusEl = contactForm.querySelector('.contact-form__status');
    const submitBtn = contactForm.querySelector('.contact-form__submit');

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!contactForm.reportValidity()) return;

      submitBtn.disabled = true;
      statusEl.textContent = 'Sending…';

      const data = Object.fromEntries(new FormData(contactForm).entries());
      data._subject = 'New inquiry — waltsperspective';

      fetch('https://formsubmit.co/ajax/waltcoughlan36@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data),
      })
        .then(res => {
          if (!res.ok) throw new Error();
          contactForm.reset();
          statusEl.textContent = "Got it. I'll get back to you within a day.";
        })
        .catch(() => {
          statusEl.textContent = 'Something broke. Email me instead: waltcoughlan36@gmail.com';
        })
        .finally(() => {
          submitBtn.disabled = false;
        });
    });
  }


  /* ----------------------------------------------------------
     8. FOOTER YEAR
  ---------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
