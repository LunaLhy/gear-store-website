export function renderProducts(products) {
  const container = document.getElementById("productContainer");

  if (!container) {
    console.log("Không tìm thấy productContainer");
    return;
  }

  container.innerHTML = "";

  if (!products || products.length === 0) {
    container.innerHTML = `
      <p class="empty-message">
        Không tìm thấy sản phẩm phù hợp
      </p>
    `;
    return;
  }

  products.forEach(product => {
    container.innerHTML += `
      <div class="product-card">

        <img
          src="${product.image}"
          alt="${product.name}"
          class="product-image"
        />

        <div class="product-info">

          <h2 class="product-title">
            ${product.name}
          </h2>

          <p class="product-brand">
            Brand: ${product.brand}
          </p>

          <p class="product-category">
            Category: ${product.category}
          </p>

          <p class="product-price">
            ${Number(product.price).toLocaleString("vi-VN")}đ
          </p>

          <p class="product-stock">
            Stock: ${product.countInStock}
          </p>

          <button class="buy-btn">
            Add to Cart
          </button>

        </div>

      </div>
    `;
  });
}