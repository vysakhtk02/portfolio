const menuButton = document.querySelector(".menu-btn");
const mobileNav = document.querySelector("#mobile-nav");
const yearEl = document.querySelector("#year");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

if (menuButton && mobileNav) {
  menuButton.addEventListener("click", () => {
    const isOpen = mobileNav.dataset.open === "true";
    mobileNav.dataset.open = String(!isOpen);
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.textContent = isOpen ? "Menu" : "Close";
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.dataset.open = "false";
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.textContent = "Menu";
    });
  });
}

function initScrollAnimations() {
  const groups = [
    { selector: ".hero .eyebrow, .hero h1, .hero-copy, .hero-cta", variant: "slide-right" },
    { selector: ".hero-card", variant: "slide-left" },
    { selector: "#projects .eyebrow, #projects h2, #projects .projects-subcopy", variant: "slide-right" },
    { selector: "#projects .projects-link", variant: "slide-left" },
    { selector: "#experience .eyebrow, #experience h2", variant: "slide-right" },
    { selector: "#experience .exp-item", variant: "pop" },
    { selector: "#about .eyebrow, #about h2", variant: "slide-right" },
    { selector: "#about .focus-card", variant: "pop" },
    { selector: "#contact .eyebrow, #contact h2, #contact p, #contact .btn", variant: "slide-right" },
    { selector: ".site-footer", variant: "pop" },
    {
      selector:
        ".about-page .about-greeting, .about-page .about-lead, .about-page .about-cta-row, .about-page .about-socials-panel",
      variant: "slide-right",
    },
    {
      selector:
        ".about-page .about-section h2, .about-page .about-featured-intro, .about-page .about-products-note",
      variant: "slide-right",
    },
    {
      selector:
        ".about-page .about-story p, .about-page .about-featured-card, .about-page .about-skills li, .about-page .about-product-chip",
      variant: "pop",
    },
    {
      selector: ".about-page #contact .eyebrow, .about-page #contact h2, .about-page .btn-peek",
      variant: "slide-right",
    },
  ];

  const targets = [];
  groups.forEach((group) => {
    document.querySelectorAll(group.selector).forEach((el) => {
      el.classList.add("reveal", `reveal--${group.variant}`);
      targets.push(el);
    });
  });

  if (!targets.length) return;

  targets.forEach((el, index) => {
    el.style.setProperty("--reveal-delay", `${(index % 7) * 180}ms`);
  });

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        } else {
          entry.target.classList.remove("is-visible");
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -6% 0px",
    }
  );

  targets.forEach((el) => observer.observe(el));
}

function initWorkCardReveal({ retrigger = false } = {}) {
  const cards = document.querySelectorAll("#projects .work-card");
  if (!cards.length) return;

  cards.forEach((card, index) => {
    card.classList.add("work-card-reveal");
    card.style.setProperty("--work-card-delay", `${index * 140}ms`);
  });

  if (!("IntersectionObserver" in window)) {
    cards.forEach((card) => card.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          if (!retrigger) observer.unobserve(entry.target);
        } else if (retrigger) {
          entry.target.classList.remove("is-visible");
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  cards.forEach((card) => observer.observe(card));
}

function initWorkCardTilt() {
  const cards = document.querySelectorAll(".work-card");
  if (!cards.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  cards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * 7;
      const rotateX = (0.5 - py) * 7;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
    });
  });
}

