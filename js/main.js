/**
 * QV MEDIA — Advanced Paper-Cut Motion & Scroll Physics Engine
 * Luxury Editorial Magazine × Modern Creative Agency × Contemporary Indian Design
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initServicePillars();
  initHeroMotion();
  initScrollPhysicsEngine();
  initCaseStudiesMotion();
  initResultsInkStamp();
  initScrollReveals();
  initModals();
  initForms();
  initSmoothScroll();
});

/* --------------------------------------------------------------------------
   1. STICKY FLOATING HEADER & SCROLL TRACKER TOGGLE
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector('.header-nav');
  if (!header) return;

  const handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    if (scrollY > 40) {
      header.classList.add('scrolled');
      document.body.classList.add('has-scrolled');
    } else {
      header.classList.remove('scrolled');
      if (scrollY <= 10) {
        document.body.classList.remove('has-scrolled');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   2. MOBILE NAVIGATION DRAWER
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle-btn');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const links = document.querySelectorAll('.mobile-nav-link, .mobile-drawer-cta');

  if (!toggleBtn || !drawer) return;

  const toggleMenu = () => {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      drawer.classList.remove('open');
      toggleBtn.classList.remove('active');
      document.body.style.overflow = '';
    } else {
      drawer.classList.add('open');
      toggleBtn.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  toggleBtn.addEventListener('click', toggleMenu);

  links.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggleBtn.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* --------------------------------------------------------------------------
   3. SERVICE PILLARS INTERACTIVE ACCORDION (UNFOLDING PAPER PHYSICS)
   -------------------------------------------------------------------------- */
