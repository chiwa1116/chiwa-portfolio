/* メニュー開閉 */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('is-open');
    mobileNav.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('is-open');
      mobileNav.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* フォーム用。現状のContactページはメールリンクなので、この関数は呼ばれていません。
   これを使う場合も、下記は画面表示だけで実際のメール送信は行いません。 */
function handleSubmit(e) {
  e.preventDefault();
  const button = e.target.querySelector('.submit-btn');
  if (!button) return;

  button.textContent = '✓ 送信が完了しました';
  button.style.background = '#555';
  button.disabled = true;

  window.setTimeout(() => {
    button.textContent = '送信する';
    button.style.background = '';
    button.disabled = false;
    e.target.reset();
  }, 3500);
}


/* Gemstone loader and calm scroll reveals */
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealTargets = [
    '.page-hero .container', '.hero-copy-block', '.hero-visual',
    '.section-intro', '.section-heading', '.work-item', '.home-note__inner',
    '.about-row', '.skill-section', '.service-card', '.restaurant-card',
    '.flow-step', '.contact-panel'
  ].flatMap((selector) => [...document.querySelectorAll(selector)]);

  if (!reducedMotion) {
    const loader = document.createElement('div');
    loader.className = 'site-loader';
    loader.setAttribute('role', 'status');
    loader.setAttribute('aria-label', 'ページを読み込んでいます');
    loader.innerHTML = `
      <div class="site-loader__inner">
        <svg class="site-loader__crystal" viewBox="0 0 80 80" aria-hidden="true">
          <polygon points="40,3 69,20 63,59 40,77 17,59 11,20" fill="#f4f4ef"/>
          <polygon points="40,3 40,31 11,20" fill="#d8d8d1"/>
          <polygon points="40,3 69,20 40,31" fill="#fff"/>
          <polygon points="11,20 40,31 17,59" fill="#aaa9a2"/>
          <polygon points="69,20 40,31 63,59" fill="#d1d0c9"/>
          <polygon points="17,59 40,31 40,77" fill="#e6e5df"/>
          <polygon points="63,59 40,31 40,77" fill="#bdbcb5"/>
          <path d="M11 20h58M17 59h46" stroke="#77766f" stroke-width="1" fill="none"/>
          <path d="M40 3v74M11 20l29 11 29-11M17 59l23-28 23 28" stroke="#8f8e87" stroke-width=".8" fill="none" opacity=".7"/>
        </svg>
        <p class="site-loader__label">CHIWA</p>
        <p class="site-loader__caption">VISUAL DESIGN &amp; ILLUSTRATION</p>
        <span class="site-loader__track" aria-hidden="true"></span>
      </div>`;
    document.body.prepend(loader);
    document.body.classList.add('is-loading');

    let completed = false;
    let scheduled = false;
    const startedAt = performance.now();
    const finish = () => {
      if (scheduled) return;
      scheduled = true;
      const remaining = Math.max(0, 760 - (performance.now() - startedAt));
      window.setTimeout(() => {
        if (completed) return;
        completed = true;
        loader.classList.add('is-leaving');
        document.body.classList.remove('is-loading');
        window.setTimeout(() => loader.remove(), 720);
      }, remaining);
    };
    window.addEventListener('load', finish, { once: true });
    if (document.readyState === 'complete') finish();
    window.setTimeout(finish, 4500);
  }

  if (reducedMotion || !('IntersectionObserver' in window)) return;
  document.body.classList.add('motion-ready');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });

  revealTargets.forEach((element, index) => {
    element.dataset.reveal = element.matches('.hero-copy-block') ? 'from-left' : '';
    element.style.setProperty('--reveal-delay', `${(index % 3) * 85}ms`);
    observer.observe(element);
  });
})();
