const API_PRODUCT_URL = '/api/products';
const token = localStorage.getItem('token');
const tableBody = document.getElementById('productTableBody');
const toast = document.getElementById('toast');
let products = [];
let addModal;
let editModal;

class ProductModal {
  constructor(id, mode, onSubmit) {
    this.root = document.getElementById(id);
    this.mode = mode;
    this.onSubmit = onSubmit;
    this.images = [];
    this.index = 0;
    this.build();
  }

  build() {
    const template = document.getElementById('productModalTemplate');
    this.root.appendChild(template.content.cloneNode(true));
    this.form = this.root.querySelector('.product-form');
    this.title = this.root.querySelector('.modal-title');
    this.saveBtn = this.root.querySelector('.save-btn');
    this.preview = this.root.querySelector('.preview-image');
    this.previewText = this.root.querySelector('.preview-text');
    this.thumbs = this.root.querySelector('.modal-thumbnail-list');
    this.root.querySelector('.close-btn').addEventListener('click', () => this.close());
    this.root.querySelector('.prev').addEventListener('click', () => this.move(-1));
    this.root.querySelector('.next').addEventListener('click', () => this.move(1));
    this.root.addEventListener('click', (e) => { if (e.target === this.root) this.close(); });
    this.form.image.addEventListener('input', () => this.refreshPreview());
    this.form.images.addEventListener('input', () => this.refreshPreview());
    this.form.addEventListener('submit', (e) => this.submit(e));
  }

  open(product = {}) {
    this.form.reset();
    this.title.textContent = this.mode === 'add' ? 'Add Product' : 'Edit Product';
    this.saveBtn.textContent = this.mode === 'add' ? 'Add Product' : 'Save Changes';
    this.setForm(product);
    this.index = 0;
    this.refreshPreview();
    this.root.classList.add('show');
  }

  close() { this.root.classList.remove('show'); }

  setForm(product) {
    const fields = ['id', 'name', 'brand', 'image', 'price', 'description', 'category', 'countInStock'];
    fields.forEach(field => {
      if (this.form[field]) this.form[field].value = product[field === 'id' ? '_id' : field] ?? '';
    });
    this.form.images.value = (product.images || []).join('\n');
  }

  getData() {
    const images = this.form.images.value.split('\n').map(v => v.trim()).filter(Boolean);
    return {
      name: this.form.name.value.trim(),
      brand: this.form.brand.value.trim(),
      image: this.form.image.value.trim(),
      images,
      price: Number(this.form.price.value),
      description: this.form.description.value.trim(),
      category: this.form.category.value,
      countInStock: Number(this.form.countInStock.value)
    };
  }

  refreshPreview() {
    const main = this.form.image.value.trim();
    const extra = this.form.images.value.split('\n').map(v => v.trim()).filter(Boolean);
    this.images = main ? [main, ...extra] : extra;
    if (this.index >= this.images.length) this.index = 0;

    if (!this.images.length) {
      this.preview.src = '';
      this.preview.style.display = 'none';
      this.previewText.style.display = 'block';
      this.previewText.textContent = 'Image preview';
      this.thumbs.innerHTML = '';
      return;
    }

    this.preview.src = this.images[this.index];
    this.preview.style.display = 'block';
    this.previewText.style.display = 'none';
    this.thumbs.innerHTML = this.images.map((src, index) => `
      <img src="${src}" class="${index === this.index ? 'active' : ''}" data-index="${index}" />
    `).join('');
    this.thumbs.querySelectorAll('img').forEach(img => {
      img.addEventListener('click', () => {
        this.index = Number(img.dataset.index);
        this.refreshPreview();
      });
    });
  }

  move(step) {
    if (!this.images.length) return;
    this.index = (this.index + step + this.images.length) % this.images.length;
    this.refreshPreview();
  }

  async submit(e) {
    e.preventDefault();
    await this.onSubmit(this.getData(), this.form.id.value);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  addModal = new ProductModal('addModal', 'add', createProduct);
  editModal = new ProductModal('editModal', 'edit', updateProduct);
  document.getElementById('openAddModalBtn').addEventListener('click', () => addModal.open());
  loadProducts();
});

function isAdminUser() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  return user && (user.role === 'admin' || user.isAdmin === true || user.isAdmin === 'true');
}

if (!isAdminUser()) {
  alert('Only admin can access this page');
  window.location.href = 'login.html';
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

async function loadProducts() {
  try {
    const res = await fetch(API_PRODUCT_URL);
    products = await res.json();
    renderProducts();
  } catch (error) {
    console.error(error);
    tableBody.innerHTML = '<tr><td colspan="8">Cannot load products</td></tr>';
  }
}

function renderProducts() {
  tableBody.innerHTML = products.map(product => `
    <tr>
      <td><img src="${product.image}" alt="${product.name}" class="product-img" /></td>
      <td>${product.name}</td>
      <td>${product.brand}</td>
      <td>${product.category}</td>
      <td>${formatPrice(product.price)}</td>
      <td class="${product.countInStock > 0 ? 'stock' : 'stock out-stock'}">${product.countInStock}</td>
      <td><button class="edit-btn" onclick="openEditModal('${product._id}')"><i class="fa-solid fa-pen"></i> Edit</button></td>
      <td><button class="delete-btn" onclick="deleteProduct('${product._id}')"><i class="fa-solid fa-trash"></i> Delete</button></td>
    </tr>
  `).join('');
}

window.openEditModal = (id) => {
  const product = products.find(item => item._id === id);
  product ? editModal.open(product) : showToast('Product not found');
};

async function createProduct(data) {
  await saveProduct(API_PRODUCT_URL, 'POST', data, 'Product added successfully!', () => addModal.close());
}

async function updateProduct(data, id) {
  await saveProduct(`${API_PRODUCT_URL}/${id}`, 'PUT', data, 'Product updated successfully!', () => editModal.close());
}

async function saveProduct(url, method, data, successMessage, closeModal) {
  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) return showToast(result.message || 'Action failed!');
    showToast(successMessage);
    closeModal();
    loadProducts();
  } catch (error) {
    console.error(error);
    showToast('Cannot connect to server');
  }
}

window.deleteProduct = async (id) => {
  if (!confirm('Delete this product?')) return;
  try {
    const res = await fetch(`${API_PRODUCT_URL}/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (!res.ok) return showToast(data.message || 'Failed to delete product!');
    showToast('Product deleted successfully!');
    loadProducts();
  } catch (error) {
    console.error(error);
    showToast('Cannot connect to server');
  }
};

function formatPrice(price) {
  return `${Number(price || 0).toLocaleString('vi-VN')} đ`;
}
