const API_PRODUCT_URL = "http://localhost:5000/api/products";

const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

const addProductForm = document.getElementById("addProductForm");
const imageInput = document.getElementById("image");
const previewImage = document.getElementById("previewImage");
const previewText = document.getElementById("previewText");

if (!user || !(user.role === "admin" || user.isAdmin === true || user.isAdmin === "true")) {
  alert("Only admin can access this page");
  window.location.href = "login.html";
}

imageInput.addEventListener("input", () => {
  const imageUrl = imageInput.value.trim();

  if (imageUrl) {
    previewImage.src = imageUrl;
    previewImage.style.display = "block";
    previewText.style.display = "none";
  } else {
    previewImage.src = "";
    previewImage.style.display = "none";
    previewText.style.display = "block";
  }
});

previewImage.addEventListener("error", () => {
  previewImage.style.display = "none";
  previewText.style.display = "block";
  previewText.innerText = "Image URL is not valid";
});

addProductForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const imagesText = document.getElementById("images").value.trim();

  const images = imagesText
    ? imagesText
        .split("\n")
        .map((img) => img.trim())
        .filter((img) => img !== "")
    : [];

  const productData = {
    name: document.getElementById("name").value.trim(),
    brand: document.getElementById("brand").value.trim(),
    image: document.getElementById("image").value.trim(),
    images,
    price: Number(document.getElementById("price").value),
    description: document.getElementById("description").value.trim(),
    category: document.getElementById("category").value.trim(),
    countInStock: Number(document.getElementById("countInStock").value)
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
      alert("Product added successfully!");
      addProductForm.reset();

      previewImage.src = "";
      previewImage.style.display = "none";
      previewText.style.display = "block";
      previewText.innerText = "Image preview";

      window.location.href = "managerProducts.html";
    } else {
      alert(data.message || "Add product failed");
    }

  } catch (error) {
    console.error("Add product error:", error);
    alert("Cannot connect to server");
  }
});