function initWorkSlider() {
  const track = document.querySelector(".work-grid");
  if (!track) return;

  // Skip slider interactions when cards are stacked vertically.
  const isStacked = window.getComputedStyle(track).display === "grid";
  if (isStacked) return;

  const prevBtn = document.querySelector('.slider-btn[data-dir="prev"]');
  const nextBtn = document.querySelector('.slider-btn[data-dir="next"]');
  const firstCard = track.querySelector(".work-card");
  if (!firstCard) return;

  const getStep = () => {
    const gap = parseFloat(window.getComputedStyle(track).gap || "16");
    return firstCard.getBoundingClientRect().width + gap;
  };

  const scrollToCard = (direction) => {
    track.scrollBy({ left: direction * getStep(), behavior: "smooth" });
  };

  prevBtn?.addEventListener("click", () => scrollToCard(-1));
  nextBtn?.addEventListener("click", () => scrollToCard(1));

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReducedMotion) {
    // Convert vertical wheel motion into horizontal card scrolling for studio-like behavior.
    track.addEventListener(
      "wheel",
      (event) => {
        if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
        const maxScroll = track.scrollWidth - track.clientWidth;
        if (maxScroll <= 0) return;

        const scrollingForward = event.deltaY > 0 && track.scrollLeft < maxScroll;
        const scrollingBackward = event.deltaY < 0 && track.scrollLeft > 0;
        if (!scrollingForward && !scrollingBackward) return;

        event.preventDefault();
        track.scrollLeft += event.deltaY;
      },
      { passive: false }
    );
  }

  let isPointerDown = false;
  let startX = 0;
  let startScrollLeft = 0;

  track.addEventListener("pointerdown", (event) => {
    isPointerDown = true;
    startX = event.clientX;
    startScrollLeft = track.scrollLeft;
    track.classList.add("is-dragging");
    track.setPointerCapture(event.pointerId);
  });

  track.addEventListener("pointermove", (event) => {
    if (!isPointerDown) return;
    const deltaX = event.clientX - startX;
    track.scrollLeft = startScrollLeft - deltaX;
  });

  const stopDrag = () => {
    isPointerDown = false;
    track.classList.remove("is-dragging");
  };

  track.addEventListener("pointerup", stopDrag);
  track.addEventListener("pointercancel", stopDrag);
  track.addEventListener("pointerleave", stopDrag);

  track.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollToCard(1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollToCard(-1);
    }
  });
}

function initParallaxBackground() {
  const glows = document.querySelectorAll(".parallax-glow");
  if (!glows.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  let ticking = false;

  const update = () => {
    const scrollY = window.scrollY || window.pageYOffset;

    glows.forEach((glow, index) => {
      const speed = Number(glow.dataset.speed || 0.08);
      const xDrift = index === 1 ? -scrollY * 0.02 : index === 2 ? scrollY * 0.015 : 0;
      const yDrift = scrollY * speed;
      glow.style.transform = `translate3d(${xDrift}px, ${yDrift}px, 0)`;
    });

    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );

  update();
}

function initAdaptiveScrollAnimationSpeed() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const root = document.documentElement;
  let targetFactor = 1;
  let currentFactor = 1;
  let rafId = null;
  let lastScrollY = window.scrollY;
  let lastScrollTime = performance.now();

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  const render = () => {
    currentFactor += (targetFactor - currentFactor) * 0.16;
    root.style.setProperty("--scroll-anim-factor", currentFactor.toFixed(3));

    targetFactor += (1 - targetFactor) * 0.06;

    if (Math.abs(currentFactor - 1) > 0.01 || Math.abs(targetFactor - 1) > 0.01) {
      rafId = window.requestAnimationFrame(render);
    } else {
      root.style.setProperty("--scroll-anim-factor", "1");
      rafId = null;
    }
  };

  const schedule = () => {
    if (rafId === null) {
      rafId = window.requestAnimationFrame(render);
    }
  };

  window.addEventListener(
    "wheel",
    (event) => {
      const intensity = clamp(Math.abs(event.deltaY), 0, 180);
      const normalized = intensity / 180;
      targetFactor = clamp(1.18 - normalized * 0.68, 0.5, 1.2);
      schedule();
    },
    { passive: true }
  );

  window.addEventListener(
    "scroll",
    () => {
      const now = performance.now();
      const deltaY = Math.abs(window.scrollY - lastScrollY);
      const deltaTime = Math.max(now - lastScrollTime, 16);
      const velocity = deltaY / deltaTime;
      const normalized = clamp(velocity / 2.2, 0, 1);
      targetFactor = clamp(1.15 - normalized * 0.6, 0.55, 1.15);
      lastScrollY = window.scrollY;
      lastScrollTime = now;
      schedule();
    },
    { passive: true }
  );
}

initScrollAnimations();
initWorkCardReveal();
initParallaxBackground();
initWorkCardTilt();
initWorkSlider();
initAdaptiveScrollAnimationSpeed();
