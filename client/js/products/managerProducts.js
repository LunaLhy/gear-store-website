const API_PRODUCT_URL = "http://localhost:5000/api/products";

const token = localStorage.getItem("token");

const tableBody = document.getElementById("productTableBody");

const editModal = document.getElementById("editModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const editProductForm = document.getElementById("editProductForm");

let allProducts = [];

async function loadProducts() {
  try {
    const response = await fetch(API_PRODUCT_URL);
    const products = await response.json();

    allProducts = products;

    renderProducts(products);

  } catch (error) {
    console.error("Load products error:", error);

    tableBody.innerHTML = `
      <tr>
        <td colspan="8">Cannot load products</td>
      </tr>
    `;
  }
}

function renderProducts(products) {
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
          <button
            class="edit-btn"
            onclick="openEditModal('${product._id}')"
          >
            <i class="fa-solid fa-pen"></i>
            Edit
          </button>
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
}

function openEditModal(productId) {
  const product = allProducts.find((item) => item._id === productId);

  if (!product) {
    alert("Product not found");
    return;
  }

  document.getElementById("editProductId").value = product._id;
  document.getElementById("editName").value = product.name || "";
  document.getElementById("editBrand").value = product.brand || "";
  document.getElementById("editImage").value = product.image || "";
  document.getElementById("editImages").value = product.images
    ? product.images.join("\n")
    : "";
  document.getElementById("editPrice").value = product.price || 0;
  document.getElementById("editDescription").value = product.description || "";
  document.getElementById("editCategory").value = product.category || "";
  document.getElementById("editCountInStock").value =
    product.countInStock || 0;

  editModal.classList.add("show");
}

function closeEditModal() {
  editModal.classList.remove("show");
}

if (closeModalBtn) {
  closeModalBtn.addEventListener("click", closeEditModal);
}

if (editModal) {
  editModal.addEventListener("click", (e) => {
    if (e.target === editModal) {
      closeEditModal();
    }
  });
}

editProductForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const productId = document.getElementById("editProductId").value;

  const imagesText = document.getElementById("editImages").value.trim();

  const images = imagesText
    ? imagesText
        .split("\n")
        .map((img) => img.trim())
        .filter((img) => img !== "")
    : [];

  const updatedProduct = {
    name: document.getElementById("editName").value.trim(),
    brand: document.getElementById("editBrand").value.trim(),
    image: document.getElementById("editImage").value.trim(),
    images,
    price: Number(document.getElementById("editPrice").value),
    description: document.getElementById("editDescription").value.trim(),
    category: document.getElementById("editCategory").value.trim(),
    countInStock: Number(
      document.getElementById("editCountInStock").value
    )
  };

  try {
    const response = await fetch(`${API_PRODUCT_URL}/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updatedProduct)
    });

    const data = await response.json();

    if (response.ok) {
      alert("Product updated successfully!");

      closeEditModal();
      loadProducts();

    } else {
      alert(data.message || "Update failed");
    }

  } catch (error) {
    console.error("Update product error:", error);
    alert("Cannot connect to server");
  }
});

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