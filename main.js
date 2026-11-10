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


/* ==========================================================
   Gemstone motion
   - 最初の1回だけ出るローダー
   - スクロールで現れる動き / ヒーローの登場
   ========================================================== */
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  const body = document.body;

  const heroVisual = document.querySelector('.hero-visual');

  /* ---------- ローダー（同じタブでは最初の1回だけ） ---------- */
  let seen = false;
  try {
    seen = sessionStorage.getItem('chiwa-loaded') === '1';
    sessionStorage.setItem('chiwa-loaded', '1');
  } catch (e) { /* 保存できない環境では毎回表示 */ }

  const enterHero = () => requestAnimationFrame(() => body.classList.add('hero-in'));

  if (!reducedMotion) {
    body.classList.add('motion-ready');
    if (seen) {
      enterHero();
    } else {
      const loader = document.createElement('div');
      loader.className = 'site-loader';
      loader.setAttribute('role', 'status');
      loader.setAttribute('aria-label', 'ページを読み込んでいます');
      loader.innerHTML = '<div class="site-loader__inner"><p class="site-loader__label">CHIWA</p><span class="site-loader__track" aria-hidden="true"></span></div>';
      body.prepend(loader);
      body.classList.add('is-loading');

      let scheduled = false;
      const startedAt = performance.now();
      const finish = () => {
        if (scheduled) return;
        scheduled = true;
        const remaining = Math.max(0, 1100 - (performance.now() - startedAt));
        window.setTimeout(() => {
          loader.classList.add('is-leaving');
          body.classList.remove('is-loading');
          enterHero();
          window.setTimeout(() => loader.remove(), 760);
        }, remaining);
      };
      window.addEventListener('load', finish, { once: true });
      if (document.readyState === 'complete') finish();
      window.setTimeout(finish, 4000);
    }
  }

  if (reducedMotion) return;

  // スクロール：ヘッダーの線を伸ばす
  const onScroll = () => {
    const max = root.scrollHeight - window.innerHeight;
    root.style.setProperty('--scroll', max > 0 ? Math.min(1, window.scrollY / max).toFixed(4) : '0');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ポインター：ヒーロー写真のわずかな傾き
  if (heroVisual && window.matchMedia('(hover: hover)').matches) {
    window.addEventListener('pointermove', (e) => {
      heroVisual.style.setProperty('--tx', ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3));
      heroVisual.style.setProperty('--ty', ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3));
    }, { passive: true });
  }

  // スクロールで現れる
  if (!('IntersectionObserver' in window)) return;
  const revealTargets = [
    '.page-hero .container', '.section-intro', '.section-heading', '.work-item',
    '.home-note__inner', '.about-row', '.skill-section', '.service-card',
    '.flow-step', '.contact-panel'
  ].flatMap((selector) => [...document.querySelectorAll(selector)]);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });
  revealTargets.forEach((element, index) => {
    element.dataset.reveal = '';
    element.style.setProperty('--reveal-delay', `${(index % 3) * 85}ms`);
    observer.observe(element);
  });
})();
