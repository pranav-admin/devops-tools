
const products = [
  {
    id: 1,
    name: "Studio Wireless",
    price: 2499,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30d?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 2,
    name: "Minimal Timepiece",
    price: 3299,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 3,
    name: "Street Runner",
    price: 3799,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 4,
    name: "Everyday Backpack",
    price: 1899,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 5,
    name: "Creator Camera",
    price: 8499,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 6,
    name: "Urban Shades",
    price: 1299,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=300&q=80"
  }
];

let cart = [];
let toastTimer;

// DOM elements
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const cartBtn = document.getElementById("cartBtn");
const closeCart = document.getElementById("closeCart");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTitleCount = document.getElementById("cartTitleCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const toast = document.getElementById("toast");

// Format prices in Indian Rupees
function formatPrice(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

// ======================================
// DARK MODE
// ======================================

function updateThemeButton() {
  const isDark = document.body.classList.contains("dark-mode");

  themeIcon.textContent = isDark ? "☀" : "☾";

  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Switch to light mode" : "Switch to dark mode"
  );

  themeToggle.setAttribute("aria-pressed", String(isDark));

  themeToggle.title = isDark
    ? "Switch to light mode"
    : "Switch to dark mode";

  const themeMeta = document.querySelector(
    'meta[name="theme-color"]'
  );

  if (themeMeta) {
    themeMeta.setAttribute(
      "content",
      isDark ? "#141612" : "#f7f7f4"
    );
  }
}

// Load previously saved theme
try {
  const savedTheme = localStorage.getItem("nova-theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }
} catch (error) {
  console.warn("Unable to read saved theme preference.");
}

// Set the correct icon when the page loads
updateThemeButton();

// Toggle between light and dark mode
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  const isDark = document.body.classList.contains("dark-mode");

  try {
    localStorage.setItem(
      "nova-theme",
      isDark ? "dark" : "light"
    );
  } catch (error) {
    console.warn("Unable to save theme preference.");
  }

  updateThemeButton();
});

// ======================================
// TOAST NOTIFICATIONS
// ======================================

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

// ======================================
// SHOPPING CART
// ======================================

// Add a product to the cart
function addToCart(id) {
  const product = products.find(item => item.id === id);

  if (!product) return;

  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  renderCart();

  showToast(`${product.name} added to your bag ✓`);
}

// Increase or decrease product quantity
function changeQuantity(id, amount) {
  const item = cart.find(product => product.id === id);

  if (!item) return;

  item.quantity += amount;

  // Remove the product if quantity becomes zero
  if (item.quantity <= 0) {
    cart = cart.filter(product => product.id !== id);
  }

  renderCart();
}

// Remove a product completely
function removeFromCart(id) {
  const item = cart.find(product => product.id === id);

  if (!item) return;

  cart = cart.filter(product => product.id !== id);

  renderCart();

  showToast(`${item.name} removed from your bag`);
}

// Update cart items, count and total
function renderCart() {
  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  cartCount.textContent = totalItems;
  cartTitleCount.textContent = `(${totalItems})`;
  cartTotal.textContent = formatPrice(totalPrice);

  checkoutBtn.disabled = totalItems === 0;

  // Display an empty-cart message
  if (cart.length === 0) {
    cartItems.innerHTML = `
      <p class="empty-cart">
        Your bag is empty.
        <br><br>
        Discover something you love ✦
      </p>
    `;

    return;
  }

  // Render products inside the cart
  cartItems.innerHTML = cart.map(item => `
    <div class="cart-row">
      <img
        src="${item.image}"
        alt="${item.name}"
      >

      <div class="cart-row-info">
        <h3>${item.name}</h3>

        <strong>
          ${formatPrice(item.price * item.quantity)}
        </strong>

        <div class="quantity">
          <button
            data-action="decrease"
            data-id="${item.id}"
            aria-label="Decrease quantity"
          >−</button>

          <span>${item.quantity}</span>

          <button
            data-action="increase"
            data-id="${item.id}"
            aria-label="Increase quantity"
          >+</button>
        </div>

        <button
          class="remove-item"
          data-action="remove"
          data-id="${item.id}"
        >
          Remove
        </button>
      </div>
    </div>
  `).join("");
}

// ======================================
// ADD TO CART BUTTONS
// ======================================

document.querySelectorAll(".quick-add").forEach(button => {
  button.addEventListener("click", () => {
    const productId = Number(button.dataset.id);

    addToCart(productId);
  });
});

// ======================================
// PRODUCT CATEGORY FILTERS
// ======================================

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    // Update active filter button
    document.querySelectorAll(".filter").forEach(filter => {
      filter.classList.remove("active");
    });

    button.classList.add("active");

    const selectedCategory = button.dataset.category;

    // Show only products matching the selected category
    document.querySelectorAll(".product-card").forEach(card => {
      const matchesCategory =
        selectedCategory === "all" ||
        card.dataset.category === selectedCategory;

      card.hidden = !matchesCategory;
    });
  });
});

// ======================================
// CART QUANTITY AND REMOVE BUTTONS
// ======================================

// Event delegation handles dynamically rendered cart buttons
cartItems.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");

  if (!button) return;

  const productId = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === "increase") {
    changeQuantity(productId, 1);
  }

  if (action === "decrease") {
    changeQuantity(productId, -1);
  }

  if (action === "remove") {
    removeFromCart(productId);
  }
});

// ======================================
// OPEN AND CLOSE CART
// ======================================

function openCart() {
  cartOverlay.classList.add("open");
  document.body.style.overflow = "hidden";

  closeCart.focus();
}

function hideCart() {
  cartOverlay.classList.remove("open");
  document.body.style.overflow = "";

  cartBtn.focus();
}

cartBtn.addEventListener("click", openCart);

closeCart.addEventListener("click", hideCart);

// Close cart when clicking the background
cartOverlay.addEventListener("click", event => {
  if (event.target === cartOverlay) {
    hideCart();
  }
});

// Close cart using the Escape key
document.addEventListener("keydown", event => {
  if (
    event.key === "Escape" &&
    cartOverlay.classList.contains("open")
  ) {
    hideCart();
  }
});

// ======================================
// CHECKOUT DEMO
// ======================================

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) return;

  showToast(
    "Demo checkout — connect a backend to place orders."
  );
});

// ======================================
// INITIALIZE WEBSITE
// ======================================

renderCart();


