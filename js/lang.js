const languageSwitcher = document.getElementById('lang-switcher');
const defaultLanguage = 'en';

function getInitialLanguage() {
  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage && languageSwitcher?.querySelector(`option[value="${savedLanguage}"]`)) {
    return savedLanguage;
  }

  const browserLanguage = (navigator.language || defaultLanguage).slice(0, 2);
  if (languageSwitcher?.querySelector(`option[value="${browserLanguage}"]`)) {
    return browserLanguage;
  }

  return defaultLanguage;
}

languageSwitcher?.addEventListener('change', function () {
  loadLanguage(this.value);
});

document.addEventListener('DOMContentLoaded', function () {
  loadLanguage(getInitialLanguage());
});

function loadLanguage(lang) {
  if (window.PORTFOLIO_TRANSLATIONS?.[lang]) {
    applyLanguage(lang, window.PORTFOLIO_TRANSLATIONS[lang]);
    return;
  }

  fetch(`lang/${lang}.json`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Language file not found.');
      }
      return response.json();
    })
    .then((translations) => {
      applyLanguage(lang, translations);
    })
    .catch((error) => {
      console.error('Error loading language:', error);
      if (lang !== defaultLanguage) loadLanguage(defaultLanguage);
    });
}

function applyLanguage(lang, translations) {
  applyTranslations(translations);
  document.documentElement.lang = lang;
  if (languageSwitcher) languageSwitcher.value = lang;
  localStorage.setItem('language', lang);
}

function applyTranslations(translations) {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (Object.prototype.hasOwnProperty.call(translations, key)) {
      el.textContent = translations[key];
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (Object.prototype.hasOwnProperty.call(translations, key)) {
      el.placeholder = translations[key];
    }
  });

  if (translations.site_title) {
    document.title = translations.site_title;
  }
}
