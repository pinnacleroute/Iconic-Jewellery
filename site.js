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

const catalogueProducts = [
  {
    category: 'rings',
    type: 'jewellery',
    name: 'Solitaire Revival',
    detail: '18k rose gold, natural diamond',
    price: 'AUD 4,650',
    tag: 'New',
    href: 'jewellery-product/',
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=88',
  },
  {
    category: 'rings',
    type: 'jewellery',
    name: 'Celeste Halo Ring',
    detail: 'White gold, certified diamonds',
    price: 'AUD 7,200',
    href: 'jewellery-product/',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=88',
  },
  {
    category: 'rings',
    type: 'jewellery',
    name: 'Golden Trio',
    detail: 'Yellow gold, diamond detail',
    price: 'AUD 3,950',
    tag: 'Edit',
    href: 'jewellery-product/',
    image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=900&q=88',
  },
  {
    category: 'necklaces',
    type: 'jewellery',
    name: 'Celeste Diamond Necklace',
    detail: 'White gold chain with certified diamonds',
    price: 'AUD 7,200',
    tag: 'New',
    href: 'jewellery-product/',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=88',
  },
  {
    category: 'necklaces',
    type: 'jewellery',
    name: 'Pearl Line Collar',
    detail: 'Freshwater pearls with gold clasp',
    price: 'AUD 2,840',
    href: 'jewellery-product/',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=88',
  },
  {
    category: 'necklaces',
    type: 'jewellery',
    name: 'Sapphire Drop Pendant',
    detail: 'Blue sapphire, diamond-set bail',
    price: 'AUD 5,180',
    href: 'jewellery-product/',
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=88',
  },
  {
    category: 'bracelets',
    type: 'jewellery',
    name: 'Royal Halo Bracelet',
    detail: 'Polished gold bracelet with halo detailing',
    price: 'AUD 4,950',
    tag: 'Edit',
    href: 'jewellery-product/',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=88',
  },
  {
    category: 'bracelets',
    type: 'jewellery',
    name: 'Diamond Tennis Bracelet',
    detail: 'Graduated diamonds in white gold',
    price: 'AUD 9,600',
    href: 'jewellery-product/',
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=88',
  },
  {
    category: 'bracelets',
    type: 'jewellery',
    name: 'Sculpted Gold Cuff',
    detail: 'High-polish 18k yellow gold',
    price: 'AUD 6,300',
    href: 'jewellery-product/',
    image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=900&q=88',
  },
  {
    category: 'earrings',
    type: 'jewellery',
    name: 'Classic Pearl Earrings',
    detail: 'Freshwater pearls with 18k gold settings',
    price: 'AUD 1,480',
    tag: 'Gift',
    href: 'jewellery-product/',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=900&q=88',
  },
  {
    category: 'earrings',
    type: 'jewellery',
    name: 'Diamond Huggie Hoops',
    detail: 'Pavé diamonds in white gold',
    price: 'AUD 2,650',
    href: 'jewellery-product/',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=88',
  },
  {
    category: 'earrings',
    type: 'jewellery',
    name: 'Emerald Drop Earrings',
    detail: 'Emerald drops with diamond accents',
    price: 'AUD 4,180',
    href: 'jewellery-product/',
    image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=88',
  },
  {
    category: 'sets',
    type: 'jewellery',
    name: 'Iconic Gold Set',
    detail: '22k necklace, bracelet, and earrings',
    price: 'AUD 14,900',
    tag: 'Set',
    href: 'jewellery-product/',
    image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1200&q=88',
  },
  {
    category: 'sets',
    type: 'jewellery',
    name: 'Pearl Ceremony Set',
    detail: 'Pearl necklace and matching earrings',
    price: 'AUD 5,950',
    href: 'jewellery-product/',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=88',
  },
  {
    category: 'bullion',
    type: 'bullion',
    name: '1g Gold Bullion Bar',
    detail: '99.99% purity, verified serial',
    price: 'AUD 200.50',
    tag: 'Live',
    href: 'bullion-product/',
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=900&q=88',
    weight: '1g',
  },
  {
    category: 'bullion',
    type: 'bullion',
    name: '5g Gold Bullion Bar',
    detail: '99.99% purity, sealed assay card',
    price: 'AUD 1,002.50',
    href: 'bullion-product/',
    image: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&w=900&q=88',
    weight: '5g',
  },
  {
    category: 'bullion',
    type: 'bullion',
    name: '10g Gold Bullion Bar',
    detail: 'Investment-grade gold bullion',
    price: 'AUD 2,005.00',
    href: 'bullion-product/',
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=900&q=88',
    weight: '10g',
  },
  {
    category: 'bullion',
    type: 'bullion',
    name: '1oz Gold Bullion Bar',
    detail: '31.1g, 99.99% purity',
    price: 'AUD 6,235.69',
    href: 'bullion-product/',
    image: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&w=900&q=88',
    weight: '31.1g',
  },
];

