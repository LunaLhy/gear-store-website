import { getProducts }
from "./api/productAPI.js";

import { renderProducts }
from "./products/renderProducts.js";

import { searchProducts }
from "./products/searchProducts.js";

let allProducts = [];

async function loadProducts(){

  allProducts = await getProducts();

  renderProducts(allProducts);

}

loadProducts();

const searchInput =
document.getElementById("searchInput");

searchInput.addEventListener("input",(e)=>{

  const keyword = e.target.value;

  const filtered =
  searchProducts(allProducts,keyword);

  renderProducts(filtered);

});