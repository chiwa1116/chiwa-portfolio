const body = document.body;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


/* メニュー開閉 */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

function toggleMenu(open) {
  hamburger.classList.toggle('is-open', open);
  mobileNav.classList.toggle('is-open', open);
  hamburger.setAttribute('aria-expanded', String(open));
  body.style.overflow = open ? 'hidden' : '';
}

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    toggleMenu(!hamburger.classList.contains('is-open'));
  });

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => toggleMenu(false));
  });
}


/* 制作実績：千輪のサムネイルを押すと3つのサイトがひらく */
const trioButton = document.querySelector('.work-thumb--trio');
const trioSites = document.getElementById('senrin-sites');

function toggleTrio(open) {
  trioSites.classList.toggle('is-open', open);
  trioButton.setAttribute('aria-expanded', String(open));
}

if (trioButton && trioSites) {
  // 各サイトの「制作実績へ」から戻ってきたときは、ひらいたままにする
  toggleTrio(location.hash === '#senrin-concepts');

  trioButton.addEventListener('click', () => {
    const open = !trioSites.classList.contains('is-open');
    toggleTrio(open);

    if (open) {
      setTimeout(() => {
        trioSites.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 450);
    }
  });
}


/* ヘッダーの線をスクロール量に合わせる */
function updateScrollLine() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const rate = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
  document.documentElement.style.setProperty('--scroll', rate.toFixed(4));
}

window.addEventListener('scroll', updateScrollLine, { passive: true });
updateScrollLine();


/* ローディング（同じタブでは最初の1回だけ） */
const LOADER_MIN_TIME = 1100;
const LOADER_MAX_TIME = 4000;

function alreadyVisited() {
  try {
    const visited = sessionStorage.getItem('chiwa-loaded') === '1';
    sessionStorage.setItem('chiwa-loaded', '1');
    return visited;
  } catch (error) {
    return false;
  }
}

function showHero() {
  requestAnimationFrame(() => body.classList.add('hero-in'));
}

function showLoader() {
  const loader = document.createElement('div');
  loader.className = 'site-loader';
  loader.setAttribute('role', 'status');
  loader.setAttribute('aria-label', 'ページを読み込んでいます');
  loader.innerHTML = `
    <div class="site-loader__inner">
      <p class="site-loader__label">CHIWA</p>
      <span class="site-loader__track" aria-hidden="true"></span>
    </div>`;
  body.prepend(loader);
  body.classList.add('is-loading');

  const startedAt = performance.now();
  let closing = false;

  const close = () => {
    if (closing) return;
    closing = true;

    const wait = Math.max(0, LOADER_MIN_TIME - (performance.now() - startedAt));
    setTimeout(() => {
      loader.classList.add('is-leaving');
      body.classList.remove('is-loading');
      showHero();
      setTimeout(() => loader.remove(), 760);
    }, wait);
  };

  if (document.readyState === 'complete') {
    close();
  } else {
    window.addEventListener('load', close, { once: true });
    setTimeout(close, LOADER_MAX_TIME);
  }
}


/* スクロールで現れる */
const REVEAL_TARGETS = [
  '.page-hero .container',
  '.section-intro',
  '.section-heading',
  '.work-item',
  '.home-note__inner',
  '.about-row',
  '.skill-section',
  '.service-card',
  '.flow-step',
  '.contact-panel'
];

function setupReveal() {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });

  document.querySelectorAll(REVEAL_TARGETS.join(',')).forEach((element, index) => {
    element.dataset.reveal = '';
    element.style.setProperty('--reveal-delay', `${(index % 3) * 85}ms`);
    observer.observe(element);
  });
}


if (!reducedMotion) {
  body.classList.add('motion-ready');
  setupReveal();

  if (alreadyVisited()) {
    showHero();
  } else {
    showLoader();
  }
}
