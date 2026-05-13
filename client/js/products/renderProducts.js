export function renderProducts(products) {
  const container = document.getElementById("productContainer");

  if (!container) {
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
    const stockText =
      product.countInStock > 0 ? "Còn hàng" : "Hết hàng";

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

          <p class="product-price">
            ${Number(product.price).toLocaleString("vi-VN")} VND
          </p>

          <div class="product-bottom">

            <button class="add-cart-btn">
              🛒 THÊM VÀO GIỎ
            </button>

            <span class="stock-badge">
              ${stockText}
            </span>

          </div>

        </div>

      </div>
    `;
  });
}