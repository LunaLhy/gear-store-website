const user =
JSON.parse(localStorage.getItem("user"));

if (!user || user.role !== "admin") {

  alert("Access denied!");

  window.location.href = "login.html";

}
import { createProduct } from "../api/productAPI.js";

const form = document.getElementById("productForm");

form.addEventListener("submit", async event => {
    event.preventDefault();

    const productData = {
    name: document.getElementById("name").value.trim(),
    brand: document.getElementById("brand").value.trim(),
    image: document.getElementById("image").value.trim(),
    price: Number(document.getElementById("price").value),
    category: document.getElementById("category").value,
    countInStock: Number(document.getElementById("countInStock").value),
    description: document.getElementById("description").value.trim()
    };

    const result = await createProduct(productData);

    if (result) {
    alert("Thêm sản phẩm thành công!");
    form.reset();
    } else {
    alert("Thêm sản phẩm thất bại!");
    }
});