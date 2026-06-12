/**
 * Loya's Auto Repair — Shared JavaScript
 * Nav, scroll animations, count-up stats, contact form validation
 */

(function () {
  'use strict';

  const MAPS_URL =
    'https://www.google.com/maps/search/?api=1&query=27402+Cypresswood+Dr,+Spring,+TX+77373';
  const PHONE_TEL = 'tel:+18324682340';

  /* -----------------------------------------------------------------------
     Active navigation link (filename detection)
     ----------------------------------------------------------------------- */
  function setActiveNavLink() {
    let page = window.location.pathname.split('/').pop() || '';
    if (!page || page === '' || !page.includes('.')) {
      page = 'index.html';
    }
    const current = page;

    document.querySelectorAll('[data-nav-link]').forEach((link) => {
      const href = link.getAttribute('href');
      const isActive = href === current || (current === 'index.html' && href === 'index.html');
      link.classList.toggle('navbar__link--active', isActive);
      link.classList.toggle('mobile-menu__link--active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  /* -----------------------------------------------------------------------
     Mobile menu toggle
     ----------------------------------------------------------------------- */
  function initMobileMenu() {
    const toggle = document.querySelector('.navbar__toggle');
    const menu = document.querySelector('.mobile-menu');
    if (!toggle || !menu) return;

    function closeMenu() {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    function openMenu() {
      toggle.setAttribute('aria-expanded', 'true');
      menu.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        closeMenu();
        toggle.focus();
      }
    });
  }

  /* -----------------------------------------------------------------------
     Intersection Observer — scroll animations
     ----------------------------------------------------------------------- */
  function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    if (!elements.length) return;

    const heroElements = document.querySelectorAll('.hero .animate-on-scroll');
    heroElements.forEach((el) => el.classList.add('is-visible'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach((el) => {
      if (!el.closest('.hero')) {
        observer.observe(el);
      }
    });
  }

  /* -----------------------------------------------------------------------
     Count-up animation (About page stats)
     ----------------------------------------------------------------------- */
  function initCountUp() {
    const stats = document.querySelectorAll('[data-count]');
    if (!stats.length) return;

    const animateCount = (el) => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 2000;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(eased * target);
        el.textContent = value.toLocaleString() + suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    stats.forEach((stat) => observer.observe(stat));
  }

  /* -----------------------------------------------------------------------
     Contact form validation
     ----------------------------------------------------------------------- */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const successEl = document.getElementById('form-success');

    const validators = {
      fullName: (v) => (v.trim().length >= 2 ? '' : 'Please enter your full name.'),
      phone: (v) =>
        /^[\d\s().+-]{10,}$/.test(v.replace(/\s/g, ''))
          ? ''
          : 'Please enter a valid phone number.',
      email: (v) =>
        !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
          ? ''
          : 'Please enter a valid email address.',
      vehicleYear: (v) =>
        /^\d{4}$/.test(v) && parseInt(v, 10) >= 1900 && parseInt(v, 10) <= new Date().getFullYear() + 1
          ? ''
          : 'Please enter a valid 4-digit year.',
      vehicleMake: (v) => (v.trim().length >= 1 ? '' : 'Please enter the vehicle make.'),
      vehicleModel: (v) => (v.trim().length >= 1 ? '' : 'Please enter the vehicle model.'),
      dropOffDate: (v) => {
        if (!v) return 'Please select a preferred drop-off date.';
        const selected = new Date(v + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selected >= today ? '' : 'Date cannot be in the past.';
      },
    };

    function showError(fieldName, message) {
      const input = form.querySelector(`[name="${fieldName}"]`);
      const errorEl = document.getElementById(`error-${fieldName}`);
      if (input) input.classList.toggle('error', !!message);
      if (errorEl) errorEl.textContent = message;
    }

    function validateField(name) {
      const input = form.querySelector(`[name="${name}"]`);
      if (!input || !validators[name]) return true;
      const message = validators[name](input.value);
      showError(name, message);
      return !message;
    }

    form.querySelectorAll('input, select, textarea').forEach((input) => {
      input.addEventListener('blur', () => {
        if (validators[input.name]) validateField(input.name);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let valid = true;
      Object.keys(validators).forEach((name) => {
        if (!validateField(name)) valid = false;
      });

      if (!valid) {
        const firstError = form.querySelector('.error');
        if (firstError) firstError.focus();
        return;
      }

      form.style.display = 'none';
      if (successEl) {
        successEl.classList.add('is-visible');
        successEl.setAttribute('tabindex', '-1');
        successEl.focus();
      }
    });

    const dateInput = form.querySelector('[name="dropOffDate"]');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
    }
  }

  /* -----------------------------------------------------------------------
     Init
     ----------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    setActiveNavLink();
    initMobileMenu();
    initScrollAnimations();
    initCountUp();
    initContactForm();
  });
})();
