const API_PRODUCT_URL =`/api/products`;
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const mainImage = document.getElementById("mainImage");
const thumbnailList = document.getElementById("thumbnailList");

const productName = document.getElementById("productName");
const productBrand = document.getElementById("productBrand");
const productPrice = document.getElementById("productPrice");
const productStock = document.getElementById("productStock");
const productDescription = document.getElementById("productDescription");
const productCategory = document.getElementById("productCategory");

const addCartBtn = document.getElementById("addCartBtn");
const buyNowBtn = document.getElementById("buyNowBtn");

const prevImageBtn = document.getElementById("prevImageBtn");
const nextImageBtn = document.getElementById("nextImageBtn");

let productImages = [];
let currentImageIndex = 0;

if (!productId) {
  alert("Product not found");
  window.location.href = "products.html";
}

async function loadProductDetail() {
  try {
    const response = await fetch(`${API_PRODUCT_URL}/${productId}`);

    if (!response.ok) {
      throw new Error("Cannot load product detail");
    }

    const product = await response.json();

    renderProductDetail(product);

  } catch (error) {
    console.error(error);

    alert("Cannot load product detail");

    window.location.href = "products.html";
  }
}

function renderProductDetail(product) {
  productName.innerText = product.name;
  productBrand.innerText = product.brand;

  productPrice.innerText =
    product.price.toLocaleString("vi-VN") + " đ";

  productDescription.innerText = product.description;

  productCategory.innerText =
    formatCategory(product.category);

  const isOutOfStock =
    product.countInStock <= 0;

  productStock.innerText = isOutOfStock
    ? "Out of stock"
    : `In stock: ${product.countInStock}`;

  productStock.className = isOutOfStock
    ? "stock-detail out-stock-detail"
    : "stock-detail in-stock-detail";

  addCartBtn.disabled = isOutOfStock;
  buyNowBtn.disabled = isOutOfStock;

  productImages =
    product.images && product.images.length > 0
      ? [product.image, ...product.images]
      : [product.image];

  currentImageIndex = 0;

  renderImages();

  addCartBtn.onclick = () => {
    console.log("Add to cart:", product._id);
  };

  buyNowBtn.onclick = () => {
    window.location.href =
      `checkout.html?id=${product._id}`;
  };
}

function renderImages() {
  mainImage.src = productImages[currentImageIndex];

  thumbnailList.innerHTML = productImages
    .map((img, index) => {
      return `
        <img
          src="${img}"
          class="${index === currentImageIndex ? "active" : ""}"
          onclick="changeImage(${index})"
          alt="Product thumbnail"
        />
      `;
    })
    .join("");

  updateArrowState();
}

window.changeImage = function(index) {
  currentImageIndex = index;

  renderImages();
};

function showPrevImage() {
  currentImageIndex--;

  if (currentImageIndex < 0) {
    currentImageIndex = productImages.length - 1;
  }

  renderImages();
}

function showNextImage() {
  currentImageIndex++;

  if (currentImageIndex >= productImages.length) {
    currentImageIndex = 0;
  }

  renderImages();
}

if (prevImageBtn) {
  prevImageBtn.addEventListener("click", showPrevImage);
}

if (nextImageBtn) {
  nextImageBtn.addEventListener("click", showNextImage);
}

function updateArrowState() {
  const shouldShow =
    productImages.length > 1;

  prevImageBtn.style.display =
    shouldShow ? "block" : "none";

  nextImageBtn.style.display =
    shouldShow ? "block" : "none";
}

function formatCategory(category) {
  const categoryMap = {
    "Keyboard": "Keyboard",
    "Mouse": "Mouse",
    "Headphone": "Headphone",
    "Microphone": "Microphone",
    "Other": "Other"
  };

  return categoryMap[category] || category;
}

loadProductDetail();