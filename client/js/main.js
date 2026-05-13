let selectedSort = "default";
import { getProducts } from "./api/productAPI.js";
import { renderProducts } from "./products/renderProducts.js";
import { searchProducts } from "./products/searchProducts.js";

let allProducts = [];

let selectedCategory = "all";
let selectedPrice = "all";
let selectedBrand = "all";
let searchKeyword = "";

async function loadProducts() {
    allProducts = await getProducts();

    renderBrandOptions(allProducts);
    renderMenuDetail("mouse");
    applyFilters();
}

loadProducts();

/* SEARCH */

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

function handleSearch() {
    searchKeyword = searchInput.value.trim();
    applyFilters();
}

searchInput.addEventListener("input", handleSearch);
searchBtn.addEventListener("click", handleSearch);

function getCategoryProducts() {
    if (selectedCategory === "all") {
    return allProducts;
    }

    return allProducts.filter(product => {
    return product.category?.toLowerCase() === selectedCategory;
    });
}

function renderBrandOptions(products) {
    const brands = [
    ...new Set(
        products
        .map(product => product.brand)
        .filter(brand => brand)
    )
    ];

    brandFilter.innerHTML = `<option value="all">All Brand</option>`;

    brands.forEach(brand => {
    brandFilter.innerHTML += `
        <option value="${brand}">
        ${brand}
        </option>
    `;
    });

    brandFilter.value = selectedBrand;
}

function applyFilters() {
    let result = [...allProducts];

    if (selectedCategory !== "all") {
    result = result.filter(product => {
        return product.category?.toLowerCase() === selectedCategory;
    });
    }

    if (selectedBrand !== "all") {
    result = result.filter(product => {
        return product.brand === selectedBrand;
    });
    }

    if (selectedPrice !== "all") {
    const [min, max] = selectedPrice.split("-").map(Number);

    result = result.filter(product => {
        return Number(product.price) >= min && Number(product.price) <= max;
    });
    }

    if (searchKeyword !== "") {
    result = searchProducts(result, searchKeyword);
    }
    /* SORT */
    if (selectedSort === "price-asc") {
        result.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (selectedSort === "price-desc") {
        result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    if (selectedSort === "name-asc") {
        result.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (selectedSort === "newest") {
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    renderProducts(result);
}
/* SORT */
const sortSelect = document.getElementById("sortSelect");

if (sortSelect) {
  sortSelect.addEventListener("change", () => {
    selectedSort = sortSelect.value;
    applyFilters();
  });
}

/* CLICK CATEGORY CARD */

const categoryCards = document.querySelectorAll(".simple-card");

categoryCards.forEach(card => {
    card.addEventListener("click", () => {
    selectedCategory = card.dataset.category;
    selectedBrand = "all";

    categoryFilter.value = selectedCategory;

    const categoryProducts = getCategoryProducts();
    renderBrandOptions(categoryProducts);

    applyFilters();
    });
});

/* MEGA MENU PRODUCT */

const productMenuBtn = document.getElementById("productMenuBtn");
const megaMenu = document.getElementById("megaMenu");
const menuDetail = document.getElementById("menuDetail");
const menuItems = document.querySelectorAll(".menu-item");

const categoryDetails = {
    mouse: {
    title: "Mouse",
    brands: ["Logitech", "Razer", "DareU", "SteelSeries", "Corsair", "Rapoo"]
    },

    keyboard: {
    title: "Keyboard",
    brands: ["Akko", "Keychron", "DareU", "Logitech", "Razer", "Corsair"]
    },

    headphone: {
    title: "Headphone",
    brands: ["Sony", "HyperX", "Razer", "Logitech", "SteelSeries", "JBL"]
    },

    micro: {
    title: "Micro",
    brands: ["Fifine", "HyperX", "Razer", "Boya", "Maono", "Shure"]
    },

    other: {
    title: "Other",
    brands: ["Asus", "Kingston", "Samsung", "Adata", "Cooler Master", "MSI"]
    }
};

function renderMenuDetail(group) {
    const data = categoryDetails[group];

    menuDetail.innerHTML = `
    <div class="menu-detail-title">
        <h2>${data.title}</h2>
        <p>Choose brand</p>
    </div>
    `;

    data.brands.forEach(brand => {  
        menuDetail.innerHTML += `
        <div
        class="detail-box"
        data-category="${group}"
        data-brand="${brand}"
        >
        ${brand}
        </div>
    });

    const detailBoxes = document.querySelectorAll(".detail-box");
    detailBoxes.forEach(box => {
    box.addEventListener("click", () => {
        selectedCategory = box.dataset.category;
        selectedBrand = box.dataset.brand;
        categoryFilter.value = selectedCategory;
        const categoryProducts = getCategoryProducts();
        renderBrandOptions(categoryProducts);
        brandFilter.value = selectedBrand;
        applyFilters();
        megaMenu.classList.remove("show");
    });
    });
}

productMenuBtn.addEventListener("mouseenter", () => {
    renderMenuDetail("mouse");
});

menuItems.forEach(item => {
    item.addEventListener("mouseenter", () => {
    menuItems.forEach(menuItem => {
        menuItem.classList.remove("active");
    });
    item.classList.add("active");
    const group = item.dataset.group;
    renderMenuDetail(group);
    });
});

/*ADMIN CHECK*/
const adminLink =
document.getElementById("adminLink");

const user =
JSON.parse(localStorage.getItem("user"));

if (user && user.role === "admin") {

  adminLink.style.display = "block";

}