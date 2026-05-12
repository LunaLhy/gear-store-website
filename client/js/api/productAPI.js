const API_URL = "http://localhost:5000/api/products";

export async function getProducts() {
    try {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Cannot fetch products");
    }

    const data = await response.json();

    return data;
    } catch (error) {
    console.log("Get products error:", error);
    return [];
    }
}

export async function createProduct(productData) {
    try {
    const response = await fetch(API_URL, {
        method: "POST",

        headers: {
        "Content-Type": "application/json"
        },

        body: JSON.stringify(productData)
    });

    if (!response.ok) {
        throw new Error("Cannot create product");
    }

    const data = await response.json();

    return data;
    } catch (error) {
    console.log("Create product error:", error);
    return null;
    }
}
}   