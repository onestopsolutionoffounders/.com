/* =============================================
   ONE STOP SOLUTION OF FOUNDERS — SCRIPTS
   ============================================= */

(function () {
  'use strict';

  /* ---- Dynamic year in footer ---- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Sticky header on scroll ---- */
  const header = document.getElementById('header');
  let lastScroll = 0;
  function onScroll() {
    const y = window.scrollY;
    if (y > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile nav toggle ---- */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ---- Scroll-triggered animations ---- */
  const animEls = document.querySelectorAll('[data-animate]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.delay || 0, 10);
          setTimeout(() => el.classList.add('is-visible'), delay);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    animEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: show everything
    animEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---- Active nav link on scroll ---- */
  const sections   = document.querySelectorAll('section[id], div[id]');
  const navLinkEls = document.querySelectorAll('.nav__link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinkEls.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => navObserver.observe(s));

  /* ---- Contact form ---- */
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic validation
      const name    = form.querySelector('#name').value.trim();
      const email   = form.querySelector('#email').value.trim();
      const business = form.querySelector('#business').value.trim();

      if (!name || !email || !business) {
        showError('Please fill in all required fields.');
        return;
      }
      if (!isValidEmail(email)) {
        showError('Please enter a valid email address.');
        return;
      }

      // Simulate form submission
      const submitBtn = form.querySelector('[type="submit"]');
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      setTimeout(() => {
        success.textContent = '✅ Message sent! We\'ll be in touch within 48 hours.';
        form.reset();
        submitBtn.textContent = 'Send My Request →';
        submitBtn.disabled = false;

        // Clear message after 6s
        setTimeout(() => { success.textContent = ''; }, 6000);
      }, 1400);
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(msg) {
    success.style.color = '#FCA5A5';
    success.textContent = '⚠️ ' + msg;
    setTimeout(() => {
      success.textContent = '';
      success.style.color = '';
    }, 4000);
  }

  /* ---- Chaos tags: staggered float on hover ---- */
  const tags = document.querySelectorAll('.chaos__tag');
  tags.forEach((tag, i) => {
    tag.style.animationDelay = `${i * 0.12}s`;
    tag.addEventListener('mouseenter', () => {
      tag.style.transform = `translateY(-4px) rotate(${Math.random() * 4 - 2}deg)`;
      tag.style.opacity = '1';
    });
    tag.addEventListener('mouseleave', () => {
      tag.style.transform = '';
      tag.style.opacity = '';
    });
  });

  /* ---- Smooth anchor scroll (fallback for older browsers) ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target   = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Keyboard focus visibility for nav toggle ---- */
  navToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navToggle.click();
    }
  });

})();
