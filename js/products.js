const products = [
  {
    id: 1,
    name: "AeroPulse Wireless Headphones",
    category: "Electronics",
    price: 189.99,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format",
    description: "Adaptive noise cancellation, spatial audio, and a soft-touch graphite finish built for focused listening all day."
  },
  {
    id: 2,
    name: "Nova X1 Smartwatch",
    category: "Electronics",
    price: 249.99,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&auto=format",
    description: "A bright edge-to-edge display, health tracking, GPS, and seven-day battery life wrapped in a refined aluminum shell."
  },
  {
    id: 3,
    name: "VoltBook Air Sleeve",
    category: "Accessories",
    price: 64.99,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&auto=format",
    description: "Water-resistant woven fabric, magnetic closure, and plush recycled lining protect your laptop without bulk."
  },
  {
    id: 4,
    name: "Orbit Mechanical Keyboard",
    category: "Gaming",
    price: 139.99,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=400&fit=crop&auto=format",
    description: "Hot-swappable tactile switches, per-key lighting, and a compact aluminum frame tuned for fast play and deep work."
  },
  {
    id: 5,
    name: "Flux Runner Jacket",
    category: "Fashion",
    price: 119.99,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop&auto=format",
    description: "Lightweight weather-ready shell with reflective trim, vented panels, and a sculpted athletic fit."
  },
  {
    id: 6,
    name: "Spectra VR Headset",
    category: "Gaming",
    price: 399.99,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400&h=400&fit=crop&auto=format",
    description: "High-refresh micro displays, inside-out tracking, and balanced comfort for immersive gaming and creative worlds."
  },
  {
    id: 7,
    name: "Halo Mini Speaker",
    category: "Electronics",
    price: 89.99,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop&auto=format",
    description: "Pocket-sized wireless speaker with punchy bass, IPX7 water resistance, and an illuminated control ring."
  },
  {
    id: 8,
    name: "Arcade Pro Controller",
    category: "Gaming",
    price: 74.99,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=400&h=400&fit=crop&auto=format",
    description: "Low-latency wireless control, Hall effect sticks, programmable paddles, and textured grips for marathon sessions."
  },
  {
    id: 9,
    name: "Luma Crossbody Bag",
    category: "Fashion",
    price: 79.99,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop&auto=format",
    description: "Compact premium carry with hidden pockets, satin hardware, and an adjustable strap for daily city movement."
  },
  {
    id: 10,
    name: "Prism Charging Dock",
    category: "Accessories",
    price: 54.99,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1647163927823-de36f13e9b02?w=400&h=400&fit=crop&auto=format",
    description: "A weighted 3-in-1 charging station with ambient glow, cable management, and fast wireless power delivery."
  },
  {
    id: 11,
    name: "Cipher Sunglasses",
    category: "Fashion",
    price: 149.99,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop&auto=format",
    description: "Polarized gradient lenses, featherweight titanium hinges, and a crisp silhouette made for bright commutes."
  },
  {
    id: 12,
    name: "MagCore Travel Hub",
    category: "Accessories",
    price: 99.99,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=400&h=400&fit=crop&auto=format",
    description: "Seven ports, braided cable, 4K HDMI, SD reader, and magnetic storage in a slim travel-ready body."
  }
];

const categories = ["All", "Electronics", "Fashion", "Gaming", "Accessories"];

function getProductById(id) {
  return products.find(p => p.id === Number(id));
}

function formatPrice(price) {
  return `$${Number(price).toFixed(2)}`;
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
}