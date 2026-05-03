(function () {
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.innerHTML =
    '<button type="button" class="lightbox-close" aria-label="Close">&times;</button>' +
    '<img alt="" />';
  document.body.appendChild(overlay);

  const overlayImg = overlay.querySelector('img');

  function open(src, alt) {
    overlayImg.src = src;
    overlayImg.alt = alt || '';
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('active');
    overlayImg.src = '';
    document.body.style.overflow = '';
  }

  document.addEventListener('click', function (e) {
    const zoomable = e.target.closest('[data-zoomable]');
    if (zoomable) {
      e.preventDefault();
      open(zoomable.src, zoomable.alt);
      return;
    }
    if (e.target === overlay || e.target.classList.contains('lightbox-close')) {
      close();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('active')) close();
  });
})();
