/* ═══════════════════════════════════════════════════════
   DEVANA PERUPURAYIL — Portfolio JS
════════════════════════════════════════════════════════ */

'use strict';

/* ── NAV: scroll class + mobile toggle ────────────────── */
(function initNav() {
  const navbar = document.getElementById('navbar');
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  toggle?.addEventListener('click', () => {
    links?.classList.toggle('open');
  });

  /* Close mobile menu on link click */
  links?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
})();

/* ── PROFILE PHOTO: show when loaded, hide placeholder ── */
(function initPhoto() {
  const photo       = document.getElementById('profile-photo');
  const placeholder = document.getElementById('photo-placeholder');
  if (!photo || !placeholder) return;

  photo.addEventListener('load', () => {
    photo.style.display = 'block';
    placeholder.style.display = 'none';
  });

  photo.addEventListener('error', () => {
    /* Image not found — keep placeholder visible */
    photo.style.display = 'none';
    placeholder.style.display = 'flex';
  });

  /* Trigger if already cached */
  if (photo.complete && photo.naturalWidth > 0) {
    photo.dispatchEvent(new Event('load'));
  }
})();

/* ── SCROLL REVEAL ────────────────────────────────────── */
(function initReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        /* Stagger children if inside a grid */
        const delay = i * 80;
        setTimeout(() => entry.target.classList.add('revealed'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  items.forEach(el => observer.observe(el));
})();

/* ── TIMELINE REVEAL ──────────────────────────────────── */
(function initTimeline() {
  const items = document.querySelectorAll('.timeline-item');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('revealed'), i * 120);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(el => observer.observe(el));
})();

/* ── PROJECT CARD REVEAL ──────────────────────────────── */
(function initProjectReveal() {
  const cards = document.querySelectorAll('.project-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        /* Find index among siblings for stagger */
        const siblings = [...entry.target.parentElement.children];
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('revealed'), idx * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(el => observer.observe(el));
})();

/* ── ACTIVE NAV LINK HIGHLIGHT ────────────────────────── */
(function initActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${id}`
            ? 'var(--teal)'
            : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();

/* ── SKILL TAG HOVER RIPPLE ───────────────────────────── */
(function initSkillRipple() {
  document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute; border-radius:50%;
        background:rgba(0,212,190,0.25);
        width:60px; height:60px;
        top:${e.clientY - rect.top - 30}px;
        left:${e.clientX - rect.left - 30}px;
        transform:scale(0); pointer-events:none;
        animation:rippleAnim 0.5s ease-out forwards;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  /* Inject keyframe once */
  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `
      @keyframes rippleAnim {
        to { transform: scale(5); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
})();

/* ── TYPED HERO EYEBROW ───────────────────────────────── */
(function initTyped() {
  const el = document.querySelector('.hero-eyebrow');
  if (!el) return;

  const phrases = [
    'Data Scientist & Software Engineer',
    'ML Researcher · NLP · Graph Systems',
    'UC San Diego — HDSI',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  let paused    = false;

  function tick() {
    const current = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        paused   = true;
        setTimeout(() => { paused = false; schedule(); }, 2200);
        return;
      }
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting  = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }

    if (!paused) schedule();
  }

  function schedule() {
    const base  = deleting ? 45 : 80;
    const jitter = Math.random() * 30;
    setTimeout(tick, base + jitter);
  }

  /* Start after a brief initial delay */
  setTimeout(schedule, 600);
})();

/* ── SMOOTH RESUME DOWNLOAD FEEDBACK ─────────────────── */
(function initResumeBtns() {
  document.querySelectorAll('a[download]').forEach(btn => {
    btn.addEventListener('click', function () {
      const orig = this.textContent;
      this.textContent = '✓ Downloading…';
      setTimeout(() => { this.textContent = orig; }, 2500);
    });
  });
})();
