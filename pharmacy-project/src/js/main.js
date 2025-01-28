import { products } from "./products.js";

// DOM elements
const cartContainer = document.querySelector(".cart-container");
const cartButton = document.querySelector(".nav-cart-link");
const cartBox = document.querySelector(".cart-box");
const cartItems = document.querySelector(".cart-items");
const cartFooter = document.querySelector(".cart-footer");
const cartCount = document.querySelector(".cart-count");
let cart = [];

// Load cart from localStorage
function loadCart() {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCart();
  }
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Initialize cart functionality
function initializeCart() {
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (target.closest(".nav-cart-link")) {
      event.preventDefault();
      cartBox.classList.toggle("active");
    } else if (
      !target.closest(".cart-box") &&
      !target.closest(".cart-item") &&
      !target.closest(".add-to-cart")
    ) {
      cartBox.classList.remove("active");
    }

    // Add this block to handle removing items from cart
    if (target.classList.contains("remove-from-cart")) {
      const index = Number.parseInt(target.getAttribute("data-index"), 10);
      removeFromCart(index);
    }
  });

  loadCart(); // Load the cart when initializing
}

function updateCart() {
  if (cartItems) {
    cartItems.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      const emptyMessage = document.createElement("div");
      emptyMessage.classList.add("empty-cart-message");
      emptyMessage.textContent = "No items added.";
      cartItems.appendChild(emptyMessage);
    } else {
      cart.forEach((item, index) => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
          <img src="${item.image}" alt="${item.name}" />
          <div class="item-info">
            <h4>${item.name}</h4>
            <span>${item.price} MRO</span>
          </div>
          <button class="remove-from-cart" data-index="${index}">Remove</button>
        `;
        cartItems.appendChild(cartItem);
        total += Number(item.price);
      });
    }

    if (cartFooter) {
      cartFooter.textContent = `Total: ${total.toFixed(2)} MRO`;
    }
    if (cartCount) {
      cartCount.textContent = cart.length;
    }
  }
  saveCart();
}

function addToCart(product, button) {
  cart.push(product);
  updateCart();
  saveCart(); // Add this line to save the cart after adding an item

  if (button) {
    button.classList.add("added");
    setTimeout(() => {
      button.classList.remove("added");
    }, 2000);
  }

  cartBox.classList.add("active");
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
  saveCart(); // Add this line to save the cart after removing an item
}

// Filter state
const filters = {
  category: "All Categories",
  pharmacy: "All Pharmacies",
  form: "All Forms",
  price: "All Prices",
  sort: "Most Popular",
};

function initializeDropdown(menuId, toggleId, itemsId, selectedId, filterType) {
  const menuContainer = document.getElementById(menuId);
  const menuToggle = document.getElementById(toggleId);
  const arrow = menuToggle.querySelector("svg");
  const menuItems = document.getElementById(itemsId);
  const selectedCategory = document.getElementById(selectedId);
  const menuItemElements = menuItems.querySelectorAll(".menu-item");

  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const isExpanded = menuContainer.classList.toggle("expanded");
    arrow.style.transform = isExpanded ? "rotate(180deg)" : "rotate(0deg)";
  });

  menuItemElements.forEach((item) => {
    item.addEventListener("click", () => {
      const category = item.getAttribute("data-category");
      selectedCategory.textContent = category;

      menuItemElements.forEach((i) => i.classList.remove("selected"));
      item.classList.add("selected");
      menuContainer.classList.remove("expanded");
      arrow.style.transform = "rotate(0deg)";

      filters[filterType] = category;
      renderProducts();
    });
  });

  document.addEventListener("click", (e) => {
    if (!menuContainer.contains(e.target)) {
      menuContainer.classList.remove("expanded");
      arrow.style.transform = "rotate(0deg)";
    }
  });
}

function renderProducts() {
  const productGrid = document.querySelector(".product-grid");
  if (!productGrid) return;

  productGrid.innerHTML = "";

  const searchQuery = document.querySelector(".the-photo").value.toLowerCase();
  const filteredProducts = products.filter(
    (product) =>
      (filters.category === "All Categories" ||
        product.category === filters.category) &&
      (filters.pharmacy === "All Pharmacies" ||
        product.pharmacy === filters.pharmacy) &&
      (filters.form === "All Forms" || product.form === filters.form) &&
      (filters.price === "All Prices" ||
        isPriceInRange(product.price, filters.price)) &&
      (searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery) ||
        product.pharmacy.toLowerCase().includes(searchQuery) ||
        product.category.toLowerCase().includes(searchQuery) ||
        product.form.toLowerCase().includes(searchQuery) ||
        product.price.toString().includes(searchQuery))
  );

  // Apply sorting
  if (filters.sort === "Newest first") {
    filteredProducts.reverse();
  } else if (filters.sort === "Price: Low to High") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (filters.sort === "Price: High to Low") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  if (filteredProducts.length === 0) {
    // No items found, display message
    const noItemsMessage = document.createElement("div");
    noItemsMessage.className = "no-items-message";
    noItemsMessage.textContent = "No items found.";
    productGrid.appendChild(noItemsMessage);
  } else {
    // Items found, display them
    filteredProducts.forEach((product) => {
      const productCard = createProductCard(product);
      productGrid.appendChild(productCard);
    });
  }

  initializeAddToCartButtons();
}

function isPriceInRange(price, range) {
  switch (range) {
    case "0-50":
      return price >= 0 && price <= 50;
    case "50-100":
      return price > 50 && price <= 100;
    case "100-200":
      return price > 100 && price <= 200;
    case "200-500":
      return price > 200 && price <= 500;
    case "500+":
      return price > 500;
    default:
      return true;
  }
}

function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.innerHTML = `
    <img src="${product.image}" class="product-image" alt="${product.name}">
    <button class="add-to-cart" aria-label="Add to cart" data-product-id="${product.id}">
      <svg viewBox="0 0 24 24">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </button>
    <h2 class="product-name">${product.name}</h2>
    <p class="product-description">${product.pharmacy}</p>
    <p class="product-price">${product.price} MRO</p>
  `;
  return card;
}

function initializeAddToCartButtons() {
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const productId = e.currentTarget.getAttribute("data-product-id");
      const product = products.find((p) => p.id === Number(productId));
      if (product) {
        addToCart(product, button);
      }
    });
  });
}

// Initialize dropdowns
function initializeDropdowns() {
  const dropdowns = [
    {
      id: "menu1",
      toggle: "menuToggle1",
      items: "menuItems1",
      selected: "selectedCategory1",
      type: "category",
    },
    {
      id: "menu2",
      toggle: "menuToggle2",
      items: "menuItems2",
      selected: "selectedCategory2",
      type: "pharmacy",
    },
    {
      id: "menu3",
      toggle: "menuToggle3",
      items: "menuItems3",
      selected: "selectedCategory3",
      type: "form",
    },
    {
      id: "menu4",
      toggle: "menuToggle4",
      items: "menuItems4",
      selected: "selectedCategory4",
      type: "price",
    },
    {
      id: "menu5",
      toggle: "menuToggle5",
      items: "menuItems5",
      selected: "selectedCategory5",
      type: "sort",
    },
  ];

  dropdowns.forEach((dropdown) => {
    if (document.getElementById(dropdown.id)) {
      initializeDropdown(
        dropdown.id,
        dropdown.toggle,
        dropdown.items,
        dropdown.selected,
        dropdown.type
      );
    }
  });
}

// Add this function to initialize the search functionality
function initializeSearch() {
  const searchInput = document.querySelector(".the-photo");
  searchInput.addEventListener("input", renderProducts);
}

// Main initialization
document.addEventListener("DOMContentLoaded", () => {
  initializeCart(); // This now includes loading the cart from local storage and setting up the remove event listener
  initializeDropdowns();
  initializeSearch();
  renderProducts();

  // Remove this block as it's now handled in initializeCart
  // document.addEventListener("click", (event) => {
  //   if (event.target.classList.contains("remove-from-cart")) {
  //     const index = Number.parseInt(
  //       event.target.getAttribute("data-index"),
  //       10
  //     );
  //     removeFromCart(index);
  //   }
  // });
});
