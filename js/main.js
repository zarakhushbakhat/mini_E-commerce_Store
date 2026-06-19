const productGrid = document.querySelector("[data-product-grid]");
const categoryFilter = document.querySelector("[data-category-filter]");
const sortSelect = document.querySelector("[data-sort]");
const searchInput = document.querySelector("[data-search]");
const quickViewModal = document.querySelector("[data-quick-view]");
const quickViewBody = document.querySelector("[data-quick-view-body]");

let activeCategory = "All";
let activeSort = "Default";
let activeSearch = "";

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupFilters();
  setupScrollReveal();
  setupRippleButtons();
  hideLoader();
  renderProducts();
  renderStats();
  animateHeroNumbers();
});

function setupNavigation() {
  const btn = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-nav-menu]");
  if (!btn || !menu || btn.dataset.ready === "true") return;
  btn.dataset.ready = "true";

  btn.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
    btn.classList.toggle("active", open);
  });

  menu.addEventListener("click", e => {
    if (e.target.matches("a")) {
      menu.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
      btn.classList.remove("active");
    }
  });
}

function setupFilters() {
  if (!categoryFilter || !sortSelect || !searchInput) return;

  categoryFilter.innerHTML = categories.map(cat => `
    <button class="chip ${cat === "All" ? "active" : ""}" data-category="${cat}">${cat}</button>
  `).join("");

  categoryFilter.addEventListener("click", e => {
    const btn = e.target.closest("[data-category]");
    if (!btn) return;
    activeCategory = btn.dataset.category;
    document.querySelectorAll("[data-category]").forEach(c => c.classList.toggle("active", c === btn));
    renderProducts();
  });

  sortSelect.addEventListener("change", e => {
    activeSort = e.target.value;
    renderProducts();
  });

  searchInput.addEventListener("input", e => {
    activeSearch = e.target.value.trim().toLowerCase();
    renderProducts();
  });
}

function getVisibleProducts() {
  const filtered = products.filter(p => {
    const catOk = activeCategory === "All" || p.category === activeCategory;
    const searchOk = !activeSearch ||
      p.name.toLowerCase().includes(activeSearch) ||
      p.category.toLowerCase().includes(activeSearch) ||
      p.description.toLowerCase().includes(activeSearch);
    return catOk && searchOk;
  });

  return filtered.sort((a, b) => {
    if (activeSort === "Price Low to High") return a.price - b.price;
    if (activeSort === "Price High to Low") return b.price - a.price;
    if (activeSort === "Highest Rated") return b.rating - a.rating;
    return a.id - b.id;
  });
}

function renderProducts() {
  if (!productGrid) return;
  const visible = getVisibleProducts();
  const wishlist = getWishlist();

  if (!visible.length) {
    productGrid.innerHTML = `
      <div class="empty-state reveal visible" style="grid-column:1/-1;">
        <div class="empty-icon">🔍</div>
        <h2>No matches found</h2>
        <p>Try adjusting your search or filters.</p>
      </div>`;
    return;
  }

  productGrid.innerHTML = visible.map(p => createProductCard(p, wishlist)).join("");

  setupCardTilt();
  setupRippleButtons();
  setupScrollReveal();
}

function createProductCard(product, wishlist) {
  const saved = wishlist.includes(product.id);
  return `
    <article class="product-card reveal" data-product-card data-id="${product.id}">
      <button class="wishlist-button ${saved ? "saved" : ""}" data-wishlist="${product.id}" aria-label="Toggle wishlist">♥</button>
      <a class="product-media" href="product.html?id=${product.id}">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </a>
      <div class="product-content">
        <span class="badge">${product.category}</span>
        <h3>${product.name}</h3>
        <div class="rating" aria-label="${product.rating} out of 5">
          <span>${renderStars(product.rating)}</span>
          <strong>${product.rating}</strong>
        </div>
        <p>${product.description}</p>
        <div class="product-footer">
          <strong class="price">${formatPrice(product.price)}</strong>
          <button class="quick-btn" data-quick-view-id="${product.id}" aria-label="Quick view">⊕</button>
        </div>
        <div class="card-actions">
          <button class="button primary ripple" data-add-to-cart="${product.id}">Add to Cart</button>
          <a class="button ghost" href="product.html?id=${product.id}">Details</a>
        </div>
      </div>
    </article>`;
}

