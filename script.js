// script.js - unified, robust handlers for search, sort, wishlist, cart and swipe

// Utility helpers
const qs = s => document.querySelector(s);
const qsa = s => Array.from(document.querySelectorAll(s));
const CART_KEY = 'cart';
const WISHLIST_KEY = 'wishlist';

// Toggle nav menu (mobile)
function toggleMenu() {
  const nav = qs('#navLinks');
  nav.classList.toggle('show');
}

// Filter panel
function toggleFilter() {
  const panel = qs('#filterPanel');
  panel.classList.toggle('open');
  panel.setAttribute('aria-hidden', !panel.classList.contains('open'));
}

// Cart panel
function toggleCart() {
  const panel = qs('#cartPanel');
  panel.classList.toggle('open');
  panel.setAttribute('aria-hidden', !panel.classList.contains('open'));
  updateCartUI();
}

// --- Search ---
function performSearch() {
  const input = (qs('#searchInput')?.value || '').toLowerCase().trim();
  const cards = qsa('.product-card');

  cards.forEach(card => {
    const title = (card.dataset.title || card.querySelector('.product-title')?.textContent || '').toLowerCase();
    const color = (card.dataset.color || '').toLowerCase();
    const material = (card.dataset.material || '').toLowerCase();
    const matchesText = title.includes(input);
    // basic show/hide
    card.style.display = matchesText ? '' : 'none';
  });
}

// --- Sorting ---
function applySorting() {
  const value = qs('#sortSelect').value;
  const container = qs('#productGallery');
  const products = Array.from(container.children);

  products.sort((a, b) => {
    const titleA = (a.dataset.title || a.querySelector('.product-title')?.textContent || '').trim();
    const titleB = (b.dataset.title || b.querySelector('.product-title')?.textContent || '').trim();
    const priceA = parseFloat(a.dataset.price || (a.querySelector('.price')?.textContent || '').replace(/[₹,]/g, '')) || 0;
    const priceB = parseFloat(b.dataset.price || (b.querySelector('.price')?.textContent || '').replace(/[₹,]/g, '')) || 0;

    switch (value) {
      case 'az': return titleA.localeCompare(titleB);
      case 'za': return titleB.localeCompare(titleA);
      case 'priceLow': return priceA - priceB;
      case 'priceHigh': return priceB - priceA;
      default: return 0;
    }
  });

  container.innerHTML = '';
  products.forEach(p => container.appendChild(p));
}

// --- Filter application (color/material) ---
function applyFilters() {
  const color = (qs('#filterColor')?.value || 'any').toLowerCase();
  const material = (qs('#filterMaterial')?.value || 'any').toLowerCase();
  qsa('.product-card').forEach(card => {
    const matchesColor = (color === 'any') || (card.dataset.color || '').toLowerCase() === color;
    const matchesMaterial = (material === 'any') || (card.dataset.material || '').toLowerCase() === material;
    card.style.display = matchesColor && matchesMaterial ? '' : 'none';
  });
}

// --- Wishlist handling ---
function toggleWishlistOnCard(btn) {
  const card = btn.closest('.product-card');
  const title = card.dataset.title || card.querySelector('.product-title')?.textContent;
  if (!title) return;
  const priceText = card.querySelector('.price')?.textContent || `₹${card.dataset.price || '0'}`;
  const frontImg = card.querySelector('.product-img.front')?.getAttribute('src') || '';
  const backImg = card.querySelector('.product-img.back')?.getAttribute('src') || '';
  let wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];

  const exists = wishlist.find(i => i.title === title);
  if (!exists) {
    wishlist.push({ title, price: priceText, frontImg, backImg });
    btn.classList.add('liked');
    btn.querySelector('i')?.classList?.remove('far');
    btn.querySelector('i')?.classList?.add('fas');
  } else {
    wishlist = wishlist.filter(i => i.title !== title);
    btn.classList.remove('liked');
    btn.querySelector('i')?.classList?.remove('fas');
    btn.querySelector('i')?.classList?.add('far');
  }
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
}

