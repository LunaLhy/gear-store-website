const API_PRODUCT_URL = "http://localhost:5000/api/products";

const token = localStorage.getItem("token");
const tableBody = document.getElementById("productTableBody");

async function loadProducts() {
  try {
    const response = await fetch(API_PRODUCT_URL);
    const products = await response.json();

    tableBody.innerHTML = "";

    products.forEach((product) => {
      const stockClass =
        product.countInStock > 0 ? "stock" : "stock out-stock";

      tableBody.innerHTML += `
        <tr>
          <td>
            <img
              src="${product.image}"
              alt="${product.name}"
              class="product-img"
            />
          </td>

          <td>${product.name}</td>
          <td>${product.brand}</td>
          <td>${product.category}</td>

          <td>
            ${product.price.toLocaleString("vi-VN")} đ
          </td>

          <td class="${stockClass}">
            ${product.countInStock}
          </td>

          <td>
            <a
              href="productDetail.html?id=${product._id}"
              class="edit-btn"
            >
              <i class="fa-solid fa-pen"></i>
              Edit
            </a>
          </td>

          <td>
            <button
              class="delete-btn"
              onclick="deleteProduct('${product._id}')"
            >
              <i class="fa-solid fa-trash"></i>
              Delete
            </button>
          </td>
        </tr>
      `;
    });

  } catch (error) {
    console.error("Load products error:", error);
    tableBody.innerHTML = `
      <tr>
        <td colspan="8">Cannot load products</td>
      </tr>
    `;
  }
}

async function deleteProduct(id) {
  const confirmDelete = confirm("Delete this product?");

  if (!confirmDelete) return;

  try {
    const response = await fetch(`${API_PRODUCT_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (response.ok) {
      alert("Product deleted successfully!");
      loadProducts();
    } else {
      alert(data.message || "Delete failed");
    }

  } catch (error) {
    console.error("Delete product error:", error);
    alert("Cannot connect to server");
  }
}

loadProducts();