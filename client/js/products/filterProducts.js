export function searchProducts(products, keyword) {
    if (!keyword || keyword.trim() === "") {
    return products;
    }

    const search = keyword.toLowerCase().trim();

    return products.filter(product => {
    const name = product.name?.toLowerCase() || "";
    const brand = product.brand?.toLowerCase() || "";
    const category = product.category?.toLowerCase() || "";
    const description = product.description?.toLowerCase() || "";

    return (
        name.includes(search) ||
        brand.includes(search) ||
        category.includes(search) ||
        description.includes(search)
    );
    });
}