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
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.getAttribute('data-i18n');
    if (translations[key]) {
      element.innerHTML = translations[key];
    }
  });

  // Also update page <title> separately if needed
  if (translations['site_title']) {
    document.title = translations['site_title'];
  }
}