// --- Cart handling ---
function addToCartFromCard(btn) {
  const card = btn.closest('.product-card');
  const title = card.dataset.title || card.querySelector('.product-title')?.textContent;
  const priceText = card.querySelector('.price')?.textContent || `₹${card.dataset.price || '0'}`;
  const img = card.querySelector('.product-img.front')?.getAttribute('src') || '';
  let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

  cart.push({ title, price: priceText, img });
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartUI();
  // Small feedback
  const originalText = btn.textContent;
  btn.textContent = 'Added ✔';
  btn.disabled = true;
  setTimeout(() => { btn.textContent = originalText; btn.disabled = false; }, 900);
}

function updateCartUI() {
  const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
  const cartBody = qs('.cart-body');
  if (!cartBody) return;
  cartBody.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    cartBody.innerHTML = '<p>Your cart is empty.</p>';
  } else {
    cart.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = 'cart-item';
      const priceNum = parseFloat((item.price || '').replace(/[₹,]/g, '')) || 0;
      total += priceNum;
      row.innerHTML = `
        <img src="${item.img}" alt="${item.title}">
        <div style="flex:1;">
          <div style="font-weight:600">${item.title}</div>
          <div>${item.price}</div>
        </div>
        <div>
          <button class="remove-cart-item" data-index="${idx}">Remove</button>
        </div>
      `;
      cartBody.appendChild(row);
    });

    // attach remove handlers
    qsa('.remove-cart-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index);
        const cartNow = JSON.parse(localStorage.getItem(CART_KEY)) || [];
        cartNow.splice(idx, 1);
        localStorage.setItem(CART_KEY, JSON.stringify(cartNow));
        updateCartUI();
      });
    });
  }

  qs('#cartTotal') && (qs('#cartTotal').textContent = total.toFixed(0));
}

// Clear cart
function clearCart() {
  localStorage.setItem(CART_KEY, JSON.stringify([]));
  updateCartUI();
}

// Checkout (placeholder)
function checkout() {
  alert('Checkout is a demo here. Integrate payment gateway / order flow for real checkout.');
}

// --- mobile swipe for image containers ---
function attachSwipeListeners() {
  qsa('.image-container').forEach(container => {
    let startX = 0;
    container.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
    }, {passive: true});
    container.addEventListener('touchend', e => {
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      const front = container.querySelector('.product-img.front');
      const back = container.querySelector('.product-img.back');
      if (!front || !back) return;
      if (diff > 40) { // swipe left -> show back
        back.style.opacity = 1;
        front.style.opacity = 0;
      } else if (diff < -40) { // swipe right -> show front
        back.style.opacity = 0;
        front.style.opacity = 1;
      }
    }, {passive: true});
  });
}

// Initialize event listeners (delegation where helpful)
document.addEventListener('DOMContentLoaded', () => {
  // Buttons
  qs('#searchBtn')?.addEventListener('click', performSearch);
  qs('#searchInput')?.addEventListener('keyup', (e) => { if (e.key === 'Enter') performSearch(); });

  qs('#sortSelect')?.addEventListener('change', applySorting);
  qs('#applyFilterBtn')?.addEventListener('click', () => { applyFilters(); toggleFilter(); });

  // Cart controls
  qs('#clearCartBtn')?.addEventListener('click', () => { if(confirm('Clear cart?')) clearCart(); });
  qs('#checkoutBtn')?.addEventListener('click', checkout);

  // Attach like / add-to-cart handlers for current product cards
  qsa('.product-gallery').forEach(gallery => {
    gallery.addEventListener('click', e => {
      const likeBtn = e.target.closest('.like-button');
      if (likeBtn) {
        toggleWishlistOnCard(likeBtn);
        return;
      }
      const addBtn = e.target.closest('.add-to-cart');
      if (addBtn) {
        addToCartFromCard(addBtn);
        return;
      }
    });
  });

  // Mark wishlist hearts that already exist
  const wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
  qsa('.product-card').forEach(card => {
    const title = card.dataset.title || card.querySelector('.product-title')?.textContent;
    const btn = card.querySelector('.like-button');
    if (wishlist.find(i => i.title === title)) {
      btn.classList.add('liked');
      btn.querySelector('i')?.classList?.remove('far');
      btn.querySelector('i')?.classList?.add('fas');
    }
  });

  // attach swipe
  attachSwipeListeners();

  // update cart initial UI
  updateCartUI();
});

// expose updateCartUI to other pages (wishlist uses it)
window.updateCartUI = updateCartUI;
