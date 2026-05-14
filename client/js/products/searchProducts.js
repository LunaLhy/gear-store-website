import { fetchProducts } from './products.js';

document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');

    if (searchBtn && searchInput) {
        const handleSearch = () => {
            const keyword = searchInput.value.trim();
            
            // Kiểm tra xem có đang ở trang products.html hay không
            const isProductPage = window.location.pathname.includes('products.html');

            if (isProductPage) {
                // Nếu đang ở trang products -> Gọi hàm fetch để lọc luôn
                fetchProducts(keyword);
            } else {
                // Nếu đang ở trang chủ (index.html) -> Chuyển hướng sang trang products kèm keyword
                if (keyword) {
                    window.location.href = `products.html?keyword=${encodeURIComponent(keyword)}`;
                } else {
                    window.location.href = `products.html`;
                }
            }
        };

        searchBtn.addEventListener('click', handleSearch);

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }
});