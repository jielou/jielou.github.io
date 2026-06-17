(() => {
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setMenuOpen(open) {
    if (!toggle || !navLinks) return;
    navLinks.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("nav-open", open);
  }

  toggle?.addEventListener("click", () => {
    setMenuOpen(!navLinks?.classList.contains("open"));
  });

  const sectionLinks = Array.from(document.querySelectorAll(".nav-links a[href^='#']"));
  const sections = sectionLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  const homeSection = sections[0] || document.querySelector(".hero");

  function setActiveNav(targetId) {
    sectionLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${targetId}`;
      link.classList.toggle("is-active", active);
      if (active) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function syncActiveSection() {
    if (sections.length === 0) return;
    const marker = (nav?.offsetHeight || 68) + Math.min(180, window.innerHeight * 0.28);
    let current = sections[0];

    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= marker) {
        current = section;
      }
    });

    setActiveNav(current.id);
  }

  navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (link.getAttribute("href")?.startsWith("#")) {
        setActiveNav(link.getAttribute("href").slice(1));
        nav?.classList.toggle("is-away", link.getAttribute("href") !== `#${homeSection?.id}`);
      }
      setMenuOpen(false);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuOpen(false);
      closeLightbox();
    }
  });

  function syncNavLogo() {
    if (!nav) return;
    if (!homeSection) {
      nav.classList.add("is-away");
      return;
    }
    const navHeight = nav.offsetHeight || 68;
    nav.classList.toggle("is-away", homeSection.getBoundingClientRect().bottom < navHeight + 24);
  }

  window.addEventListener("scroll", () => {
    nav?.classList.toggle("is-scrolled", window.scrollY > 24);
    syncNavLogo();
    syncActiveSection();
  }, { passive: true });

  const revealItems = document.querySelectorAll(".reveal");
  if (prefersReducedMotion) {
    revealItems.forEach((item) => item.classList.add("visible"));
  } else if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }

  if (nav && sections.length > 0) {
    const initialSection = location.hash.replace("#", "");
    nav.classList.toggle("is-away", Boolean(initialSection && initialSection !== homeSection?.id));
  }

  if (sections.length > 0) {
    requestAnimationFrame(syncActiveSection);
    window.addEventListener("load", syncActiveSection, { once: true });
    window.addEventListener("hashchange", () => requestAnimationFrame(syncActiveSection));
    setTimeout(syncActiveSection, 120);
  } else if (nav && !homeSection) {
    nav.classList.add("is-away");
  }

  requestAnimationFrame(syncNavLogo);
  window.addEventListener("hashchange", () => requestAnimationFrame(syncNavLogo));
  window.addEventListener("load", syncNavLogo, { once: true });
  setTimeout(syncNavLogo, 120);

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");
  let previousFocus = null;

  function openLightbox(img) {
    if (!lightbox || !lightboxImg) return;
    previousFocus = document.activeElement;
    lightboxImg.src = img.dataset.full || img.src;
    lightboxImg.alt = img.alt || "";
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
    lightboxClose?.focus();
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg || !lightbox.classList.contains("open")) return;
    lightbox.classList.remove("open");
    lightboxImg.src = "";
    document.body.style.overflow = "";
    if (previousFocus && typeof previousFocus.focus === "function") previousFocus.focus();
  }

  document.querySelectorAll(".gallery-item img").forEach((img) => {
    img.addEventListener("click", () => openLightbox(img));
  });

  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
})();
