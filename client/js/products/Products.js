const API_PRODUCT_URL = '/api/products';
let allProducts = [];

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  document.getElementById('sortSelect')?.addEventListener('change', renderSortedProducts);
});

async function loadProducts() {
  const params = new URLSearchParams(window.location.search);
  const keyword = params.get('keyword') || '';
  const category = params.get('category') || '';
  const query = new URLSearchParams();

  if (keyword) query.set('keyword', keyword);
  if (category) query.set('category', category);

  try {
    const response = await fetch(`${API_PRODUCT_URL}${query.toString() ? `?${query}` : ''}`);
    allProducts = await response.json();
    syncPageTitle(category, keyword);
    renderSortedProducts();
    const searchInput = document.getElementById('searchInput');
    if (searchInput && keyword) searchInput.value = keyword;
  } catch (error) {
    console.error('Load products error:', error);
    renderProducts([]);
  }
}

function syncPageTitle(category, keyword) {
  const title = document.getElementById('productTitle');
  if (!title) return;
  title.textContent = keyword ? `Search: ${keyword}` : category || 'All Products';
}

function renderSortedProducts() {
  const sortType = document.getElementById('sortSelect')?.value || 'default';
  const products = [...allProducts];

  const sorters = {
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    'name-asc': (a, b) => a.name.localeCompare(b.name)
  };

  if (sorters[sortType]) products.sort(sorters[sortType]);
  renderProducts(products);
}

function renderProducts(products) {
  const container = document.getElementById('productContainer');
  if (!container) return;

  if (!products.length) {
    container.innerHTML = '<p class="empty-message">Product not found</p>';
    return;
  }

  container.innerHTML = products.map(createProductCard).join('');
}

function createProductCard(product) {
  const isOut = product.countInStock <= 0;
  const status = isOut
    ? '<span class="status out-of-stock">Out of stock</span>'
    : '<span class="status in-stock">In stock</span>';

  return `
    <div class="product-card">
      <div class="product-click-area" onclick="goToProductDetail('${product._id}')">
        <div class="product-img">
          ${status}
          <img src="${product.image}" alt="${product.name}" onerror="this.src='https://placehold.co/600x400/2f3542/ffffff?text=GearStore'" />
        </div>
        <div class="product-info">
          <span class="brand-name">${product.brand}</span>
          <h3>${product.name}</h3>
          <p class="price">${formatPrice(product.price)}</p>
        </div>
      </div>
      <div class="product-actions">
        <button class="btn-buy" ${isOut ? 'disabled' : ''}><i class="fa-solid fa-cart-shopping"></i> Add to Cart</button>
      </div>
    </div>`;
}

function formatPrice(price) {
  return `${Number(price || 0).toLocaleString('vi-VN')} đ`;
}

window.goToProductDetail = (id) => {
  window.location.href = `productDetail.html?id=${id}`;
};
