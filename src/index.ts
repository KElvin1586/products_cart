// src/index.ts

interface DessertItem {
  name: string;
  category: string;
  price: number;
  element: HTMLElement;
  quantity: number;
}

// Grab elements
const cartCount = document.getElementById("cart-count") as HTMLSpanElement;
const cartItemsContainer = document.getElementById("cart-items") as HTMLElement;
const totalPriceEl = document.getElementById("total-price") as HTMLSpanElement;
const confirmOrderBtn = document.getElementById("confirm-order") as HTMLButtonElement;
const orderMessage = document.getElementById("order-message") as HTMLElement;
const orderModal = document.getElementById("order-modal") as HTMLElement;
const closeModalBtn = document.getElementById("close-modal") as HTMLButtonElement;
const modalItemsContainer = document.getElementById("modal-items") as HTMLElement;

const cart: DessertItem[] = [];

// Helper: format price
function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

// Add item to cart
function addToCart(dessert: DessertItem) {
  const existing = cart.find(item => item.name === dessert.name);
  if (existing) {
    existing.quantity += 1;
    updateCart();
    return;
  }

  cart.push({ ...dessert, quantity: 1 });
  updateCart();
}

// Remove item from cart
function removeFromCart(name: string) {
  const index = cart.findIndex(item => item.name === name);
  if (index > -1) {
    cart.splice(index, 1);
    updateCart();
  }
}

// Update cart UI
function updateCart() {
  // Cart count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems.toString();

  // Clear container
  cartItemsContainer.innerHTML = "";
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty">Your added items will appear here.</p>';
    totalPriceEl.textContent = "$0.00";
    return;
  }

  // Add each item
  cart.forEach(item => {
    const itemEl = document.createElement("div");
    itemEl.className = "cart-item";

    itemEl.innerHTML = `
      <p>${item.name} (${item.quantity}) - ${formatPrice(item.price * item.quantity)}</p>
      <div class="cart-controls">
        <button class="decrease">−</button>
        <button class="increase">+</button>
        <button class="remove">🗑️</button>
      </div>
    `;

    // Event listeners
    itemEl.querySelector(".decrease")?.addEventListener("click", () => {
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        removeFromCart(item.name);
      }
      updateCart();
    });

    itemEl.querySelector(".increase")?.addEventListener("click", () => {
      item.quantity++;
      updateCart();
    });

    itemEl.querySelector(".remove")?.addEventListener("click", () => {
      removeFromCart(item.name);
    });

    cartItemsContainer.appendChild(itemEl);
  });

  // Update total
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalPriceEl.textContent = formatPrice(total);
}

// Add event listeners to dessert cards
document.querySelectorAll(".dessert-card").forEach(card => {
  const name = card.querySelector(".name")?.textContent || "";
  const category = card.querySelector(".category")?.textContent || "";
  const priceStr = card.querySelector(".price")?.textContent?.replace("$", "") || "0";
  const price = parseFloat(priceStr);

  const addBtn = card.querySelector(".add-btn") as HTMLButtonElement;
  addBtn.addEventListener("click", () => {
    addToCart({ name, category, price, element: card as HTMLElement, quantity: 0 });
  });

  // Optional: handle quantity controls inside card
  const decreaseBtn = card.querySelector(".decrease") as HTMLButtonElement;
  const increaseBtn = card.querySelector(".increase") as HTMLButtonElement;
  const quantityEl = card.querySelector(".quantity") as HTMLElement;

  if (decreaseBtn && increaseBtn && quantityEl) {
    let quantity = 1;

    decreaseBtn.addEventListener("click", () => {
      if (quantity > 1) quantity--;
      quantityEl.textContent = quantity.toString();
    });

    increaseBtn.addEventListener("click", () => {
      quantity++;
      quantityEl.textContent = quantity.toString();
    });
  }
});

// Confirm order
confirmOrderBtn.addEventListener("click", () => {
  if (cart.length === 0) return;

  modalItemsContainer.innerHTML = "";
  cart.forEach(item => {
    const el = document.createElement("p");
    el.textContent = `${item.name} × ${item.quantity} = ${formatPrice(item.price * item.quantity)}`;
    modalItemsContainer.appendChild(el);
  });

  orderModal.classList.remove("hidden");
});

// Close modal
closeModalBtn.addEventListener("click", () => {
  orderModal.classList.add("hidden");
  cart.length = 0;
  updateCart();
  orderMessage.classList.remove("hidden");
  setTimeout(() => orderMessage.classList.add("hidden"), 3000);
});