function pageHref(path) {
  return document.querySelector('.brand')?.getAttribute('href') === '../' ? `../${path}` : path;
}

function renderHomeProducts(category = 'rings') {
  const grid = document.querySelector('[data-home-product-grid]');
  if (!grid) return;
  const products = catalogueProducts.filter((product) => product.category === category).slice(0, 3);
  grid.innerHTML = products.map((product) => `
    <a class="luxe-product-card reveal visible" href="${pageHref(product.href)}">
      ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ''}
      <span class="luxe-product-image" style="background-image: url('${product.image}')"></span>
      <strong>${product.name}</strong>
      <small>${product.detail}</small>
      <em>${product.price}</em>
    </a>
  `).join('');
}

function renderCollectionProducts(category = 'all') {
  const grid = document.querySelector('[data-collection-grid]');
  if (!grid) return;
  const type = grid.dataset.collectionType;
  const products = catalogueProducts.filter((product) => {
    if (type === 'bullion') return product.type === 'bullion';
    return product.type === 'jewellery' && (category === 'all' || product.category === category);
  });

  if (type === 'bullion') {
    grid.innerHTML = products.map((product) => `
      <article class="bullion-product-card reveal visible">
        <div class="bullion-product-image" style="background-image: url('${product.image}')"></div>
        <div class="bullion-product-info">
          <span class="status-pill">Verification Required</span>
          <h3>${product.name}</h3>
          <dl>
            <div><dt>Weight</dt><dd>${product.weight}</dd></div>
            <div><dt>Purity</dt><dd>99.99%</dd></div>
          </dl>
          <strong>${product.price}</strong>
          <a class="btn btn-primary btn-small" href="${pageHref(product.href)}">View Details</a>
        </div>
      </article>
    `).join('');
    return;
  }

  grid.innerHTML = products.map((product) => `
    <article class="catalogue-card reveal visible">
      <div class="catalogue-image" style="background-image: url('${product.image}')">
        <button class="wishlist-button" type="button" aria-label="Add ${product.name} to wishlist">♡</button>
      </div>
      <div class="catalogue-info">
        <h2>${product.name}</h2>
        <p>${product.detail}</p>
        <div class="catalogue-footer">
          <strong>${product.price}</strong>
          <a class="btn btn-primary btn-small" href="${pageHref(product.href)}">View Details</a>
        </div>
      </div>
    </article>
  `).join('');
}

const homeCategoryButtons = Array.from(document.querySelectorAll('[data-home-category]'));
if (homeCategoryButtons.length) {
  homeCategoryButtons.forEach((button) => {
    button.addEventListener('click', () => {
      homeCategoryButtons.forEach((tab) => tab.classList.toggle('active', tab === button));
      renderHomeProducts(button.dataset.homeCategory);
    });
  });
  renderHomeProducts(homeCategoryButtons.find((button) => button.classList.contains('active'))?.dataset.homeCategory);
}

const collectionButtons = Array.from(document.querySelectorAll('[data-collection-category]'));
if (document.querySelector('[data-collection-grid]')) {
  if (collectionButtons.length) {
    collectionButtons.forEach((button) => {
      button.addEventListener('click', () => {
        collectionButtons.forEach((chip) => chip.classList.toggle('active', chip === button));
        renderCollectionProducts(button.dataset.collectionCategory);
      });
    });
    renderCollectionProducts(collectionButtons.find((button) => button.classList.contains('active'))?.dataset.collectionCategory);
  } else {
    renderCollectionProducts();
  }
}

const canShowNewsletterPopup = !document.querySelector('.home-page') && window.matchMedia('(min-width: 1081px)').matches;
if (canShowNewsletterPopup) {
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
  }, 6000);

  newsletterPopup.querySelector('.newsletter-popup-close')?.addEventListener('click', closeNewsletterPopup);
  newsletterPopup.querySelector('.newsletter-popup-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    closeNewsletterPopup();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeNewsletterPopup();
  });
}
