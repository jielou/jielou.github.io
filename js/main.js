/* ---- Scroll reveal ---- */
const observer = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  }),
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Make content visible immediately in headless/automated browsers for screenshots
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || navigator.webdriver) {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}

/* ---- Nav scroll tint ---- */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ---- Mobile nav toggle ---- */
const toggle   = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
if (toggle && navLinks) {
  toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  document.querySelectorAll('.nav-links a').forEach(a =>
    a.addEventListener('click', () => navLinks.classList.remove('open'))
  );
}

/* ---- Lightbox (gallery page) ---- */
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

if (lightbox && lightboxImg) {
  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  };

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });
}
