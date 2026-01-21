/* ===============================
   1. Language Toggle Logic
=============================== */
const initLanguageToggle = () => {
  const applyLanguage = (lang) => {
    const enElements = document.querySelectorAll('.lang-en');
    const khElements = document.querySelectorAll('.lang-kh');
    const langLabel = document.getElementById('lang-label');
    const langImg = document.getElementById('lang-img');

    if (lang === 'km') {
      enElements.forEach(el => el.classList.add('d-none'));
      khElements.forEach(el => el.classList.remove('d-none'));

      if (langLabel) langLabel.innerText = 'EN';
      if (langImg) langImg.src = 'https://flagcdn.com/w40/us.png';

      document.body.classList.add('khmer-font');
    } else {
      enElements.forEach(el => el.classList.remove('d-none'));
      khElements.forEach(el => el.classList.add('d-none'));

      if (langLabel) langLabel.innerText = 'KH';
      if (langImg) langImg.src = 'https://flagcdn.com/w40/kh.png';

      document.body.classList.remove('khmer-font');
    }

    window.dispatchEvent(new Event('languageChanged'));
  };

  let currentLang = localStorage.getItem("lang") || "en";
  applyLanguage(currentLang);

  const langBtn = document.getElementById("lang-toggle");
  if (langBtn) {
    langBtn.addEventListener("click", () => {
      currentLang = currentLang === "en" ? "km" : "en";
      localStorage.setItem("lang", currentLang);
      applyLanguage(currentLang);
    });
  }
};

/* ===============================
   2. Typewriter Effect (Multi-Language)
=============================== */
const initTypewriter = () => {
  const textElement = document.getElementById('typewriter');
  if (!textElement) return;
  const phrases = {
    en: ["a Web Developer.", "a Designer.", "a YouTuber.", "a Vlogger."],
    km: ["អ្នកអភិវឌ្ឍន៍វេបសាយ", "អ្នករចនា", "អ្នកផលិតវីដេអូយូធូប", "អ្នកថតវីដេអូ"]
  };

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingLang = localStorage.getItem("lang") || "en";

  const type = () => {
    const currentLang = localStorage.getItem("lang") || "en";
    if (currentLang !== typingLang) {
      typingLang = currentLang;
      phraseIndex = 0;
      charIndex = 0;
      isDeleting = false;
    }

    const currentPhrase = phrases[typingLang][phraseIndex];

    let speed = isDeleting ? 50 : 100 + Math.random() * 50;

    textElement.textContent = currentPhrase.substring(0, charIndex);

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    if (!isDeleting && charIndex === currentPhrase.length + 1) {
      speed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases[typingLang].length;
      speed = 500;
    }

    setTimeout(type, speed);
  };

  type();
};

/* ===============================
   3. Portfolio Filter + See More
=============================== */
const initPortfolio = () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const seeMoreBtn = document.getElementById('see-more-btn');
  const initialCount = 3;
  let currentFilter = 'all';
  let showingAll = false;

  const updateGallery = () => {
    let visibleCount = 0;
    const currentLang = localStorage.getItem("lang") || "en";

    portfolioItems.forEach(item => {
      const isMatch = currentFilter === 'all' || item.dataset.category === currentFilter;

      if (isMatch) {
        if (showingAll || visibleCount < initialCount) {
          item.style.display = 'block';
          item.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
          item.style.display = 'none';
        }
        visibleCount++;
      } else {
        item.style.display = 'none';
      }
    });

    if (seeMoreBtn) {
      seeMoreBtn.style.display = (currentFilter === 'all' && visibleCount > initialCount) ? 'inline-block' : 'none';

      if (showingAll) {
        seeMoreBtn.innerHTML = currentLang === 'en' ?
          'See Less <i class="fas fa-arrow-up ms-2"></i>' :
          'បង្ហាញតិច <i class="fas fa-arrow-up ms-2"></i>';
      } else {
        seeMoreBtn.innerHTML = currentLang === 'en' ?
          'See More Projects <i class="fas fa-arrow-down ms-2"></i>' :
          'មើលគម្រោងបន្ថែមទៀត <i class="fas fa-arrow-down ms-2"></i>';
      }
    }
  };

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active', 'btn-primary'));
      filterButtons.forEach(b => b.classList.add('btn-outline-primary'));
      btn.classList.add('active', 'btn-primary');
      btn.classList.remove('btn-outline-primary');

      currentFilter = btn.getAttribute('data-filter');
      showingAll = false;
      updateGallery();
    });
  });

  if (seeMoreBtn) {
    seeMoreBtn.addEventListener('click', () => {
      showingAll = !showingAll;
      updateGallery();
    });
  }

  window.addEventListener('languageChanged', updateGallery);
  updateGallery();
};

/* ===============================
   4. Dark Mode Toggle
=============================== */
const initDarkMode = () => {
  const themeBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  if (!themeBtn) return;

  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    if (themeIcon) {
      themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    localStorage.setItem('theme', theme);
  };

  themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
  });

  setTheme(localStorage.getItem('theme') || 'light');
};

/* ===============================
   5. Scroll Effects & Active Nav
=============================== */
const initScrollEffects = () => {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('section').forEach(section => {
    section.classList.add('reveal-hidden');
    revealObserver.observe(section);
  });

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 120) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(currentSection)) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
};

/* ===============================
   6. UI Components (Back to Top / Contact)
=============================== */
const initUIComponents = () => {
  const backBtn = document.getElementById('back-to-top');
  if (backBtn) {
    window.addEventListener('scroll', () => {
      backBtn.style.display = window.scrollY > 400 ? 'flex' : 'none';
    }, { passive: true });

    backBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault(); // Stop page refresh

      const currentLang = localStorage.getItem("lang") || "en";
      const btn = this.querySelector('button[type="submit"]');

      // 1. UI Loading State
      const loadingText = currentLang === 'en' ? 'Sending...' : 'កំពុងបញ្ជូន...';
      const originalBtnHTML = btn.innerHTML;

      btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>${loadingText}`;
      btn.classList.add('disabled');
    });
  }
};

/* ===============================
   7. Initialize All Functions
=============================== */
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initLanguageToggle();
  initTypewriter();
  initPortfolio();
  initScrollEffects();
  initUIComponents();
});