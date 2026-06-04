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

const priceSets = [
  {
    gold: 'AUD 6,235.69/oz',
    silver: 'AUD 104.79/oz',
    platinum: 'AUD 2,756.86/oz',
    fx: '0.7159',
  },
  {
    gold: 'AUD 6,241.18/oz',
    silver: 'AUD 105.14/oz',
    platinum: 'AUD 2,762.40/oz',
    fx: '0.7164',
  },
  {
    gold: 'AUD 6,228.93/oz',
    silver: 'AUD 104.52/oz',
    platinum: 'AUD 2,748.75/oz',
    fx: '0.7148',
  },
  {
    gold: 'AUD 6,247.06/oz',
    silver: 'AUD 105.31/oz',
    platinum: 'AUD 2,770.12/oz',
    fx: '0.7171',
  },
];

const priceLabelMap = {
  Gold: 'gold',
  Silver: 'silver',
  Platinum: 'platinum',
  'FX AUD/USD': 'fx',
};

const priceNodes = Array.from(document.querySelectorAll('.metal-quote')).map((quote) => {
  const label = quote.querySelector('span')?.textContent?.trim();
  return {
    key: priceLabelMap[label],
    value: quote.querySelector('strong'),
  };
}).filter((quote) => quote.key && quote.value);

if (priceNodes.length) {
  let priceIndex = 0;
  const refreshLabel = document.querySelector('.price-refresh');
  if (refreshLabel) {
    const dot = refreshLabel.querySelector('.live-dot');
    refreshLabel.textContent = 'Price refresh 5 sec';
    if (dot) refreshLabel.prepend(dot);
  }

  window.setInterval(() => {
    priceIndex = (priceIndex + 1) % priceSets.length;
    const nextPrices = priceSets[priceIndex];
    priceNodes.forEach(({ key, value }) => {
      value.classList.add('price-changing');
      window.setTimeout(() => {
        value.textContent = nextPrices[key];
        value.classList.remove('price-changing');
      }, 180);
    });
  }, 5000);
}

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