function initServicePillars() {
  const pillarCards = document.querySelectorAll('.pillar-card');
  if (!pillarCards.length) return;

  pillarCards.forEach((card, index) => {
    const trigger = card.querySelector('.pillar-header-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isAlreadyActive = card.classList.contains('active');

      // Close sibling cards for clean editorial focus
      pillarCards.forEach(c => {
        c.classList.remove('active');
        const trig = c.querySelector('.pillar-header-trigger');
        if (trig) trig.setAttribute('aria-expanded', 'false');
      });

      if (!isAlreadyActive) {
        card.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Ensure first pillar is open on load
  if (pillarCards.length > 0 && !document.querySelector('.pillar-card.active')) {
    pillarCards[0].classList.add('active');
    const firstTrigger = pillarCards[0].querySelector('.pillar-header-trigger');
    if (firstTrigger) firstTrigger.setAttribute('aria-expanded', 'true');
  }
}

/* --------------------------------------------------------------------------
   4. HERO CINEMATIC ASSEMBLY & MOUSE PARALLAX
   -------------------------------------------------------------------------- */
function initHeroMotion() {
  const hero = document.getElementById('hero');
  const moodboard = document.querySelector('.hero-moodboard');
  if (!hero || !moodboard) return;

  // Check reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  // Add assembled state
  setTimeout(() => {
    hero.classList.add('hero-assembled');
  }, 100);

  // Desktop Mouse Parallax across moodboard layers
  if (window.innerWidth >= 992) {
    const layers = moodboard.querySelectorAll('.moodboard-layer');

    moodboard.addEventListener('mousemove', (e) => {
      const rect = moodboard.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      layers.forEach((layer) => {
        const depth = parseFloat(layer.getAttribute('data-paper-depth') || '0.5');
        const moveX = x * depth * 24;
        const moveY = y * depth * 24;
        const baseRot = layer.classList.contains('moodboard-card-base') ? 2.5
          : layer.classList.contains('moodboard-photo-main') ? -2
          : layer.classList.contains('moodboard-photo-secondary') ? 3.5
          : layer.classList.contains('moodboard-note-card') ? -1.5 : 0;

        const tiltX = -y * depth * 8;
        const tiltY = x * depth * 8;

        layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotate(${baseRot}deg) perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      });
    });

    moodboard.addEventListener('mouseleave', () => {
      layers.forEach((layer) => {
        const baseRot = layer.classList.contains('moodboard-card-base') ? 2.5
          : layer.classList.contains('moodboard-photo-main') ? -2
          : layer.classList.contains('moodboard-photo-secondary') ? 3.5
          : layer.classList.contains('moodboard-note-card') ? -1.5 : 0;

        layer.style.transform = `translate3d(0, 0, 0) rotate(${baseRot}deg)`;
      });
    });
  }
}

/* --------------------------------------------------------------------------
   5. UNIFIED SCROLL PHYSICS ENGINE (RAF LOOP & PARALLAX)
   -------------------------------------------------------------------------- */
function initScrollPhysicsEngine() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const scrollFill = document.getElementById('paperScrollFill');
  const scrollFolio = document.getElementById('paperScrollFolio');
  const sectorsStrip = document.getElementById('sectorsStrip');
  const sectorsSection = document.getElementById('sectors');
  const approachSection = document.getElementById('approach');
  const approachFill = document.getElementById('approachProgressFill');
  const approachCards = document.querySelectorAll('.approach-step-card');
  const parallaxItems = document.querySelectorAll('[data-paper-depth]');

  let targetScrollY = window.scrollY || window.pageYOffset;
  let currentScrollY = targetScrollY;
  let scrollVelocity = 0;
  let isTicking = false;

  window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY || window.pageYOffset;
    if (!isTicking) {
      isTicking = true;
      requestAnimationFrame(renderScrollFrame);
    }
  }, { passive: true });

  function renderScrollFrame() {
    // Damped interpolation (lerp)
    const diff = targetScrollY - currentScrollY;
    currentScrollY += diff * 0.12;
    scrollVelocity = diff;

    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? Math.min(1, Math.max(0, currentScrollY / totalHeight)) : 0;

    // 1. Update Paper Scroll Indicator
    if (scrollFill) {
      scrollFill.style.height = `${(progress * 100).toFixed(1)}%`;
    }
    if (scrollFolio) {
      const pageIndex = Math.min(14, Math.floor(progress * 14) + 1);
      scrollFolio.textContent = pageIndex < 10 ? `0${pageIndex}` : `${pageIndex}`;
    }

    // 2. Parallax Paper Layers (Desktop only for performance & touch precision)
    if (window.innerWidth >= 992) {
      const winHeight = window.innerHeight;

      parallaxItems.forEach(el => {
        // Skip hero moodboard layers (they have mouse parallax)
        if (el.closest('.hero-moodboard')) return;

        const rect = el.getBoundingClientRect();
        if (rect.top < winHeight && rect.bottom > 0) {
          const depth = parseFloat(el.getAttribute('data-paper-depth') || '0.5');
          const elementCenter = rect.top + rect.height / 2;
          const viewportCenter = winHeight / 2;
          const offset = (viewportCenter - elementCenter) * depth * 0.12;
          const inertiaTilt = Math.max(-1.5, Math.min(1.5, scrollVelocity * 0.02 * depth));

          el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0) rotate(${inertiaTilt.toFixed(2)}deg)`;
        }
      });
    }

    // 3. "Who We Work With" — Continuous Infinite Auto-Scroll handled via GPU-accelerated CSS marquee animation

    // 4. Approach Signature Physical Paper Timeline Progression
    if (approachSection && approachFill) {
      const aRect = approachSection.getBoundingClientRect();
      const winH = window.innerHeight;

      if (aRect.top < winH && aRect.bottom > 0) {
        const startPoint = winH * 0.75;
        const endPoint = winH * 0.2;
        const totalDist = aRect.height + (startPoint - endPoint);
        const currentDist = startPoint - aRect.top;
        const aProgress = Math.min(1, Math.max(0, currentDist / totalDist));

        // Update connected progress line
        approachFill.style.width = `${(aProgress * 100).toFixed(1)}%`;

        // Sequentially unfold step cards
        approachCards.forEach((card, idx) => {
          const threshold = 0.18 + idx * 0.24;
          if (aProgress >= threshold) {
            card.classList.add('unfolded');
          } else {
            card.classList.remove('unfolded');
          }
        });
      }
    }

    // Continue loop if still interpolating
    if (Math.abs(diff) > 0.3) {
      requestAnimationFrame(renderScrollFrame);
    } else {
      currentScrollY = targetScrollY;
      isTicking = false;
    }
  }

  // Trigger initial frame
  requestAnimationFrame(renderScrollFrame);
}

/* --------------------------------------------------------------------------
   6. CASE STUDIES & PORTFOLIO 3D TACTILE TILT
   -------------------------------------------------------------------------- */
function initCaseStudiesMotion() {
  if (window.innerWidth < 992) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const tiltTargets = document.querySelectorAll('.paper-tilt-target');

  tiltTargets.forEach(card => {
    const parentCard = card.closest('.paper-portfolio-card') || card;

    parentCard.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const tiltX = -y * 8;
      const tiltY = x * 8;

      card.style.transform = `perspective(800px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale(1.02)`;
    });

    parentCard.addEventListener('mouseleave', () => {
      const defaultRot = card.getAttribute('data-tilt-direction') === 'negative' ? -1.5
        : card.getAttribute('data-tilt-direction') === 'subtle' ? 1 : 0;
      card.style.transform = `perspective(800px) rotateX(0deg) rotateY(0deg) rotate(${defaultRot}deg) scale(1)`;
    });
  });
}

/* --------------------------------------------------------------------------
   7. RESULTS — PRINTED INK STAMP EFFECT OBSERVER
   -------------------------------------------------------------------------- */
function initResultsInkStamp() {
  const resultsSection = document.getElementById('results');
  if (!resultsSection) return;

  const stampCards = resultsSection.querySelectorAll('.ink-stamp-card');
  if (!stampCards.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        stampCards.forEach((card, i) => {
          const delay = parseInt(card.getAttribute('data-stamp-delay') || `${i * 150}`, 10);
          setTimeout(() => {
            card.classList.add('stamped');
          }, delay);
        });
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });

  observer.observe(resultsSection);
}

/* --------------------------------------------------------------------------
   8. INTERSECTION OBSERVER SCROLL REVEALS
   -------------------------------------------------------------------------- */
function initScrollReveals() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (!elements.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   9. MODALS: FREE BRAND AUDIT & START CONVERSATION
   -------------------------------------------------------------------------- */
function initModals() {
  const auditModal = document.getElementById('auditModal');
  const conversationModal = document.getElementById('conversationModal');
  
  // Triggers for Audit Modal
  document.querySelectorAll('.open-audit-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(auditModal);
    });
  });

  // Triggers for Conversation Modal
  document.querySelectorAll('.open-conversation-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(conversationModal);
    });
  });

  // Close buttons and backdrop clicks
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.closest('.modal-close-btn')) {
        closeModal(overlay);
      }
    });
  });

  // Escape key to close modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-overlay.active');
      if (activeModal) closeModal(activeModal);
    }
  });

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    const firstInput = modal.querySelector('input, select, textarea');
    if (firstInput) setTimeout(() => firstInput.focus(), 150);
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* --------------------------------------------------------------------------
   10. FORM SUBMISSIONS & EMAIL DELIVERY (qvmedia.in@gmail.com)
   -------------------------------------------------------------------------- */
function getSubmissionTimestamp() {
  const now = new Date();
  try {
    return now.toLocaleString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    }) + ' (IST)';
  } catch (e) {
    return now.toUTCString();
  }
}

function initForms() {
  // Brand Audit Form
  const auditForm = document.getElementById('brandAuditForm');
  if (auditForm) {
    auditForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const brandInput = auditForm.querySelector('[name="brandName"]');
      const urlInput = auditForm.querySelector('[name="brandUrl"]');
      const categoryInput = auditForm.querySelector('[name="category"]');
      const challengeInput = auditForm.querySelector('[name="challenge"]');
      const contactInput = auditForm.querySelector('[name="contact"]');
      const submitBtn = auditForm.querySelector('button[type="submit"]');

      const brandName = brandInput ? brandInput.value.trim() : '';
      const brandUrl = urlInput ? urlInput.value.trim() : '';
      const category = categoryInput ? categoryInput.value : '';
      const challenge = challengeInput ? challengeInput.value : '';
      const contact = contactInput ? contactInput.value.trim() : '';

      if (!brandName) {
        showToast('Please provide your brand or business name.', 'error');
        brandInput?.focus();
        return;
      }
      if (!contact) {
        showToast('Please provide your contact email or WhatsApp number.', 'error');
        contactInput?.focus();
        return;
      }

      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.75';
      submitBtn.style.cursor = 'not-allowed';
      submitBtn.innerHTML = '<span>Submitting Request...</span>';

      const timestamp = getSubmissionTimestamp();
      const payload = {
        "Brand / Business Name": brandName,
        "Website / Instagram URL": brandUrl || 'Not provided',
        "Industry Sector": category,
        "Biggest Challenge": challenge,
        "Contact Details": contact,
        "Submission Date & Time": timestamp,
        "_subject": `New QV Media Brand Audit Request — ${brandName}`,
        "_template": "table",
        "_captcha": "false"
      };

      try {
        const response = await fetch('https://formsubmit.co/ajax/qvmedia.in@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (data.success === 'true' || data.success === true || (data.message && data.message.includes('Activate Form'))) {
          closeAllModals();
          showToast(`Audit request received for ${brandName}. Our creative team will review your profile shortly.`, 'success');
          auditForm.reset();
        } else if (data.message && data.message.includes('HTML files')) {
          showToast('Audit request noted. For direct email dispatch, please serve via a web server.', 'error');
        } else {
          showToast(data.message || 'Audit submission failed. Please try again.', 'error');
        }
      } catch (err) {
        console.error('Audit submission error:', err);
        showToast('Unable to reach the email server. Please check your connection or contact us directly.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '';
        submitBtn.style.cursor = '';
        submitBtn.innerHTML = originalBtnHtml;
      }
    });
  }

  // Conversation Modal Form
  const convoForm = document.getElementById('conversationForm');
  if (convoForm) {
    convoForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const clientInput = convoForm.querySelector('[name="clientName"]');
      const brandInput = convoForm.querySelector('[name="brand"]');
      const contactInput = convoForm.querySelector('[name="contact"]');
      const briefInput = convoForm.querySelector('[name="brief"]');
      const submitBtn = convoForm.querySelector('button[type="submit"]');

      const clientName = clientInput ? clientInput.value.trim() : '';
      const brand = brandInput ? brandInput.value.trim() : '';
      const contact = contactInput ? contactInput.value.trim() : '';
      const brief = briefInput ? briefInput.value.trim() : '';

      if (!clientName) {
        showToast('Please provide your name.', 'error');
        clientInput?.focus();
        return;
      }
      if (!contact) {
        showToast('Please provide your contact email or WhatsApp number.', 'error');
        contactInput?.focus();
        return;
      }

      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.75';
      submitBtn.style.cursor = 'not-allowed';
      submitBtn.innerHTML = '<span>Sending Inquiry...</span>';

      const timestamp = getSubmissionTimestamp();
      const payload = {
        "Full Name": clientName,
        "Company / Brand": brand || 'Independent',
        "Contact Details": contact,
        "Project Brief": brief || 'None specified',
        "Submission Date & Time": timestamp,
        "_subject": `New QV Media Project Inquiry — ${clientName}${brand ? ' (' + brand + ')' : ''}`,
        "_template": "table",
        "_captcha": "false"
      };

      try {
        const response = await fetch('https://formsubmit.co/ajax/qvmedia.in@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (data.success === 'true' || data.success === true || (data.message && data.message.includes('Activate Form'))) {
          closeAllModals();
          showToast(`Thank you, ${clientName}! We have logged your project inquiry and will be in touch within 24 hours.`, 'success');
          convoForm.reset();
        } else if (data.message && data.message.includes('HTML files')) {
          showToast('Inquiry noted. For direct email dispatch, please serve via a web server.', 'error');
        } else {
          showToast(data.message || 'Inquiry submission failed. Please try again.', 'error');
        }
      } catch (err) {
        console.error('Conversation submission error:', err);
        showToast('Unable to reach the email server. Please check your connection or contact us directly.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '';
        submitBtn.style.cursor = '';
        submitBtn.innerHTML = originalBtnHtml;
      }
    });
  }

  // Main Page Contact Form
  const contactForm = document.getElementById('mainContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = contactForm.querySelector('[name="name"]');
      const emailInput = contactForm.querySelector('[name="email"]');
      const phoneInput = contactForm.querySelector('[name="phone"]');
      const brandInput = contactForm.querySelector('[name="brand"]');
      const serviceInput = contactForm.querySelector('[name="service"]');
      const messageInput = contactForm.querySelector('[name="message"]');
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const brand = brandInput ? brandInput.value.trim() : '';
      const service = serviceInput ? serviceInput.value : 'General Partnership';
      const message = messageInput ? messageInput.value.trim() : '';

      // Validate required fields
      if (!name) {
        showToast('Please enter your name or title.', 'error');
        nameInput?.focus();
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        showToast('Please enter a valid work email address (e.g. name@company.com).', 'error');
        emailInput?.focus();
        return;
      }

      const cleanPhone = phone.replace(/\D/g, '');
      if (!phone || cleanPhone.length < 7) {
        showToast('Please enter a valid phone or WhatsApp number (at least 7 digits).', 'error');
        phoneInput?.focus();
        return;
      }

      if (!brand) {
        showToast('Please enter your brand or business name.', 'error');
        brandInput?.focus();
        return;
      }

      // Prevent accidental duplicate submissions
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.75';
      submitBtn.style.cursor = 'not-allowed';
      submitBtn.innerHTML = '<span>Sending Message...</span>';

      const timestamp = getSubmissionTimestamp();
      const subject = `New QV Media Website Enquiry — ${name}${brand ? ' (' + brand + ')' : ''}`;

      const payload = {
        "Name": name,
        "Email": email,
        "Phone number": phone,
        "Company/Brand": brand,
        "Service interested in": service,
        "Project/message/details": message || 'None provided',
        "Submission date and time": timestamp,
        "_subject": subject,
        "_template": "table",
        "_captcha": "false",
        "_replyto": email
      };

      try {
        const response = await fetch('https://formsubmit.co/ajax/qvmedia.in@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.success === 'true' || data.success === true) {
          showToast(`Thank you, ${name}! Your inquiry has been sent to QV Media (qvmedia.in@gmail.com). We will connect with you shortly.`, 'success');
          contactForm.reset();
        } else if (data.message && data.message.includes('Activate Form')) {
          showToast(`Thank you, ${name}! Your inquiry has been dispatched to qvmedia.in@gmail.com.`, 'success');
          contactForm.reset();
        } else if (data.message && data.message.includes('HTML files')) {
          showToast('Inquiry noted! Note: Direct email dispatch requires running via a web server (e.g. live site or http://localhost).', 'error');
        } else {
          showToast(data.message || 'Submission failed. Please try again.', 'error');
        }
      } catch (err) {
        console.error('Contact form submission error:', err);
        showToast('Unable to reach the email server. Please check your connection or contact us via WhatsApp.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '';
        submitBtn.style.cursor = '';
        submitBtn.innerHTML = originalBtnHtml;
      }
    });
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.classList.remove('active');
    });
    document.body.style.overflow = '';
  }
}

/* --------------------------------------------------------------------------
   11. TOAST NOTIFICATION ENGINE
   -------------------------------------------------------------------------- */
function showToast(message, type = 'success') {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  if (type === 'error') {
    toast.style.borderLeftColor = '#e74c3c';
  } else {
    toast.style.borderLeftColor = 'var(--gold)';
  }
  toast.classList.add('show');

  if (toast._timer) {
    clearTimeout(toast._timer);
  }
  toast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 5000);
}

/* --------------------------------------------------------------------------
   12. SMOOTH SCROLLING WITH OFFSET FOR STICKY NAV
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId.startsWith('#')) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 76;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
