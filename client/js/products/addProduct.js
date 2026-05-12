import { createProduct }
from "../api/productAPI.js";

const form =
document.getElementById("productForm");

form.addEventListener("submit",
async(e)=>{

  e.preventDefault();

  const productData = {

    name:
    document.getElementById("name").value,

    brand:
    document.getElementById("brand").value,

    image:
    document.getElementById("image").value,

    price:
    document.getElementById("price").value,

    category:
    document.getElementById("category").value,

    countInStock:
    document.getElementById("countInStock").value,

    description:
    document.getElementById("description").value

  };

  const result =
  await createProduct(productData);

  alert("Product Added!");

  console.log(result);

});