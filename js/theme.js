// Theme toggle button
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Load saved theme from localStorage
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
  }
});

// Toggle theme and save preference
themeToggle?.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  const isDark = body.classList.contains('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});