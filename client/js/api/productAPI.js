const API_URL = "http://localhost:5000/api/products";

export async function getProducts() {

  try {

    const response = await fetch(API_URL);

    const data = await response.json();

    return data;

  } catch(error){

    console.log(error);

  }

}

export async function createProduct(productData){

  try{

    const response = await fetch(API_URL,{

      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify(productData)

    });

    return await response.json();

  }catch(error){

    console.log(error);

  }

}   