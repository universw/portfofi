// Theme: persists user choice, defaults to system preference, single source of truth for icon.
(function () {
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  const STORAGE_KEY = 'theme';

  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function getInitialTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return systemPrefersDark() ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    body.classList.toggle('dark-mode', theme === 'dark');
    updateThemeIcon();
  }

  function updateThemeIcon() {
    if (!themeToggle) return;
    const isDark = body.classList.contains('dark-mode');
    themeToggle.innerHTML = `<span aria-hidden="true">${isDark ? '☀' : '◐'}</span>`;
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.title = isDark ? 'Switch to light theme' : 'Switch to dark theme';
  }

  // Initial apply (before paint to avoid flash)
  applyTheme(getInitialTheme());

  themeToggle?.addEventListener('click', () => {
    const next = body.classList.contains('dark-mode') ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  });

  // React to system theme changes if user hasn't explicitly chosen
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) applyTheme(e.matches ? 'dark' : 'light');
    });
  }
})();
