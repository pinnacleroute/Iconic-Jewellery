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

const submenuItems = Array.from(document.querySelectorAll('.has-submenu'));
submenuItems.forEach((item) => {
  const trigger = item.querySelector(':scope > a');
  let closeTimer;

  function openSubmenu() {
    window.clearTimeout(closeTimer);
    item.classList.remove('submenu-dismissed');
    submenuItems.forEach((otherItem) => {
      if (otherItem === item) return;
      otherItem.classList.remove('submenu-open');
      otherItem.classList.remove('submenu-dismissed');
      otherItem.querySelector(':scope > a')?.setAttribute('aria-expanded', 'false');
    });
    item.classList.add('submenu-open');
    trigger?.setAttribute('aria-expanded', 'true');
  }

  function scheduleSubmenuClose() {
    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(() => {
      item.classList.remove('submenu-open');
      trigger?.setAttribute('aria-expanded', 'false');
    }, 350);
  }

  item.addEventListener('pointerenter', openSubmenu);
  item.addEventListener('pointerleave', scheduleSubmenuClose);
  item.addEventListener('focusin', openSubmenu);
  item.addEventListener('focusout', (event) => {
    if (!item.contains(event.relatedTarget)) scheduleSubmenuClose();
  });
  trigger?.addEventListener('click', (event) => {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (!item.classList.contains('submenu-open')) {
      event.preventDefault();
      openSubmenu();
    }
  });
});

document.addEventListener('pointerdown', (event) => {
  submenuItems.forEach((item) => {
    if (item.contains(event.target)) return;
    item.classList.remove('submenu-open');
    item.classList.remove('submenu-dismissed');
    item.querySelector(':scope > a')?.setAttribute('aria-expanded', 'false');
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  submenuItems.forEach((item) => {
    item.classList.remove('submenu-open');
    if (item.contains(document.activeElement)) item.classList.add('submenu-dismissed');
    item.querySelector(':scope > a')?.setAttribute('aria-expanded', 'false');
  });
});

let toastTimer;
function showToast(message, tone = 'success') {
  let toast = document.querySelector('.site-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'site-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.dataset.tone = tone;
  toast.classList.add('visible');
  toastTimer = window.setTimeout(() => toast.classList.remove('visible'), 3200);
}

document.addEventListener('click', (event) => {
  const galleryThumb = event.target.closest('.gallery-thumb');
  if (galleryThumb) {
    const gallery = galleryThumb.closest('.product-gallery');
    const mainImage = gallery?.querySelector('.gallery-main');
    if (!mainImage) return;
    const imageClass = Array.from(galleryThumb.classList).find((className) => className.startsWith('gallery-emerald-'));
    gallery.querySelectorAll('.gallery-thumb').forEach((thumb) => thumb.classList.toggle('active', thumb === galleryThumb));
    Array.from(mainImage.classList).filter((className) => className.startsWith('gallery-emerald-')).forEach((className) => mainImage.classList.remove(className));
    if (imageClass) mainImage.classList.add(imageClass);
    return;
  }

  const sizeButton = event.target.closest('.size-selector button');
  if (sizeButton) {
    sizeButton.closest('.size-selector').querySelectorAll('button').forEach((button) => {
      button.classList.toggle('active', button === sizeButton);
      button.setAttribute('aria-pressed', String(button === sizeButton));
    });
    showToast(`Size ${sizeButton.textContent.trim()} selected.`);
    return;
  }

  const wishlistButton = event.target.closest('.wishlist-button');
  if (wishlistButton) {
    const selected = wishlistButton.getAttribute('aria-pressed') !== 'true';
    wishlistButton.setAttribute('aria-pressed', String(selected));
    wishlistButton.classList.toggle('selected', selected);
    wishlistButton.textContent = selected ? '♥' : '♡';
    showToast(selected ? 'Added to your wishlist.' : 'Removed from your wishlist.');
    return;
  }

  const uploadButton = event.target.closest('.document-field .btn');
  if (uploadButton) {
    uploadButton.closest('.document-field')?.querySelector('input[type="file"]')?.click();
    return;
  }

  const actionButton = event.target.closest('button');
  if (!actionButton) return;
  const action = actionButton.textContent.trim();
  const feedback = {
    'Create Account': 'Account details captured for this prototype.',
    Login: 'Login submitted for this prototype.',
    'Save Settings': 'Account settings saved.',
    'Send Enquiry': 'Your enquiry has been captured.',
    'Submit for Review': 'Documents submitted for review.',
    'Place Order / Pay Securely': 'Complete account verification before placing this bullion order.',
  };
  if (feedback[action]) {
    const tone = action === 'Place Order / Pay Securely' ? 'warning' : 'success';
    showToast(feedback[action], tone);
  }
});

document.querySelectorAll('.document-field input[type="file"]').forEach((input) => {
  input.addEventListener('change', () => {
    const button = input.closest('.document-field')?.querySelector('.btn');
    if (!button) return;
    button.textContent = input.files?.length ? 'Document Selected' : 'Upload Document';
    showToast(input.files?.length ? `${input.files[0].name} selected.` : 'No document selected.');
  });
});

document.querySelectorAll('.footer form, .newsletter-form').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = form.querySelector('input[type="email"]');
    if (!email?.value.trim()) {
      email?.focus();
      showToast('Enter an email address to subscribe.', 'warning');
      return;
    }
    showToast('Thank you for joining the Iconic list.');
    form.reset();
  });
});

