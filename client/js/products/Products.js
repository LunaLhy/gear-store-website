const API_URL = '/api/products';
let allProducts = []; 
const user = JSON.parse(localStorage.getItem('user') || '{}');
const isAdmin = user.isAdmin || false;

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const keywordFromUrl = urlParams.get('keyword') || ""; 

    fetchProducts(keywordFromUrl); 

    // Các logic khác như Sort...
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSortAndRender);
    }
});

// Thêm export để search.js xài được
export async function fetchProducts(keyword = "") {
    try {
        let url = API_URL;
        const urlParams = new URLSearchParams(window.location.search);
        
        const finalKeyword = keyword || urlParams.get('keyword') || "";
        const category = urlParams.get('category');

        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (finalKeyword) params.append('keyword', finalKeyword);
        
        if (params.toString()) url += `?${params.toString()}`;

        const res = await fetch(url);
        allProducts = await res.json(); 
        handleSortAndRender(); 

        const searchInput = document.getElementById('searchInput');
        if (searchInput && finalKeyword) searchInput.value = finalKeyword;

    } catch (error) {
        console.error("Lỗi fetch:", error);
    }
}

function handleSortAndRender() {
    const sortSelect = document.getElementById('sortSelect');
    const sortType = sortSelect ? sortSelect.value : 'default';
    let sortedProducts = [...allProducts];

    if (sortType === 'price-asc') {
        sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortType === 'price-desc') {
        sortedProducts.sort((a, b) => b.price - a.price);
    } else if (sortType === 'name-asc') {
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    }

    renderProducts(sortedProducts);
}

function renderProducts(products) {
    const container = document.getElementById('productContainer');
    if (!container) return;

    if (products.length === 0) {
        container.innerHTML = '<p class="empty-message">San pham khong ton tai</p>';
        return;
    }

    container.innerHTML = products.map(product => {
        const isOutOfStock = product.countInStock <= 0;
        const stockStatus = isOutOfStock 
            ? '<span class="status out-of-stock">Out of stock</span>' 
            : '<span class="status in-stock">In stock</span>';

        const adminButton = isAdmin ? `
            <button class="btn-manage" onclick="goToManagePage('${product._id}')">
                <i class="fa-solid fa-gear"></i> Quản lý
            </button>` : '';

        return `
            <div class="product-card">
                <div class="product-img">
                    ${stockStatus} 
                    <img src="${product.image}" 
                        onerror="this.src='https://placehold.co/600x400/2f3542/ffffff?text=GearStore'"
                        alt="${product.name}">
                </div>
                <div class="product-info">
                    <span class="brand-name">${product.brand}</span>
                    <h3>${product.name}</h3>
                    <p class="price">${product.price.toLocaleString('vi-VN')} đ</p>
                    <div class="product-actions">
                        <button class="btn-buy" ${isOutOfStock ? 'disabled' : ''}>
                            <i class="fa-solid fa-cart-shopping"></i> Mua ngay
                        </button>
                        ${adminButton}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

window.goToManagePage = function(id) {
    window.location.href = `editProduct.html?id=${id}`;
};