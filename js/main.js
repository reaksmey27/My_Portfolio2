const STORAGE_KEYS = {
  language: 'lang',
  theme: 'theme',
};

const DEFAULT_LANGUAGE = 'en';
const DEFAULT_THEME = 'light';
const LANGUAGE_CHANGED_EVENT = 'languageChanged';

const FLAG_IMAGES = {
  en: 'https://flagcdn.com/w40/kh.png',
  km: 'https://flagcdn.com/w40/us.png',
};

const TYPEWRITER_PHRASES = {
  en: ['a Web Developer.', 'a Designer.', 'a YouTuber.', 'a Vlogger.'],
  km: ['អ្នកអភិវឌ្ឍន៍វេបសាយ', 'អ្នករចនា', 'អ្នកផលិតវីដេអូយូធូប', 'អ្នកថតវីដេអូ'],
};

const PORTFOLIO_LABELS = {
  seeMore: {
    en: 'See More Projects <i class="fas fa-arrow-down ms-2"></i>',
    km: 'មើលគម្រោងបន្ថែមទៀត <i class="fas fa-arrow-down ms-2"></i>',
  },
  seeLess: {
    en: 'See Less <i class="fas fa-arrow-up ms-2"></i>',
    km: 'បង្ហាញតិច <i class="fas fa-arrow-up ms-2"></i>',
  },
};

const CONTACT_MESSAGES = {
  sending: {
    en: 'Sending...',
    km: 'កំពុងបញ្ជូន...',
  },
  success: {
    en: 'Message sent successfully!',
    km: 'បានផ្ញើសារជោគជ័យ!',
  },
  error: {
    en: 'Failed to send message. Please try again.',
    km: 'បរាជ័យក្នុងការផ្ញើសារ។ សូមព្យាយាមម្តងទៀត។',
  },
  unavailable: {
    en: 'Contact service is temporarily unavailable.',
    km: 'សេវាទំនាក់ទំនងមិនអាចប្រើបានជាបណ្តោះអាសន្ន។',
  },
};

const EMAILJS_CONFIG = {
  publicKey: 'NPUMdVXjs9YbxdD0i',
  serviceId: 'service_qogw09w',
  templateId: 'template_oatx0qr',
};

const getStoredValue = (key, fallback) => localStorage.getItem(key) || fallback;

const getCurrentLanguage = () => getStoredValue(STORAGE_KEYS.language, DEFAULT_LANGUAGE);

const getLocalizedText = (messages, language = getCurrentLanguage()) =>
  messages[language] || messages.en;

const throttle = (callback, delay = 100) => {
  let lastRun = 0;
  let timeoutId;

  return (...args) => {
    const now = Date.now();
    const remaining = delay - (now - lastRun);

    if (remaining <= 0) {
      window.clearTimeout(timeoutId);
      lastRun = now;
      callback(...args);
      return;
    }

    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      lastRun = Date.now();
      callback(...args);
    }, remaining);
  };
};

const setActiveButton = (buttons, activeButton) => {
  buttons.forEach((button) => {
    const isActive = button === activeButton;
    button.classList.toggle('active', isActive);
    button.classList.toggle('btn-primary', isActive);
    button.classList.toggle('btn-outline-primary', !isActive);
  });
};

