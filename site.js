const menuButton = document.querySelector('.mobile-menu-button');
const mobileMenu = document.querySelector('#mobile-menu');
const closeButton = document.querySelector('.mobile-menu-close');
function setMenu(open) {
  if (!mobileMenu || !menuButton) return;
  mobileMenu.classList.toggle('open', open);
  mobileMenu.setAttribute('aria-hidden', String(!open));
  menuButton.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
}
menuButton?.addEventListener('click', () => setMenu(true));
closeButton?.addEventListener('click', () => setMenu(false));
mobileMenu?.addEventListener('click', (event) => {
  if (event.target.matches('a')) setMenu(false);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false);
});

if (!document.querySelector('.home-page')) {
  const newsletterPopup = document.createElement('aside');
  newsletterPopup.className = 'newsletter-popup';
  newsletterPopup.setAttribute('aria-label', 'Newsletter signup');
  newsletterPopup.innerHTML = `
    <button class="newsletter-popup-close" type="button" aria-label="Close newsletter signup">Close</button>
    <span class="kicker">Newsletter Signup</span>
    <h2>Join the Iconic List</h2>
    <p>Be the first to receive updates on new jewellery collections, bullion availability, and exclusive releases.</p>
    <form class="newsletter-popup-form">
      <input type="email" placeholder="Email address" aria-label="Email address">
      <button class="btn btn-gold" type="submit">Subscribe</button>
    </form>
    <small>You can unsubscribe at any time.</small>
  `;
  document.body.appendChild(newsletterPopup);

  function closeNewsletterPopup() {
    newsletterPopup.classList.add('dismissed');
  }

  window.setTimeout(() => {
    newsletterPopup.classList.add('visible');
  }, 900);

  newsletterPopup.querySelector('.newsletter-popup-close')?.addEventListener('click', closeNewsletterPopup);
  newsletterPopup.querySelector('.newsletter-popup-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    closeNewsletterPopup();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeNewsletterPopup();
  });
}
