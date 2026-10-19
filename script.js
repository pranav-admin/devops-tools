
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

const cartBtn = document.getElementById("cartBtn");
const closeCart = document.getElementById("closeCart");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTitleCount = document.getElementById("cartTitleCount");
const cartTotal = document.getElementById("cartTotal");
const toast = document.getElementById("toast");
const checkoutBtn = document.getElementById("checkoutBtn");

const formatPrice = amount =>
  "₹" + amount.toLocaleString("en-IN");

let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function addToCart(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  renderCart();
  showToast(`${product.name} added to your bag ✓`);
}

function changeQuantity(id, amount) {
  const item = cart.find(product => product.id === id);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(product => product.id !== id);
  }

  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
  showToast("Item removed from your bag");
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  cartCount.textContent = count;
  cartTitleCount.textContent = `(${count})`;
  cartTotal.textContent = formatPrice(total);
  checkoutBtn.disabled = count === 0;

  if (cart.length === 0) {
    cartItems.innerHTML =
      '<p class="empty-cart">Your bag is empty.<br><br>Discover something you love ✦</p>';
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-row">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-row-info">
        <h3>${item.name}</h3>
        <strong>${formatPrice(item.price * item.quantity)}</strong>
        <div class="quantity">
          <button data-action="decrease" data-id="${item.id}" aria-label="Decrease quantity">−</button>
          <span>${item.quantity}</span>
          <button data-action="increase" data-id="${item.id}" aria-label="Increase quantity">+</button>
        </div>
        <button class="remove-item" data-action="remove" data-id="${item.id}">Remove</button>
      </div>
    </div>
  `).join("");
}

document.querySelectorAll(".quick-add").forEach(button => {
  button.addEventListener("click", () => {
    addToCart(Number(button.dataset.id));
  });
});

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(filter => {
      filter.classList.remove("active");
    });

    button.classList.add("active");

    const category = button.dataset.category;

    document.querySelectorAll(".product-card").forEach(card => {
      const visible =
        category === "all" || card.dataset.category === category;

      card.hidden = !visible;
    });
  });
});

cartItems.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const id = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === "increase") changeQuantity(id, 1);
  if (action === "decrease") changeQuantity(id, -1);
  if (action === "remove") removeFromCart(id);
});

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

cartOverlay.addEventListener("click", event => {
  if (event.target === cartOverlay) hideCart();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && cartOverlay.classList.contains("open")) {
    hideCart();
  }
});

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) return;

  showToast("Demo checkout — connect a backend to place orders.");
});

renderCart();


