const API_PRODUCT_URL = "http://localhost:5000/api/products";

const token = localStorage.getItem("token");

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const form = document.getElementById("productDetailForm");
const deleteBtn = document.getElementById("deleteBtn");

const previewImage = document.getElementById("previewImage");

const nameInput = document.getElementById("name");
const brandInput = document.getElementById("brand");
const imageInput = document.getElementById("image");
const imagesInput = document.getElementById("images");
const priceInput = document.getElementById("price");
const descriptionInput = document.getElementById("description");
const categoryInput = document.getElementById("category");
const countInStockInput = document.getElementById("countInStock");

if (!productId) {
  alert("Product ID not found");
  window.location.href = "managerProducts.html";
}

async function loadProductDetail() {
  try {
    const response = await fetch(`${API_PRODUCT_URL}/${productId}`);
    const product = await response.json();

    nameInput.value = product.name || "";
    brandInput.value = product.brand || "";
    imageInput.value = product.image || "";
    imagesInput.value = product.images ? product.images.join("\n") : "";
    priceInput.value = product.price || 0;
    descriptionInput.value = product.description || "";
    categoryInput.value = product.category || "";
    countInStockInput.value = product.countInStock || 0;

    previewImage.src = product.image;

  } catch (error) {
    console.error("Load product detail error:", error);
    alert("Cannot load product detail");
  }
}

imageInput.addEventListener("input", () => {
  previewImage.src = imageInput.value;
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const images = imagesInput.value
    .split("\n")
    .map((img) => img.trim())
    .filter((img) => img !== "");

  const updatedProduct = {
    name: nameInput.value.trim(),
    brand: brandInput.value.trim(),
    image: imageInput.value.trim(),
    images,
    price: Number(priceInput.value),
    description: descriptionInput.value.trim(),
    category: categoryInput.value.trim(),
    countInStock: Number(countInStockInput.value)
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
      window.location.href = "managerProducts.html";
    } else {
      alert(data.message || "Update failed");
    }

  } catch (error) {
    console.error("Update product error:", error);
    alert("Cannot connect to server");
  }
});

deleteBtn.addEventListener("click", async () => {
  const confirmDelete = confirm("Delete this product?");

  if (!confirmDelete) return;

  try {
    const response = await fetch(`${API_PRODUCT_URL}/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (response.ok) {
      alert("Product deleted successfully!");
      window.location.href = "managerProducts.html";
    } else {
      alert(data.message || "Delete failed");
    }

  } catch (error) {
    console.error("Delete product error:", error);
    alert("Cannot connect to server");
  }
});

loadProductDetail();