const createFilterSystem = ({
  buttonSelector,
  itemSelector,
  seeMoreButtonId = null,
  initialCount = null,
  seeMoreLabels = null,
}) => {
  const buttons = Array.from(document.querySelectorAll(buttonSelector));
  const items = Array.from(document.querySelectorAll(itemSelector));
  const seeMoreButton = seeMoreButtonId ? document.getElementById(seeMoreButtonId) : null;

  if (!buttons.length || !items.length) {
    return;
  }

  let currentFilter = 'all';
  let showingAll = false;

  const updateSeeMoreButton = (matchedItemsCount) => {
    if (!seeMoreButton || !initialCount || !seeMoreLabels) {
      return;
    }

    const shouldShowButton = currentFilter === 'all' && matchedItemsCount > initialCount;
    seeMoreButton.style.display = shouldShowButton ? 'inline-block' : 'none';

    if (!shouldShowButton) {
      return;
    }

    const labelKey = showingAll ? 'seeLess' : 'seeMore';
    seeMoreButton.innerHTML = getLocalizedText(seeMoreLabels[labelKey]);
  };

  const updateItems = () => {
    const matchedItems = items.filter((item) => {
      return currentFilter === 'all' || item.dataset.category === currentFilter;
    });

    items.forEach((item) => {
      const isMatched = matchedItems.includes(item);
      const visibleIndex = matchedItems.indexOf(item);
      const isVisible =
        isMatched && (!initialCount || showingAll || visibleIndex < initialCount);

      item.style.display = isVisible ? 'block' : 'none';
      item.style.animation = isVisible ? 'fadeIn 0.5s ease forwards' : '';
    });

    updateSeeMoreButton(matchedItems.length);
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      currentFilter = button.dataset.filter || 'all';
      showingAll = false;
      setActiveButton(buttons, button);
      updateItems();
    });
  });

  if (seeMoreButton) {
    seeMoreButton.addEventListener('click', () => {
      showingAll = !showingAll;
      updateItems();
    });
  }

  window.addEventListener(LANGUAGE_CHANGED_EVENT, updateItems);
  updateItems();
};

const initLanguageToggle = () => {
  const englishElements = document.querySelectorAll('.lang-en');
  const khmerElements = document.querySelectorAll('.lang-kh');
  const languageButton = document.getElementById('lang-toggle');
  const languageLabel = document.getElementById('lang-label');
  const languageImage = document.getElementById('lang-img');

  const applyLanguage = (language) => {
    const isKhmer = language === 'km';

    englishElements.forEach((element) => {
      element.classList.toggle('d-none', isKhmer);
    });

    khmerElements.forEach((element) => {
      element.classList.toggle('d-none', !isKhmer);
    });

    if (languageLabel) {
      languageLabel.textContent = isKhmer ? 'EN' : 'KH';
    }

    if (languageImage) {
      languageImage.src = FLAG_IMAGES[language] || FLAG_IMAGES.en;
    }

    document.body.classList.toggle('khmer-font', isKhmer);
    document.documentElement.lang = isKhmer ? 'km' : 'en';
    window.dispatchEvent(new Event(LANGUAGE_CHANGED_EVENT));
  };

  let currentLanguage = getCurrentLanguage();
  applyLanguage(currentLanguage);

  if (!languageButton) {
    return;
  }

  languageButton.addEventListener('click', () => {
    currentLanguage = currentLanguage === 'en' ? 'km' : 'en';
    localStorage.setItem(STORAGE_KEYS.language, currentLanguage);
    applyLanguage(currentLanguage);
  });
};

