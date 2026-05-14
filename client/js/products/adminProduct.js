const API_URL = 'http://localhost:5000/api/products';

// Lấy thông tin user và token đã lưu khi Đăng Nhập
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');
const isAdmin = user.isAdmin || false;

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();

    // Hiện nút Admin trên thanh điều hướng nếu là Admin
    const adminLink = document.getElementById('adminLink');
    if (adminLink && isAdmin) {
        adminLink.style.display = 'inline-block';
    }
});

// 1. Hàm lấy danh sách sản phẩm từ Backend (API GET)
async function fetchProducts() {
    try {
        // Kiểm tra xem trên URL có query lọc category không (ví dụ: ?category=keyboard)
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        
        let fetchUrl = API_URL;
        if (category) {
            fetchUrl += `?category=${category}`;
        }

        const res = await fetch(fetchUrl);
        const products = await res.json();
        renderProducts(products);
    } catch (error) {
        console.error('Lỗi lấy sản phẩm:', error);
    }
}

// 2. Hàm hiển thị sản phẩm lên HTML
function renderProducts(products) {
    const container = document.getElementById('productContainer');
    if (!container) return;

    if (products.length === 0) {
        container.innerHTML = '<p class="no-products">Không có sản phẩm nào phù hợp.</p>';
        return;
    }

    container.innerHTML = products.map(product => {
        // Nếu là Admin thì sinh thêm cụm nút Sửa / Xóa cho Quốc Jack quản lý
        const adminControls = isAdmin ? `
            <div class="admin-actions">
                <button class="btn-edit" onclick="editProduct('${product._id}')">
                    <i class="fa-solid fa-pen-to-square"></i> Sửa
                </button>
                <button class="btn-delete" data-id="${product._id}">
                    <i class="fa-solid fa-trash"></i> Xóa
                </button>
            </div>
        ` : '';

        return `
            <div class="product-card">
                <img src="${product.image || 'https://via.placeholder.com/150'}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="brand">${product.brand}</p>
                    <p class="price">${product.price.toLocaleString('vi-VN')} đ</p>
                    ${adminControls}
                </div>
            </div>
        `;
    }).join('');

    // Gán sự kiện cho các nút Xóa vừa tạo
    if (isAdmin) {
        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.closest('.btn-delete').getAttribute('data-id');
                deleteProductHandler(productId);
            });
        });
    }
}

// 3. Hàm xử lý XÓA SẢN PHẨM (API DELETE trực tiếp)
async function deleteProductHandler(id) {
    if (confirm('Quốc Jack ơi, bạn có chắc chắn muốn xóa sản phẩm này không?')) {
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await res.json();

            if (res.ok) {
                alert(data.message);
                fetchProducts(); // Tải lại danh sách sau khi xóa thành công
            } else {
                alert(data.message || 'Lỗi khi xóa sản phẩm');
            }
        } catch (error) {
            alert('Không thể kết nối đến server!');
        }
    }
}

// 4. Hàm điều hướng sang trang SỬA SẢN PHẨM (API PUT)
window.editProduct = function(id) {
    // Chuyển sang trang editProduct.html và kèm theo id sản phẩm trên URL
    window.location.href = `editProduct.html?id=${id}`;
}