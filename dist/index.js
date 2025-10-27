// src/index.ts
// Grab elements
const cartCount = document.getElementById("cart-count");
const cartItemsContainer = document.getElementById("cart-items");
const totalPriceEl = document.getElementById("total-price");
const confirmOrderBtn = document.getElementById("confirm-order");
const orderMessage = document.getElementById("order-message");
const orderModal = document.getElementById("order-modal");
const closeModalBtn = document.getElementById("close-modal");
const modalItemsContainer = document.getElementById("modal-items");
const cart = [];
// Helper: format price
function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}
// Add item to cart
function addToCart(dessert) {
    const existing = cart.find(item => item.name === dessert.name);
    if (existing) {
        existing.quantity += 1;
        updateCart();
        return;
    }
    cart.push(Object.assign(Object.assign({}, dessert), { quantity: 1 }));
    updateCart();
}
// Remove item from cart
function removeFromCart(name) {
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
        var _a, _b, _c;
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
        (_a = itemEl.querySelector(".decrease")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            if (item.quantity > 1) {
                item.quantity--;
            }
            else {
                removeFromCart(item.name);
            }
            updateCart();
        });
        (_b = itemEl.querySelector(".increase")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
            item.quantity++;
            updateCart();
        });
        (_c = itemEl.querySelector(".remove")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
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
    var _a, _b, _c, _d;
    const name = ((_a = card.querySelector(".name")) === null || _a === void 0 ? void 0 : _a.textContent) || "";
    const category = ((_b = card.querySelector(".category")) === null || _b === void 0 ? void 0 : _b.textContent) || "";
    const priceStr = ((_d = (_c = card.querySelector(".price")) === null || _c === void 0 ? void 0 : _c.textContent) === null || _d === void 0 ? void 0 : _d.replace("$", "")) || "0";
    const price = parseFloat(priceStr);
    const addBtn = card.querySelector(".add-btn");
    addBtn.addEventListener("click", () => {
        addToCart({ name, category, price, element: card, quantity: 0 });
    });
    // Optional: handle quantity controls inside card
    const decreaseBtn = card.querySelector(".decrease");
    const increaseBtn = card.querySelector(".increase");
    const quantityEl = card.querySelector(".quantity");
    if (decreaseBtn && increaseBtn && quantityEl) {
        let quantity = 1;
        decreaseBtn.addEventListener("click", () => {
            if (quantity > 1)
                quantity--;
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
    if (cart.length === 0)
        return;
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
export {};
//# sourceMappingURL=index.js.map