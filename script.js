const products = [
  {
    id: 1,
    name: "iPhone 16 Pro",
    brand: "Apple",
    category: "Premium",
    price: 119900,
    description: "Flagship performance, pro-grade camera system, and premium titanium design."
  },
  {
    id: 2,
    name: "Samsung Galaxy S25",
    brand: "Samsung",
    category: "Premium",
    price: 84999,
    description: "Bright AMOLED display, AI features, and all-day battery life."
  },
  {
    id: 3,
    name: "OnePlus 13R",
    brand: "OnePlus",
    category: "Performance",
    price: 42999,
    description: "Fast charging, smooth gaming, and powerful day-to-day performance."
  },
  {
    id: 4,
    name: "Redmi Note 14 Pro",
    brand: "Xiaomi",
    category: "Value",
    price: 26999,
    description: "Excellent camera setup and strong battery backup at a smart price."
  },
  {
    id: 5,
    name: "Vivo V40",
    brand: "Vivo",
    category: "Camera",
    price: 34999,
    description: "Portrait-focused camera experience with a stylish slim design."
  },
  {
    id: 6,
    name: "Oppo Reno 12",
    brand: "Oppo",
    category: "Style",
    price: 31999,
    description: "Premium finish, vivid display, and fast-charging convenience."
  }
];

const filters = ["All", ...new Set(products.map((product) => product.category))];
let activeFilter = "All";
let cart = [];

const productGrid = document.getElementById("productGrid");
const filtersContainer = document.getElementById("filters");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const toast = document.getElementById("toast");
const checkoutBtn = document.getElementById("checkoutBtn");

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function renderFilters() {
  filtersContainer.innerHTML = filters
    .map(
      (filter) => `
        <button class="filter-btn ${filter === activeFilter ? "active" : ""}" data-filter="${filter}">
          ${filter}
        </button>
      `
    )
    .join("");
}

function renderProducts() {
  const filteredProducts =
    activeFilter === "All"
      ? products
      : products.filter((product) => product.category === activeFilter);

  productGrid.innerHTML = filteredProducts
    .map(
      (product) => `
        <article class="product-card">
          <span class="badge">${product.brand}</span>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="product-meta">
            <div>
              <span>${product.category}</span>
              <div class="product-price">${formatPrice(product.price)}</div>
            </div>
            <button class="primary-btn" data-product="${product.name}">Add</button>
          </div>
        </article>
      `
    )
    .join("");
}

function renderCart() {
  if (!cart.length) {
    cartItems.innerHTML = `<p class="empty-state">Your cart is empty. Add a phone to get started.</p>`;
  } else {
    cartItems.innerHTML = cart
      .map(
        (item) => `
          <div class="cart-item">
            <strong>${item.name}</strong>
            <span>${formatPrice(item.price)}</span>
          </div>
        `
      )
      .join("");
  }

  cartCount.textContent = `${cart.length} item${cart.length === 1 ? "" : "s"}`;
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotal.textContent = formatPrice(total);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

function addToCart(productName) {
  const product = products.find((item) => item.name === productName);
  if (!product) return;

  cart.push(product);
  renderCart();
  showToast(`${product.name} added to cart`);
}

document.addEventListener("click", (event) => {
  const filterButton = event.target.closest("[data-filter]");
  const productButton = event.target.closest("[data-product]");

  if (filterButton) {
    activeFilter = filterButton.dataset.filter;
    renderFilters();
    renderProducts();
  }

  if (productButton) {
    addToCart(productButton.dataset.product);
  }
});

checkoutBtn.addEventListener("click", () => {
  if (!cart.length) {
    showToast("Add at least one phone before checkout");
    return;
  }

  showToast("Checkout request received. Store team will contact you.");
});

renderFilters();
renderProducts();
renderCart();