const initTypewriter = () => {
  const textElement = document.getElementById('typewriter');

  if (!textElement) {
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let language = getCurrentLanguage();
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let timeoutId;

  const resetState = () => {
    language = getCurrentLanguage();
    phraseIndex = 0;
    charIndex = 0;
    isDeleting = false;
  };

  const renderStaticText = () => {
    textElement.textContent = TYPEWRITER_PHRASES[getCurrentLanguage()][0];
  };

  const type = () => {
    const currentLanguage = getCurrentLanguage();

    if (currentLanguage !== language) {
      resetState();
    }

    const currentPhrase = TYPEWRITER_PHRASES[language][phraseIndex];
    textElement.textContent = currentPhrase.slice(0, charIndex);

    let speed = isDeleting ? 50 : 120;

    if (isDeleting) {
      charIndex -= 1;
    } else {
      charIndex += 1;
    }

    if (!isDeleting && charIndex > currentPhrase.length) {
      isDeleting = true;
      speed = 2000;
    } else if (isDeleting && charIndex < 0) {
      isDeleting = false;
      charIndex = 0;
      phraseIndex = (phraseIndex + 1) % TYPEWRITER_PHRASES[language].length;
      speed = 500;
    }

    timeoutId = window.setTimeout(type, speed);
  };

  if (prefersReducedMotion) {
    renderStaticText();
    window.addEventListener(LANGUAGE_CHANGED_EVENT, renderStaticText);
    return;
  }

  window.addEventListener(LANGUAGE_CHANGED_EVENT, () => {
    window.clearTimeout(timeoutId);
    resetState();
    type();
  });

  type();
};

const initPortfolio = () => {
  createFilterSystem({
    buttonSelector: '.filter-btn',
    itemSelector: '.portfolio-item',
    seeMoreButtonId: 'see-more-btn',
    initialCount: 3,
    seeMoreLabels: PORTFOLIO_LABELS,
  });
};

const initSkillsFilter = () => {
  createFilterSystem({
    buttonSelector: '.skills-filter-btn',
    itemSelector: '.skill-item',
  });
};

const initDarkMode = () => {
  const themeButton = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-bs-theme', theme);

    if (themeIcon) {
      themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    localStorage.setItem(STORAGE_KEYS.theme, theme);
  };

  applyTheme(getStoredValue(STORAGE_KEYS.theme, DEFAULT_THEME));

  if (!themeButton) {
    return;
  }

  themeButton.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  });
};

const initScrollEffects = () => {
  const sections = Array.from(document.querySelectorAll('section'));
  const sectionsWithIds = sections.filter((section) => section.id);
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const navbar = document.querySelector('.navbar');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add('show');
          currentObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    sections.forEach((section) => {
      section.classList.add('reveal-hidden');
      observer.observe(section);
    });
  } else {
    sections.forEach((section) => section.classList.add('show'));
  }

  const updateScrollState = throttle(() => {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }

    let currentSectionId = '';

    sectionsWithIds.forEach((section) => {
      if (window.scrollY >= section.offsetTop - 120) {
        currentSectionId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      link.classList.toggle('active', currentSectionId && href.includes(currentSectionId));
    });
  }, 100);

  window.addEventListener('scroll', updateScrollState, { passive: true });
  updateScrollState();
};

const initBackToTop = () => {
  const backToTopButton = document.getElementById('back-to-top');

  if (!backToTopButton) {
    return;
  }

  const toggleButtonVisibility = throttle(() => {
    backToTopButton.classList.toggle('show', window.scrollY > 400);
  }, 100);

  window.addEventListener('scroll', toggleButtonVisibility, { passive: true });
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  toggleButtonVisibility();
};

const initContactForm = () => {
  const contactForm = document.getElementById('contact-form');

  if (!contactForm) {
    return;
  }

  const submitButton = contactForm.querySelector('button[type="submit"]');
  const emailService = window.emailjs;

  if (emailService?.init) {
    emailService.init(EMAILJS_CONFIG.publicKey);
  }

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const language = getCurrentLanguage();

    if (!submitButton) {
      return;
    }

    if (!emailService?.sendForm) {
      alert(getLocalizedText(CONTACT_MESSAGES.unavailable, language));
      return;
    }

    const originalButtonContent = submitButton.innerHTML;
    submitButton.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>${getLocalizedText(
      CONTACT_MESSAGES.sending,
      language
    )}`;
    submitButton.disabled = true;

    try {
      await emailService.sendForm(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        contactForm
      );
      alert(getLocalizedText(CONTACT_MESSAGES.success, language));
      contactForm.reset();
    } catch (error) {
      alert(getLocalizedText(CONTACT_MESSAGES.error, language));
      console.error('EmailJS error:', error);
    } finally {
      submitButton.innerHTML = originalButtonContent;
      submitButton.disabled = false;
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initLanguageToggle();
  initTypewriter();
  initPortfolio();
  initSkillsFilter();
  initScrollEffects();
  initBackToTop();
  initContactForm();
});
