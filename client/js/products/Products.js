const API_URL = '/api/products';
let allProducts = []; 
const user = JSON.parse(localStorage.getItem('user') || '{}');
const isAdmin = user.isAdmin || false;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Lấy keyword từ URL (do searchProducts.js quăng sang)
    const urlParams = new URLSearchParams(window.location.search);
    const keywordFromUrl = urlParams.get('keyword') || ""; 

    // 2. Gọi hàm fetch với keyword này
    // Nếu keyword rỗng, fetchProducts() sẽ lấy hết sản phẩm như bình thường
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
        
        // Nếu không truyền keyword vào hàm, thì lấy từ URL (dành cho lúc vừa nhảy từ trang chủ sang)
        const finalKeyword = keyword || urlParams.get('keyword') || "";
        const category = urlParams.get('category');

        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (finalKeyword) params.append('keyword', finalKeyword);
        
        if (params.toString()) url += `?${params.toString()}`;

        const res = await fetch(url);
        allProducts = await res.json(); 
        handleSortAndRender(); 

        // (Bonus) Hiển thị lại từ khóa lên ô input cho người dùng biết mình đang tìm gì
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
            : '<span class="status in-stock">Còn hàng</span>';

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