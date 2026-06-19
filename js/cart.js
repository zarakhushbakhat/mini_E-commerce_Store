const CART_KEY = "nexora-cart";
const WISHLIST_KEY = "nexora-wishlist";

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function getWishlist() {
  return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
}

function saveWishlist(wishlist) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
}

function addToCart(productId, quantity = 1) {
  const cart = getCart();
  const existing = cart.find(i => i.id === Number(productId));
  if (existing) {
    existing.quantity += Number(quantity);
  } else {
    cart.push({ id: Number(productId), quantity: Number(quantity) });
  }
  saveCart(cart);
  animateCartBadge();
  showToast("Added to cart ✓");
}

function removeFromCart(productId) {
  saveCart(getCart().filter(i => i.id !== Number(productId)));
  showToast("Removed from cart");
}

function updateCartQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find(i => i.id === Number(productId));
  if (!item) return;
  item.quantity = Math.max(1, Number(quantity));
  saveCart(cart);
}

function clearCart() {
  saveCart([]);
  showToast("Cart cleared");
}

function getCartTotals() {
  return getCart().reduce((t, item) => {
    const p = getProductById(item.id);
    if (!p) return t;
    t.items += item.quantity;
    t.price += p.price * item.quantity;
    return t;
  }, { items: 0, price: 0 });
}

function updateCartBadge() {
  const badge = document.querySelector("[data-cart-count]");
  if (!badge) return;
  const { items } = getCartTotals();
  badge.textContent = items;
  badge.classList.toggle("is-empty", items === 0);
}

function animateCartBadge() {
  const link = document.querySelector(".cart-link");
  if (!link) return;
  link.classList.remove("bounce");
  requestAnimationFrame(() => link.classList.add("bounce"));
}

function toggleWishlist(productId) {
  const wishlist = getWishlist();
  const id = Number(productId);
  const saved = wishlist.includes(id);
  saveWishlist(saved ? wishlist.filter(x => x !== id) : [...wishlist, id]);
  showToast(saved ? "Removed from wishlist" : "Saved to wishlist ♥");
  return !saved;
}

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 2400);
}

document.addEventListener("DOMContentLoaded", updateCartBadge);

document.addEventListener("DOMContentLoaded", () => {
  const shell = document.querySelector("[data-cart-page]");
  if (!shell) return;
  setupNavigation();
  hideLoader();
  renderCartPage();
});

function renderCartPage() {
  const shell = document.querySelector("[data-cart-page]");
  if (!shell) return;
  const cart = getCart();
  const totals = getCartTotals();

  if (!cart.length) {
    shell.innerHTML = `
      <section class="empty-state reveal visible">
        <div class="empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Find something you love and add it here.</p>
        <a class="button primary" href="index.html">Browse Collection</a>
      </section>`;
    return;
  }

  shell.innerHTML = `
    <section class="cart-layout reveal visible">
      <div class="cart-list">${cart.map(createCartItem).join("")}</div>
      <aside class="cart-summary">
        <div class="summary-label">Order Summary</div>
        <h2>${totals.items} item${totals.items !== 1 ? "s" : ""}</h2>
        <div class="summary-row"><span>Subtotal</span><strong>${formatPrice(totals.price)}</strong></div>
        <div class="summary-row"><span>Shipping</span><strong>Free</strong></div>
        <div class="summary-total"><span>Total</span><strong>${formatPrice(totals.price)}</strong></div>
        <button class="button primary ripple" type="button">Checkout</button>
        <button class="button ghost" type="button" data-clear-cart>Clear Cart</button>
      </aside>
    </section>`;

  bindCartActions();
  setupRippleButtons();
}

function createCartItem(item) {
  const p = getProductById(item.id);
  if (!p) return "";
  return `
    <article class="cart-item" data-cart-item="${p.id}">
      <img src="${p.image}" alt="${p.name}">
      <div class="cart-item-info">
        <span class="badge">${p.category}</span>
        <h3>${p.name}</h3>
        <strong>${formatPrice(p.price)}</strong>
      </div>
      <div class="quantity-controls cart-controls">
        <button data-cart-minus="${p.id}">−</button>
        <input type="number" min="1" value="${item.quantity}" data-cart-quantity="${p.id}">
        <button data-cart-plus="${p.id}">+</button>
      </div>
      <strong class="cart-subtotal">${formatPrice(p.price * item.quantity)}</strong>
      <button class="remove-button" data-remove-cart="${p.id}">Remove</button>
    </article>`;
}

function bindCartActions() {
  document.querySelectorAll("[data-cart-minus]").forEach(btn => {
    btn.addEventListener("click", () => {
      const inp = document.querySelector(`[data-cart-quantity="${btn.dataset.cartMinus}"]`);
      updateCartQuantity(btn.dataset.cartMinus, Math.max(1, Number(inp.value) - 1));
      renderCartPage();
    });
  });

  document.querySelectorAll("[data-cart-plus]").forEach(btn => {
    btn.addEventListener("click", () => {
      const inp = document.querySelector(`[data-cart-quantity="${btn.dataset.cartPlus}"]`);
      updateCartQuantity(btn.dataset.cartPlus, Number(inp.value) + 1);
      renderCartPage();
    });
  });

  document.querySelectorAll("[data-cart-quantity]").forEach(inp => {
    inp.addEventListener("change", () => {
      updateCartQuantity(inp.dataset.cartQuantity, inp.value);
      renderCartPage();
    });
  });

  document.querySelectorAll("[data-remove-cart]").forEach(btn => {
    btn.addEventListener("click", () => {
      removeFromCart(btn.dataset.removeCart);
      renderCartPage();
    });
  });

  document.querySelector("[data-clear-cart]")?.addEventListener("click", () => {
    clearCart();
    renderCartPage();
  });
}