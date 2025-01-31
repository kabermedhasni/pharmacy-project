document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-total");
  const shippingForm = document.getElementById("shipping-form");

  // Load cart from localStorage
  function loadCart() {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  }

  // Render cart items
  function renderCart() {
    const cart = loadCart();
    let total = 0;

    cartItemsContainer.innerHTML = "";
    cart.forEach((item) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");
      cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price} MRO</div>
                </div>
            `;
      cartItemsContainer.appendChild(cartItem);
      total += Number(item.price);
    });

    cartTotalElement.textContent = `${total.toFixed(2)} MRO`;

    // If cart is empty, display a message
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
      cartTotalElement.textContent = "0.00 MRO";
    }
  }

  // Handle form submission
  shippingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(shippingForm);
    const orderData = {
      customer: Object.fromEntries(formData),
      items: loadCart(),
      total: cartTotalElement.textContent,
    };

    // Here you would typically send the order data to your server
    console.log("Order placed:", orderData);

    // Clear the cart and redirect to a thank you page
    localStorage.removeItem("cart");
    alert("Thank you for your order!");
    window.location.href = "/";
  });

  // Initialize the page
  renderCart();
});
