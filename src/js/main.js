import { products } from "./products.js";

const PRODUCTS_PER_PAGE = 20;
let currentPage = 1;
let filteredProducts = [];

// Add these variables at the top of the file with other DOM element selections
const cartBox = document.querySelector(".cart-box");
const cartScrollIndicator = document.querySelector(".cart-scroll-indicator");

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

function addTransitionEffect(productCard, index) {
  setTimeout(() => {
    productCard.classList.add("revealed-products");
  }, index * 50); // Stagger the animation for each card
}

function filterProducts(searchTerm) {
  filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  renderProducts();
}

// DOM elements
const cartContainer = document.querySelector(".cart-container");
const cartButton = document.querySelector(".nav-cart-link");
const cartItems = document.querySelector(".cart-items");
const cartFooter = document.querySelector(".cart-footer");
const cartCount = document.querySelector(".cart-count");
const checkoutButton = document.getElementById("checkout-button");
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

// Add this function to update the cart scroll indicator
function updateCartScrollIndicator() {
  if (!cartBox || !cartScrollIndicator) return;

  const cartItems = cartBox.querySelector(".cart-items");
  if (!cartItems) return;

  const scrollPercentage =
    (cartItems.scrollTop / (cartItems.scrollHeight - cartItems.clientHeight)) *
    100;
  cartScrollIndicator.style.height = `${scrollPercentage}%`;

  if (cartItems.scrollHeight > cartItems.clientHeight) {
    cartScrollIndicator.classList.add("visible");
  } else {
    cartScrollIndicator.classList.remove("visible");
  }
}

// Modify the updateCart function to initialize and update the scroll indicator
function updateCart() {
  if (cartItems) {
    cartItems.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      cartItems.classList.add("empty-cart");

      const emptyMessage = document.createElement("div");
      emptyMessage.classList.add("empty-cart-message");
      emptyMessage.textContent = "No items added.";
      cartItems.appendChild(emptyMessage);
      checkoutButton.disabled = true;
    } else {
      cartItems.classList.remove("empty-cart");
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
      checkoutButton.disabled = false;
    }

    const cartTotal = cartFooter.querySelector(".cart-total");
    if (cartTotal) {
      cartTotal.textContent = `Total: ${total.toFixed(2)} MRO`;
    }
    if (cartCount) {
      cartCount.textContent = cart.length;
    }

    // Update the cart scroll indicator
    updateCartScrollIndicator();
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
  const loadingSpinner = document.querySelector(".loading-spinner");
  if (!productGrid || !loadingSpinner) return;

  // Show loading spinner
  document.body.classList.add("loading");

  // Simulate network delay
  setTimeout(() => {
    productGrid.innerHTML = "";

    const searchQuery = document
      .querySelector(".the-photo")
      .value.toLowerCase();
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
      // Items found, display them with pagination
      const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
      const endIndex = startIndex + PRODUCTS_PER_PAGE;
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

      paginatedProducts.forEach((product, index) => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
        addTransitionEffect(productCard, index);
      });

      // Create pagination controls
      createPaginationControls(filteredProducts.length, productGrid);
    }

    initializeAddToCartButtons();

    // Hide loading spinner
    document.body.classList.remove("loading");
  }, 1000); // Simulate 1 second delay
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

function createPaginationControls(totalProducts, productGrid) {
  // Remove existing pagination if any
  const existingPagination = document.querySelector(".pagination-container");
  if (existingPagination) {
    existingPagination.remove();
  }

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  const paginationContainer = document.createElement("div");
  paginationContainer.className = "pagination-container";

  // Previous page button
  const prevButton = document.createElement("button");
  prevButton.textContent = "Previous";
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderProducts();
      window.scrollTo({ top: productGrid.offsetTop - 100, behavior: "smooth" });
    }
  });
  paginationContainer.appendChild(prevButton);

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.addEventListener("click", () => {
      currentPage = i;
      renderProducts();
      window.scrollTo({ top: productGrid.offsetTop - 100, behavior: "smooth" });
    });
    if (i === currentPage) {
      pageButton.classList.add("active");
    }
    paginationContainer.appendChild(pageButton);
  }

  // Next page button
  const nextButton = document.createElement("button");
  nextButton.textContent = "Next";
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderProducts();
      window.scrollTo({ top: productGrid.offsetTop - 100, behavior: "smooth" });
    }
  });
  paginationContainer.appendChild(nextButton);

  // Append pagination controls after the product grid
  productGrid.insertAdjacentElement("afterend", paginationContainer);
}

