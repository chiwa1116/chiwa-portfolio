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
