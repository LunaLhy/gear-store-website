function renderProducts(products) {
    const container = document.getElementById('productContainer');
    if (!container) return;

    if (products.length === 0) {
        container.innerHTML = '<p class="no-products">Không có sản phẩm nào.</p>';
        return;
    }

    container.innerHTML = products.map(product => {
        // Chỉ xuất hiện nút Quản lý nếu hệ thống nhận diện đúng là Admin
        const adminButton = isAdmin ? `
            <button class="btn-manage" onclick="goToManagePage('${product._id}')">
                <i class="fa-solid fa-gear"></i> Quản lý sản phẩm
            </button>
        ` : '';

        return `
            <div class="product-card">
                <img src="${product.image || 'https://via.placeholder.com/150'}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="brand">${product.brand}</p>
                    <p class="price">${product.price.toLocaleString('vi-VN')} đ</p>
                    ${adminButton} 
                </div>
            </div>
        `;
    }).join('');
}

// Chuyển hướng sang một Route riêng để Chỉnh sửa/Xóa
window.goToManagePage = function(id) {
    window.location.href = `editProduct.html?id=${id}`;
}