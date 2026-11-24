(() => {
  'use strict';
  const config = window.KLESHOVPROD || {};
  const films = {
    wedding: { title: 'Кирилл и Татьяна', url: config.weddingVideo || '' },
    anniversary: { title: 'Кузнецовы — 20 лет вместе', url: config.anniversaryVideo || '' }
  };
  const modal = document.getElementById('film-modal');
  const player = document.getElementById('player-container');
  const title = document.getElementById('modal-title');
  const externalLink = document.getElementById('modal-external-link');
  let previousFocus = null;
  const kineRegex = /^https:\/\/(?:www\.)?kinescope\.io\/[A-Za-z0-9_-]+(?:\?.*)?$/;

  function showFilm(id) {
    const film = films[id];
    if (!film) return;
    if (!kineRegex.test(film.url)) {
      window.alert('Публичная ссылка на этот фильм ещё не добавлена. Она появится здесь перед публикацией сайта.');
      return;
    }
    previousFocus = document.activeElement;
    const idPart = new URL(film.url).pathname.replace(/^\//, '');
    title.textContent = film.title;
    externalLink.href = film.url;
    player.replaceChildren();
    const iframe = document.createElement('iframe');
    iframe.src = 'https://kinescope.io/embed/' + encodeURIComponent(idPart) + '?autoplay=1';
    iframe.title = 'Kinescope — ' + film.title;
    iframe.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
    iframe.allowFullscreen = true;
    iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    player.appendChild(iframe);
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    modal.querySelector('.modal-close').focus();
  }
  function hideFilm() {
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    player.replaceChildren(); // stop audio/video playback
    document.body.classList.remove('modal-open');
    previousFocus?.focus();
  }
  document.querySelectorAll('[data-open-film]').forEach(btn => {
    btn.addEventListener('click', () => showFilm(btn.dataset.openFilm));
  });
  document.querySelectorAll('[data-close-film]').forEach(btn => btn.addEventListener('click', hideFilm));
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hidden) hideFilm();
    if (e.key === 'Tab' && !modal.hidden) {
      const controls = [...modal.querySelectorAll('button, a[href]')].filter(el => !el.hidden);
      if (!controls.length) return;
      const first = controls[0], last = controls[controls.length-1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  const telegramLink = document.getElementById('telegram-link');
  const emailLink = document.getElementById('email-link');
  const pending = document.getElementById('contact-pending');
  let hasContact = false;
  if (/^https:\/\/t\.me\/[A-Za-z0-9_]+\/?$/.test(config.telegram || '')) {
    telegramLink.href = config.telegram; telegramLink.hidden = false; hasContact = true;
  }
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email || '')) {
    emailLink.href = 'mailto:' + config.email; emailLink.hidden = false; hasContact = true;
  }
  pending.hidden = hasContact;
})();
