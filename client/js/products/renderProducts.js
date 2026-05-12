export function renderProducts(products){

  const container =
  document.getElementById("productContainer");

  container.innerHTML = "";

  products.forEach(product => {

    container.innerHTML += `

      <div class="product-card">

        <img
          src="${product.image}"
          class="product-image"
        />

        <div class="product-info">

          <h2 class="product-title">
            ${product.name}
          </h2>

          <p class="product-price">
            $${product.price}
          </p>

          <p class="product-brand">
            ${product.brand}
          </p>

          <button class="buy-btn">
            Buy Now
          </button>

        </div>

      </div>

    `;

  });

}