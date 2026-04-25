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


export const createCartOrder = async () => {
    const response = await cartApiInstance.post("/payment/create/order")
    return response.data
}


export const verifyCartOrder = async ({razorpay_order_id, razorpay_payment_id, razorpay_signature}) => {
    const response = await cartApiInstance.post("/payment/verify/order", {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    })
    return response.data
}