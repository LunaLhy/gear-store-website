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

/* EDIT MODAL */
const editModal = document.getElementById("editModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const editProductForm = document.getElementById("editProductForm");

let allProducts = [];

let addImagesPreview = [];
let addCurrentIndex = 0;

let editImagesPreview = [];
let editCurrentIndex = 0;

function showToast(message) {
  toast.innerText = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

function getImagesFromInputs(mainImageValue, imagesValue) {
  const mainImage = mainImageValue.trim();

  const images = imagesValue
    .trim()
    .split("\n")
    .map((img) => img.trim())
    .filter((img) => img !== "");

  return mainImage ? [mainImage, ...images] : images;
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

/* ADD PREVIEW */

function renderAddPreview() {
  const previewImage = document.getElementById("addPreviewImage");
  const previewText = document.getElementById("addPreviewText");
  const thumbnailList = document.getElementById("addThumbnailList");

  addImagesPreview = getImagesFromInputs(
    document.getElementById("addImage").value,
    document.getElementById("addImages").value
  );

  if (addImagesPreview.length === 0) {
    previewImage.src = "";
    previewImage.style.display = "none";
    previewText.style.display = "block";
    previewText.innerText = "Image preview";
    thumbnailList.innerHTML = "";
    return;
  }

  if (addCurrentIndex >= addImagesPreview.length) {
    addCurrentIndex = 0;
  }

  previewImage.src = addImagesPreview[addCurrentIndex];
  previewImage.style.display = "block";
  previewText.style.display = "none";

  thumbnailList.innerHTML = addImagesPreview
    .map((img, index) => {
      return `
        <img
          src="${img}"
          class="${index === addCurrentIndex ? "active" : ""}"
          onclick="changeAddImage(${index})"
        />
      `;
    })
    .join("");
}

window.changeAddImage = function(index) {
  addCurrentIndex = index;
  renderAddPreview();
};

function openAddModal() {
  addProductForm.reset();

  addCurrentIndex = 0;
  renderAddPreview();

  addModal.classList.add("show");
}

function closeAddModal() {
  addModal.classList.remove("show");
}

openAddModalBtn.addEventListener("click", openAddModal);
closeAddModalBtn.addEventListener("click", closeAddModal);

addModal.addEventListener("click", (e) => {
  if (e.target === addModal) closeAddModal();
});

document.getElementById("addImage").addEventListener("input", () => {
  addCurrentIndex = 0;
  renderAddPreview();
});

document.getElementById("addImages").addEventListener("input", () => {
  addCurrentIndex = 0;
  renderAddPreview();
});

document.getElementById("addPrevBtn").addEventListener("click", () => {
  if (addImagesPreview.length === 0) return;

  addCurrentIndex =
    addCurrentIndex <= 0
      ? addImagesPreview.length - 1
      : addCurrentIndex - 1;

  renderAddPreview();
});

document.getElementById("addNextBtn").addEventListener("click", () => {
  if (addImagesPreview.length === 0) return;

  addCurrentIndex =
    addCurrentIndex >= addImagesPreview.length - 1
      ? 0
      : addCurrentIndex + 1;

  renderAddPreview();
});

/* ADD PRODUCT */

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
      showToast("Product added successfully!");

      closeAddModal();
      loadProducts();
    } else {
      showToast(data.message || "Failed to add product!");
    }

  } catch (error) {
    console.error("Add product error:", error);
    showToast("Cannot connect to server");
  }
});

/* EDIT PREVIEW */

function renderEditPreview() {
  const previewImage = document.getElementById("editPreviewImage");
  const previewText = document.getElementById("editPreviewText");
  const thumbnailList = document.getElementById("editThumbnailList");

  editImagesPreview = getImagesFromInputs(
    document.getElementById("editImage").value,
    document.getElementById("editImages").value
  );

  if (editImagesPreview.length === 0) {
    previewImage.src = "";
    previewImage.style.display = "none";
    previewText.style.display = "block";
    previewText.innerText = "Image preview";
    thumbnailList.innerHTML = "";
    return;
  }

  if (editCurrentIndex >= editImagesPreview.length) {
    editCurrentIndex = 0;
  }

  previewImage.src = editImagesPreview[editCurrentIndex];
  previewImage.style.display = "block";
  previewText.style.display = "none";

  thumbnailList.innerHTML = editImagesPreview
    .map((img, index) => {
      return `
        <img
          src="${img}"
          class="${index === editCurrentIndex ? "active" : ""}"
          onclick="changeEditImage(${index})"
        />
      `;
    })
    .join("");
}

window.changeEditImage = function(index) {
  editCurrentIndex = index;
  renderEditPreview();
};

window.openEditModal = function(productId) {
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

  editCurrentIndex = 0;
  renderEditPreview();

  editModal.classList.add("show");
};

function closeEditModal() {
  editModal.classList.remove("show");
}

closeModalBtn.addEventListener("click", closeEditModal);

editModal.addEventListener("click", (e) => {
  if (e.target === editModal) closeEditModal();
});

document.getElementById("editImage").addEventListener("input", () => {
  editCurrentIndex = 0;
  renderEditPreview();
});

document.getElementById("editImages").addEventListener("input", () => {
  editCurrentIndex = 0;
  renderEditPreview();
});

document.getElementById("editPrevBtn").addEventListener("click", () => {
  if (editImagesPreview.length === 0) return;

  editCurrentIndex =
    editCurrentIndex <= 0
      ? editImagesPreview.length - 1
      : editCurrentIndex - 1;

  renderEditPreview();
});

document.getElementById("editNextBtn").addEventListener("click", () => {
  if (editImagesPreview.length === 0) return;

  editCurrentIndex =
    editCurrentIndex >= editImagesPreview.length - 1
      ? 0
      : editCurrentIndex + 1;

  renderEditPreview();
});

/* EDIT PRODUCT */

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
      showToast("Product updated successfully!");

      closeEditModal();
      loadProducts();
    } else {
      showToast(data.message || "Failed to update product!");
    }

  } catch (error) {
    console.error("Update product error:", error);
    showToast("Cannot connect to server");
  }
});

/* DELETE PRODUCT */

window.deleteProduct = async function(id) {
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
      showToast("Product deleted successfully!");
      loadProducts();
    } else {
      showToast(data.message || "Failed to delete product!");
    }

  } catch (error) {
    console.error("Delete product error:", error);
    showToast("Cannot connect to server");
  }
};

loadProducts();