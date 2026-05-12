export function searchProducts(products,keyword){

  return products.filter(product =>

    product.name
    .toLowerCase()
    .includes(keyword.toLowerCase())

  );

}