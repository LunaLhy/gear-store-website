const API_PRODUCT_URL = '/api/products';
const productId = new URLSearchParams(window.location.search).get('id');
let images = [];
let currentIndex = 0;
let currentProduct = null;

const els = {
  mainImage: document.getElementById('mainImage'),
  thumbnails: document.getElementById('thumbnailList'),
  name: document.getElementById('productName'),
  brand: document.getElementById('productBrand'),
  price: document.getElementById('productPrice'),
  stock: document.getElementById('productStock'),
  description: document.getElementById('productDescription'),
  category: document.getElementById('productCategory'),
  addCart: document.getElementById('addCartBtn'),
  buyNow: document.getElementById('buyNowBtn'),
  prev: document.getElementById('prevImageBtn'),
  next: document.getElementById('nextImageBtn')
};

if (!productId) redirectToProducts('Product not found');

document.addEventListener('DOMContentLoaded', loadProductDetail);
els.prev?.addEventListener('click', () => moveImage(-1));
els.next?.addEventListener('click', () => moveImage(1));

async function loadProductDetail() {
  try {
    const response = await fetch(`${API_PRODUCT_URL}/${productId}`);
    if (!response.ok) throw new Error('Cannot load product detail');
    currentProduct = await response.json();
    renderProduct(currentProduct);
  } catch (error) {
    console.error(error);
    redirectToProducts('Cannot load product detail');
  }
}

function renderProduct(product) {
  const isOut = product.countInStock <= 0;
  images = [product.image, ...(product.images || [])].filter(Boolean);
  currentIndex = 0;

  els.name.textContent = product.name;
  els.brand.textContent = product.brand;
  els.price.textContent = formatPrice(product.price);
  els.description.textContent = product.description;
  els.category.textContent = product.category;
  els.stock.textContent = isOut ? 'Out of stock' : `In stock: ${product.countInStock}`;
  els.stock.className = `stock-detail ${isOut ? 'out-stock-detail' : 'in-stock-detail'}`;
  els.addCart.disabled = isOut;
  els.buyNow.disabled = isOut;
  els.addCart.onclick = () => console.log('Add to cart:', product._id);
  els.buyNow.onclick = () => window.location.href = `checkout.html?id=${product._id}`;

  renderImages();
}

function renderImages() {
  els.mainImage.src = images[currentIndex] || '';
  els.thumbnails.innerHTML = images.map((src, index) => `
    <img src="${src}" alt="Product thumbnail" class="${index === currentIndex ? 'active' : ''}" onclick="changeImage(${index})" />
  `).join('');
  const showArrows = images.length > 1;
  els.prev.style.display = showArrows ? 'block' : 'none';
  els.next.style.display = showArrows ? 'block' : 'none';
}

function moveImage(step) {
  if (!images.length) return;
  currentIndex = (currentIndex + step + images.length) % images.length;
  renderImages();
}

window.changeImage = (index) => {
  currentIndex = index;
  renderImages();
};

function formatPrice(price) {
  return `${Number(price || 0).toLocaleString('vi-VN')} đ`;
}

function redirectToProducts(message) {
  alert(message);
  window.location.href = 'products.html';
}
