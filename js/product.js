document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  hideLoader();
  renderProductDetail();
});

function renderProductDetail() {
  const page = document.querySelector("[data-product-detail]");
  if (!page) return;

  const id = new URLSearchParams(window.location.search).get("id");
  const p = getProductById(id);

  if (!p) {
    page.innerHTML = `
      <section class="empty-state reveal visible">
        <div class="empty-icon">😕</div>
        <h2>Product not found</h2>
        <p>This item may have been removed or the link is broken.</p>
        <a class="button primary" href="index.html">Back to Store</a>
      </section>`;
    return;
  }

  document.title = `${p.name} | Nexora`;

  const wishlist = getWishlist();
  const saved = wishlist.includes(p.id);

  page.innerHTML = `
    <section class="product-detail-shell">
      <div class="detail-gallery reveal">
        <div class="detail-image-wrap">
          <img src="${p.image}" alt="${p.name}" class="detail-img">
          <div class="detail-glow"></div>
        </div>
        <div class="detail-thumbs">
          <img src="${p.image}" alt="${p.name}" class="thumb active">
          <img src="${p.image.replace('w=400', 'w=400')}" alt="${p.name}" class="thumb" style="opacity:.5;filter:grayscale(.6)">
          <img src="${p.image}" alt="${p.name}" class="thumb" style="opacity:.5;filter:sepia(.4)">
        </div>
      </div>
      <div class="detail-info reveal">
        <div class="detail-top">
          <span class="badge">${p.category}</span>
          <button class="wishlist-button ${saved ? "saved" : ""}" id="detailWishlist" data-wishlist="${p.id}">♥</button>
        </div>
        <h1>${p.name}</h1>
        <div class="rating large"><span>${renderStars(p.rating)}</span><strong>${p.rating} · 142 reviews</strong></div>
        <strong class="detail-price">${formatPrice(p.price)}</strong>
        <p class="detail-desc">${p.description}</p>
        <div class="detail-perks">
          <div class="perk"><span class="perk-icon">🚚</span><div><strong>Free Shipping</strong><small>Orders over $50</small></div></div>
          <div class="perk"><span class="perk-icon">↩️</span><div><strong>30-Day Returns</strong><small>No questions asked</small></div></div>
          <div class="perk"><span class="perk-icon">🔒</span><div><strong>Secure Checkout</strong><small>SSL encrypted</small></div></div>
        </div>
        <div class="qty-row">
          <label class="qty-label">Quantity</label>
          <div class="quantity-controls">
            <button data-quantity-minus>−</button>
            <input id="qty" type="number" min="1" value="1" data-quantity>
            <button data-quantity-plus>+</button>
          </div>
        </div>
        <div class="detail-actions">
          <button class="button primary ripple" data-detail-add="${p.id}">Add to Cart</button>
          <a class="button ghost" href="cart.html">View Cart</a>
        </div>
      </div>
    </section>`;

  bindDetailActions();
  setupRippleButtons();
  setupScrollReveal();

  document.getElementById("detailWishlist")?.addEventListener("click", function () {
    const isSaved = toggleWishlist(this.dataset.wishlist);
    this.classList.toggle("saved", isSaved);
  });
}

function bindDetailActions() {
  const qty = document.querySelector("[data-quantity]");
  document.querySelector("[data-quantity-minus]")?.addEventListener("click", () => {
    qty.value = Math.max(1, Number(qty.value) - 1);
  });
  document.querySelector("[data-quantity-plus]")?.addEventListener("click", () => {
    qty.value = Number(qty.value) + 1;
  });
  document.querySelector("[data-detail-add]")?.addEventListener("click", function () {
    addToCart(this.dataset.detailAdd, Number(qty.value));
  });

  document.querySelectorAll(".thumb").forEach((t, i, all) => {
    t.addEventListener("click", () => {
      all.forEach(x => { x.classList.remove("active"); x.style.opacity = ".5"; x.style.filter = "grayscale(.6)"; });
      t.classList.add("active");
      t.style.opacity = "1";
      t.style.filter = "none";
      const mainImg = document.querySelector(".detail-img");
      if (mainImg) { mainImg.style.opacity = "0"; setTimeout(() => { mainImg.src = t.src; mainImg.style.opacity = "1"; }, 200); }
    });
  });
}