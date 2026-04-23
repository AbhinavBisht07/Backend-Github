import axios from "axios";


const cartApiInstance = axios.create({
    baseURL: "/api/cart",
    withCredentials: true,
})


export const addItem = async ( {productId, variantId, size, color} ) => {
    const response = await cartApiInstance.post(`/add/${productId}/${variantId}`, {
        quantity: 1,
        size,
        color
    })
    return response.data
}


export const getCart = async () => {
    const response = await cartApiInstance.get("/")
    return response.data
}


export const incrementCartItemApi = async ({ productId, variantId, size, color }) => {
    const response = await cartApiInstance.patch(`/quantity/increment/${productId}/${variantId}`, {
        size,
        color
    })
    return response.data
} 


export const decrementCartItemApi = async ({ productId, variantId, size, color }) => {
    const response = await cartApiInstance.patch(`/quantity/decrement/${productId}/${variantId}`, {
        size,
        color
    })
    return response.data
} 


export const removeCartItemApi = async ({ productId, variantId, size, color }) => {
    const response = await cartApiInstance.delete(`/quantity/remove/${productId}/${variantId}`, {
        data: { size, color }
    })
    return response.data
} 