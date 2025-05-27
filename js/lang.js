document.getElementById('lang-switcher').addEventListener('change', function () {
  const lang = this.value;
  loadLanguage(lang);
});

function loadLanguage(lang) {
  fetch(`lang/${lang}.json`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Language file not found.');
      }
      return response.json();
    })
    .then((translations) => {
      applyTranslations(translations);
    })
    .catch((error) => {
      console.error('Error loading language:', error);
    });
}

function applyTranslations(translations) {
  // Text content translation
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (translations[key]) {
      el.innerHTML = translations[key];
    }
  });

  // Placeholder translation
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[key]) {
      el.placeholder = translations[key];
    }
  });

  // Page title
  if (translations['site_title']) {
    document.title = translations['site_title'];
  }
}