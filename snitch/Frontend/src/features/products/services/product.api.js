import axios from "axios";

const productApiInstance = axios.create({
    baseURL: "/api/products",
    withCredentials: true,
})



export async function createProduct(formData){
    const response = await productApiInstance.post("/", formData);
    return response.data;
}


export async function getSellerProducts(){
    const response = await productApiInstance.get("/seller");
    return response.data;
}


export async function getAllProducts(){
    const response = await productApiInstance.get("/");
    return response.data;
} 


export async function getProductDetails(productId){
    const response = await productApiInstance.get(`/details/${productId}`);
    return response.data;
}


export async function addProductVariant(productId, newProductVariant){

    const formData = new FormData();

    newProductVariant.images.forEach((image)=>{
        formData.append(`images`, image.file)
    })

    formData.append("stock", newProductVariant.stock)
    formData.append("priceAmount", newProductVariant.price)
    formData.append("attributes", JSON.stringify(newProductVariant.attributes))

    const response = await productApiInstance.post(`/${productId}/variants`, formData);
    return response.data;
}


export async function updateProduct(productId, updateData) {
    const response = await productApiInstance.patch(`/${productId}`, updateData);
    return response.data;
}


export async function updateProductVariant(productId, variantId, updateData) {
    const response = await productApiInstance.patch(`/${productId}/variants/${variantId}`, updateData);
    return response.data;
}


export async function deleteProductVariant(productId, variantId) {
    const response = await productApiInstance.delete(`/${productId}/variants/${variantId}`);
    return response.data;
}