function updateCartSummary() {
  const rows = Array.from(document.querySelectorAll('.cart-row'));
  const subtotal = rows.reduce((sum, row) => {
    const unitPrice = Number(row.querySelector('strong')?.textContent.replace(/[^\d.]/g, '')) || 0;
    const quantity = Math.max(1, Number(row.querySelector('.cart-quantity')?.value) || 1);
    return sum + (unitPrice * quantity);
  }, 0);
  const delivery = rows.length ? 68 : 0;
  const values = document.querySelectorAll('.cart-summary-panel dd');
  if (values[0]) values[0].textContent = `AUD ${subtotal.toLocaleString('en-AU', { minimumFractionDigits: 2 })}`;
  if (values[1]) values[1].textContent = `AUD ${delivery.toFixed(2)}`;
  if (values[3]) values[3].textContent = `AUD ${(subtotal + delivery).toLocaleString('en-AU', { minimumFractionDigits: 2 })}`;
  const checkoutLink = document.querySelector('.cart-summary-panel .btn');
  if (checkoutLink) {
    checkoutLink.classList.toggle('disabled', rows.length === 0);
    checkoutLink.setAttribute('aria-disabled', String(rows.length === 0));
  }
}

document.querySelector('.cart-table')?.addEventListener('click', (event) => {
  const removeButton = event.target.closest('.remove-button');
  if (!removeButton) return;
  removeButton.closest('.cart-row')?.remove();
  updateCartSummary();
  showToast('Item removed from your cart.');
});
document.querySelector('.cart-table')?.addEventListener('change', (event) => {
  if (!event.target.matches('.cart-quantity')) return;
  event.target.value = Math.max(1, Number(event.target.value) || 1);
  updateCartSummary();
});

const serialForm = document.querySelector('.serial-lookup-form');
serialForm?.querySelector('button')?.addEventListener('click', () => {
  const serialInput = serialForm.querySelector('input');
  const serial = serialInput?.value.trim().toUpperCase();
  if (!serial) {
    serialInput?.focus();
    showToast('Enter a serial number to continue.', 'warning');
    return;
  }
  const valid = serial === 'IJG-10G-28491';
  document.querySelector('.serial-result-card.valid')?.classList.toggle('result-highlight', valid);
  document.querySelector('.serial-result-card.invalid')?.classList.toggle('result-highlight', !valid);
  document.querySelector('.serial-results-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  showToast(valid ? 'Item verified successfully.' : 'Serial number not found.', valid ? 'success' : 'warning');
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

document.querySelector('.sort-control select')?.addEventListener('change', (event) => {
  const grid = document.querySelector('[data-collection-grid]');
  if (!grid) return;
  const cards = Array.from(grid.children);
  const priceFor = (card) => Number(card.querySelector('.catalogue-footer strong, .bullion-product-info > strong')?.textContent.replace(/[^\d.]/g, '')) || 0;
  if (event.target.value === 'Price: Low to High') cards.sort((a, b) => priceFor(a) - priceFor(b));
  if (event.target.value === 'Price: High to Low') cards.sort((a, b) => priceFor(b) - priceFor(a));
  cards.forEach((card) => grid.appendChild(card));
  showToast(`Sorted by ${event.target.value.toLowerCase()}.`);
});

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