// Modify the initializeCart function to set up the scroll indicator
function initializeCart() {
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (target.closest(".nav-cart-link")) {
      event.preventDefault();
      cartBox.classList.toggle("active");
      updateCartScrollIndicator(); // Update scroll indicator when opening the cart
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

  checkoutButton.addEventListener("click", () => {
    if (cart.length > 0) {
      window.location.href =
        "https://kabermedhasni.github.io/pharmacy-project/checkout.html";
    }
  });

  loadCart(); // Load the cart when initializing

  // Ensure cart footer is properly initialized
  if (cartFooter) {
    if (!cartFooter.querySelector(".cart-total")) {
      const cartTotal = document.createElement("div");
      cartTotal.classList.add("cart-total");
      cartFooter.insertBefore(cartTotal, checkoutButton);
    }
  }

  // Initialize the cart scroll indicator
  updateCartScrollIndicator();

  // Add scroll event listener to cart items container
  const cartItemsContainer = cartBox.querySelector(".cart-items");
  if (cartItemsContainer) {
    cartItemsContainer.addEventListener("scroll", updateCartScrollIndicator);
  }
}

// Main initialization
document.addEventListener("DOMContentLoaded", () => {
  initializeCart();
  initializeDropdowns();
  initializeSearch();

  // Add loading spinner to the DOM
  const loadingSpinner = document.createElement("div");
  loadingSpinner.className = "loading-spinner";
  document
    .querySelector(".product-grid")
    .insertAdjacentElement("beforebegin", loadingSpinner);

  renderProducts();
});

/* background */

const bubbles = document.querySelectorAll(".bubble");
const maxSize = 300;
const minSize = 100;

function getRandomPosition() {
  return {
    x: Math.random() * (window.innerWidth - maxSize),
    y: Math.random() * (window.innerHeight - maxSize),
  };
}

function getRandomSize() {
  return Math.random() * (maxSize - minSize) + minSize;
}

function getRandomDuration() {
  return Math.random() * 5000 + 50000; // 10-15 seconds
}

function getRandomDeformation() {
  const baseShape = "50%";
  const maxDeform = 20;
  return `${baseShape} ${baseShape} ${50 - Math.random() * maxDeform}% ${
    50 + Math.random() * maxDeform
  }% / ${50 + Math.random() * maxDeform}% ${
    50 - Math.random() * maxDeform
  }% ${baseShape} ${baseShape}`;
}

function moveBubble(bubble) {
  const targetPos = getRandomPosition();
  const targetSize = getRandomSize();
  const duration = getRandomDuration();
  const deformation = getRandomDeformation();

  bubble.style.transition = `transform ${duration}ms cubic-bezier(0.25, 0.1, 0.25, 1), width ${duration}ms cubic-bezier(0.25, 0.1, 0.25, 1), height ${duration}ms cubic-bezier(0.25, 0.1, 0.25, 1), border-radius ${duration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
  bubble.style.transform = `translate(${targetPos.x}px, ${targetPos.y}px)`;
  bubble.style.width = `${targetSize}px`;
  bubble.style.height = `${targetSize}px`;
  bubble.style.borderRadius = deformation;

  setTimeout(() => moveBubble(bubble), duration);
}

bubbles.forEach((bubble, index) => {
  const startPos = getRandomPosition();
  const startSize = getRandomSize();
  const startDeformation = getRandomDeformation();

  // Set initial position, size, and shape
  bubble.style.transform = `translate(${startPos.x}px, ${startPos.y}px)`;
  bubble.style.width = "0px"; // Start at size 0
  bubble.style.height = "0px"; // Start at size 0
  bubble.style.borderRadius = startDeformation;

  // Delay and duration adjustments
  const initialDelay = index * 1000; // Adjust this for staggered timing (700ms between each bubble)
  const scalingDuration = 8000; // Duration for scaling up (8 seconds)

  setTimeout(() => {
    bubble.style.opacity = "0.8"; // Fade in
    bubble.style.transition = `width ${scalingDuration}ms ease, height ${scalingDuration}ms ease, border-radius ${scalingDuration}ms ease`;
    bubble.style.width = `${startSize}px`; // Scale to target size
    bubble.style.height = `${startSize}px`; // Scale to target size

    // Start the dynamic movement after the initial scaling animation
    setTimeout(() => moveBubble(bubble), scalingDuration);
  }, initialDelay); // Apply staggered delay for each bubble
});

/* background over */

// Custom scrollbar functionality
const customScrollbar = document.getElementById("customScrollbar");
let isScrolling;

function updateScrollbar() {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;

  customScrollbar.style.height = `${scrollPercentage}%`;
  customScrollbar.classList.add("visible");

  clearTimeout(isScrolling);
  isScrolling = setTimeout(() => {
    customScrollbar.classList.remove("visible");
  }, 1000);
}

window.addEventListener("scroll", updateScrollbar);
window.addEventListener("resize", updateScrollbar);

// Add an event listener for the cart box scroll
cartBox.addEventListener("scroll", updateCartScrollIndicator);
