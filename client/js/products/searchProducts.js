// Bỏ fetchProducts ở đây nếu bạn không muốn gọi trực tiếp
document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');

    const handleSearch = () => {
        const keyword = searchInput.value.trim();
        
        // Luôn luôn ép trình duyệt chuyển hướng/reload về trang products
        // Thêm dấu / ở đầu là "chìa khóa" để đồng bộ đường dẫn
        if (keyword) {
            window.location.href = `/products.html?keyword=${encodeURIComponent(keyword)}`;
        } else {
            window.location.href = `/products.html`;
        }
    };

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleSearch();
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
            }
        });
    }
});