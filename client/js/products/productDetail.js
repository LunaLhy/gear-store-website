const API_PRODUCT_URL = "http://localhost:5000/api/products";

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
  productPrice.innerText = product.price.toLocaleString("vi-VN") + " đ";
  productDescription.innerText = product.description;
  productCategory.innerText = product.category;

  mainImage.src = product.image;

  const isOutOfStock = product.countInStock <= 0;

  productStock.innerText = isOutOfStock
    ? "Out of stock"
    : `In stock: ${product.countInStock}`;

  productStock.className = isOutOfStock
    ? "stock-detail out-stock-detail"
    : "stock-detail in-stock-detail";

  addCartBtn.disabled = isOutOfStock;
  buyNowBtn.disabled = isOutOfStock;

  const images =
    product.images && product.images.length > 0
      ? [product.image, ...product.images]
      : [product.image];

  thumbnailList.innerHTML = images
    .map((img, index) => {
      return `
        <img
          src="${img}"
          class="${index === 0 ? "active" : ""}"
          onclick="changeImage('${img}', this)"
        />
      `;
    })
    .join("");

  addCartBtn.onclick = () => {
    console.log("Add to cart:", product._id);
  };

  buyNowBtn.onclick = () => {
    window.location.href = `checkout.html?id=${product._id}`;
  };
}

window.changeImage = function (imgUrl, element) {
  mainImage.src = imgUrl;

  document
    .querySelectorAll(".thumbnail-list img")
    .forEach((img) => img.classList.remove("active"));

  element.classList.add("active");
};

loadProductDetail();