document.addEventListener("click", e => {
  const addBtn = e.target.closest("[data-add-to-cart]");
  const wishBtn = e.target.closest("[data-wishlist]");
  const qvBtn = e.target.closest("[data-quick-view-id]");
  const closeBtn = e.target.closest("[data-close-modal]");

  if (addBtn) addToCart(addBtn.dataset.addToCart);
  if (wishBtn) {
    const saved = toggleWishlist(wishBtn.dataset.wishlist);
    wishBtn.classList.toggle("saved", saved);
  }
  if (qvBtn) openQuickView(qvBtn.dataset.quickViewId);
  if (closeBtn || e.target === quickViewModal) {
    quickViewModal?.classList.remove("open");
    document.body.style.overflow = "";
  }
});

function openQuickView(id) {
  const p = getProductById(id);
  if (!p || !quickViewModal || !quickViewBody) return;

  quickViewBody.innerHTML = `
    <div class="qv-img">
      <img src="${p.image}" alt="${p.name}">
    </div>
    <div class="qv-info">
      <span class="badge">${p.category}</span>
      <h2>${p.name}</h2>
      <div class="rating"><span>${renderStars(p.rating)}</span><strong>${p.rating}</strong></div>
      <p>${p.description}</p>
      <strong class="modal-price">${formatPrice(p.price)}</strong>
      <div class="modal-actions">
        <button class="button primary ripple" data-add-to-cart="${p.id}">Add to Cart</button>
        <a class="button ghost" href="product.html?id=${p.id}">Full Details</a>
      </div>
    </div>`;

  quickViewModal.classList.add("open");
  document.body.style.overflow = "hidden";
  setupRippleButtons();
}

function setupCardTilt() {
  document.querySelectorAll("[data-product-card]").forEach(card => {
    card.addEventListener("mousemove", e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty("--rx", `${y * -10}deg`);
      card.style.setProperty("--ry", `${x * 10}deg`);
    });
    card.addEventListener("mouseleave", () => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  });
}

function setupScrollReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".reveal:not(.visible)").forEach(el => obs.observe(el));
}

function setupRippleButtons() {
  document.querySelectorAll(".ripple:not([data-ripple-ready])").forEach(btn => {
    btn.dataset.rippleReady = "true";
    btn.addEventListener("click", e => {
      const r = document.createElement("span");
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      r.className = "ripple-wave";
      r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(r);
      setTimeout(() => r.remove(), 700);
    });
  });
}

function hideLoader() {
  const loader = document.querySelector(".page-loader");
  if (!loader) return;
  setTimeout(() => loader.classList.add("hidden"), 600);
}

function renderStats() {
  const el = document.querySelector("[data-stats]");
  if (!el) return;
  const avg = (products.reduce((s, p) => s + p.rating, 0) / products.length).toFixed(1);
  const items = [
    { num: products.length, label: "Products" },
    { num: categories.length - 1, label: "Categories" },
    { num: avg, label: "Avg Rating" },
    { num: "24h", label: "Dispatch" }
  ];
  el.innerHTML = items.map(i => `
    <div class="stat-card reveal">
      <strong data-count="${i.num}">${i.num}</strong>
      <span>${i.label}</span>
    </div>`).join("");
}

function animateHeroNumbers() {
  document.querySelectorAll("[data-count]").forEach(el => {
    const target = parseFloat(el.dataset.count);
    if (isNaN(target)) return;
    let start = 0;
    const step = target / 40;
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      el.textContent = Number.isInteger(target) ? Math.round(start) : start.toFixed(1);
      if (start >= target) clearInterval(timer);
    }, 30);
  });
}