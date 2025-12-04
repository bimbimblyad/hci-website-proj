document.addEventListener('DOMContentLoaded', () => {
  // --- Fade-in on scroll (IntersectionObserver with scroll fallback) ---
  const fadeTargets = Array.from(document.querySelectorAll('.fade-on-scroll'));
  const reveal = (el) => {
    el.classList.add('fade-in');
    el.classList.remove('fade-hidden');
  };

  if (fadeTargets.length) {
    console.log('[script] fadeTargets:', fadeTargets.length);
    // set initial hidden state
    fadeTargets.forEach(el => el.classList.add('fade-hidden'));

    if ('IntersectionObserver' in window) {
      // use a rootMargin so elements are revealed a bit earlier when scrolling
      const obs = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            console.log('[script] reveal:', entry.target);
            reveal(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

      fadeTargets.forEach(el => obs.observe(el));
    } else {
      // fallback for older browsers: simple scroll check
      const check = () => {
        fadeTargets.forEach(el => {
          if (el.classList.contains('fade-in')) return;
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.92) reveal(el);
        });
      };
      check();
      window.addEventListener('scroll', check, { passive: true });
      window.addEventListener('resize', check);
    }
  }

  // --- Contact form handling (validation + message) ---
  const form = document.querySelector('.contact-section form');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('button');
  if (!submitBtn) return;

  let msg = form.querySelector('.sent-message');
  if (!msg) {
    msg = document.createElement('div');
    msg.className = 'sent-message';
    submitBtn.insertAdjacentElement('afterend', msg);
  }

  const showMessage = (text, isError = false) => {
    msg.textContent = text;
    msg.classList.add('show');
    if (isError) msg.classList.add('error'); else msg.classList.remove('error');
    clearTimeout(msg._hideTimer);
    msg._hideTimer = setTimeout(() => msg.classList.remove('show'), 3500);
  };

  const markErrors = (fields) => {
    form.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    form.querySelectorAll('.label-error').forEach(el => el.classList.remove('label-error'));

    fields.forEach(f => {
      f.classList.add('input-error');
      if (f.id) {
        const lab = form.querySelector(`label[for="${f.id}"]`);
        if (lab) lab.classList.add('label-error');
      }
    });
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const allFields = Array.from(form.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea'));
    const checkFields = allFields.length >= 3 ? allFields.slice(0, 3) : allFields;
    const emptyFields = checkFields.filter(f => !(f.value || '').trim().length);

    if (emptyFields.length > 0) {
      markErrors(emptyFields);
      showMessage('Please fill out all required fields', true);
      return;
    }

    form.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    form.querySelectorAll('.label-error').forEach(el => el.classList.remove('label-error'));

    showMessage('Message sent!', false);
    form.reset();
  });
});

// Top-button: scroll to top and show/hide on scroll
document.addEventListener('DOMContentLoaded', () => {
  const topBtn = document.querySelector('.top-button');
  if (!topBtn) return;

  const onClick = (ev) => {
    ev.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  topBtn.addEventListener('click', onClick);

  const toggle = () => {
    if (window.scrollY > 300) topBtn.classList.remove('hide'); else topBtn.classList.add('hide');
  };

  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
});