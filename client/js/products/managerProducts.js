
const API_PRODUCT_URL =
  `${window.location.origin}/api/products`;
const token = localStorage.getItem("token");

const tableBody = document.getElementById("productTableBody");
const toast = document.getElementById("toast");

/* ADD MODAL */
const openAddModalBtn = document.getElementById("openAddModalBtn");
const addModal = document.getElementById("addModal");
const closeAddModalBtn = document.getElementById("closeAddModalBtn");
const addProductForm = document.getElementById("addProductForm");

const addImageInput = document.getElementById("addImage");
const addPreviewImage = document.getElementById("addPreviewImage");
const addPreviewText = document.getElementById("addPreviewText");

/* EDIT MODAL */
const editModal = document.getElementById("editModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const editProductForm = document.getElementById("editProductForm");

let allProducts = [];

function showToast(message) {
  toast.innerText = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

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

/* ADD PRODUCT */

function openAddModal() {
  addProductForm.reset();

  addPreviewImage.src = "";
  addPreviewImage.style.display = "none";
  addPreviewText.style.display = "block";
  addPreviewText.innerText = "Image preview";

  addModal.classList.add("show");
}

function closeAddModal() {
  addModal.classList.remove("show");
}

if (openAddModalBtn) {
  openAddModalBtn.addEventListener("click", openAddModal);
}

if (closeAddModalBtn) {
  closeAddModalBtn.addEventListener("click", closeAddModal);
}

if (addModal) {
  addModal.addEventListener("click", (e) => {
    if (e.target === addModal) {
      closeAddModal();
    }
  });
}

addImageInput.addEventListener("input", () => {
  const imageUrl = addImageInput.value.trim();

  if (imageUrl) {
    addPreviewImage.src = imageUrl;
    addPreviewImage.style.display = "block";
    addPreviewText.style.display = "none";
  } else {
    addPreviewImage.src = "";
    addPreviewImage.style.display = "none";
    addPreviewText.style.display = "block";
  }
});

addPreviewImage.addEventListener("error", () => {
  addPreviewImage.style.display = "none";
  addPreviewText.style.display = "block";
  addPreviewText.innerText = "Image URL is invalid";
});

addProductForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const imagesText = document.getElementById("addImages").value.trim();

  const images = imagesText
    ? imagesText
        .split("\n")
        .map((img) => img.trim())
        .filter((img) => img !== "")
    : [];

  const productData = {
    name: document.getElementById("addName").value.trim(),
    brand: document.getElementById("addBrand").value.trim(),
    image: document.getElementById("addImage").value.trim(),
    images,
    price: Number(document.getElementById("addPrice").value),
    description: document.getElementById("addDescription").value.trim(),
    category: document.getElementById("addCategory").value,
    countInStock: Number(document.getElementById("addCountInStock").value)
  };

  try {
    const response = await fetch(API_PRODUCT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });

    const data = await response.json();

    if (response.ok) {
      showToast("Thêm sản phẩm thành công!");

      closeAddModal();
      loadProducts();
    } else {
      showToast(data.message || "Thêm sản phẩm thất bại!");
    }

  } catch (error) {
    console.error("Add product error:", error);
    showToast("Cannot connect to server");
  }
});

/* EDIT PRODUCT */

window.openEditModal = function (productId) {
  const product = allProducts.find((item) => item._id === productId);

  if (!product) {
    showToast("Product not found");
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
  document.getElementById("editCountInStock").value = product.countInStock || 0;

  editModal.classList.add("show");
};

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
    category: document.getElementById("editCategory").value,
    countInStock: Number(document.getElementById("editCountInStock").value)
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
      showToast("Chỉnh sửa sản phẩm thành công!");

      closeEditModal();
      loadProducts();
    } else {
      showToast(data.message || "Chỉnh sửa thất bại!");
    }

  } catch (error) {
    console.error("Update product error:", error);
    showToast("Cannot connect to server");
  }
});

/* DELETE PRODUCT */

window.deleteProduct = async function (id) {
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
      showToast("Xóa sản phẩm thành công!");
      loadProducts();
    } else {
      showToast(data.message || "Xóa sản phẩm thất bại!");
    }

  } catch (error) {
    console.error("Delete product error:", error);
    showToast("Cannot connect to server");
  }
};

loadProducts();