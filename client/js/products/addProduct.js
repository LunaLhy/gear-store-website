import { addProduct }
from "../api/productAPI.js"
const form =
document.getElementById("productForm")
form.addEventListener("submit",
async(e)=>{
e.preventDefault()
const product = {
    name:form.name.value,
    brand:form.brand.value,
    image:form.image.value,
    images:
    form.images.value
    .split(","),
    price:Number(form.price.value),
    description:
    form.description.value,
    category:
    form.category.value,
    countInStock:
    Number(form.countInStock.value)
    }
await addProduct(product)
alert("Product Added Successfully")
form.reset()
})