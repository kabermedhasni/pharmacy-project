const cartContainer = document.querySelector(".cart-container");
const cartButton = document.querySelector(".nav-cart-link");
const cartBox = document.querySelector(".cart-box");

cartButton.addEventListener("click", () => {
  cartBox.classList.toggle("active");
});



// Close cart if user clicks outside
document.addEventListener("click", (event) => {
  if (!cartBox.contains(event.target) && !cartButton.contains(event.target)) {
    cartBox.classList.remove("active");
  }
});

function initializeDropdown(menuId, toggleId, itemsId, selectedId) {
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
    });
  });

  document.addEventListener("click", (e) => {
    if (!menuContainer.contains(e.target)) {
      menuContainer.classList.remove("expanded");
      arrow.style.transform = "rotate(0deg)";
    }
  });
}

initializeDropdown("menu1", "menuToggle1", "menuItems1", "selectedCategory1");
initializeDropdown("menu2", "menuToggle2", "menuItems2", "selectedCategory2");
initializeDropdown("menu3", "menuToggle3", "menuItems3", "selectedCategory3");
initializeDropdown("menu4", "menuToggle4", "menuItems4", "selectedCategory4");
initializeDropdown("menu5", "menuToggle5", "menuItems5", "selectedCategory5");

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

// Header scroll effect
const header = document.querySelector(".header");
let lastScrollTop = 0;

window.addEventListener("scroll", () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop && scrollTop > 5) {
    header.classList.add("scrolled");
  } else if (scrollTop <= 5) {
    header.classList.remove("scrolled");
  }

  lastScrollTop = scrollTop;
});