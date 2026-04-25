import { addItem, createCartOrder, decrementCartItemApi, getCart, incrementCartItemApi, removeCartItemApi, verifyCartOrder } from "../service/cart.api"
import { useDispatch } from "react-redux"
import { addItem as addItemToCart, setCart, setItems, incrementCartItem, decrementCartItem, removeItem } from "../state/cart.slice"



export const useCart = () => {

    const dispatch = useDispatch();

    async function handleAddItem( {productId, variantId, size, color} ){
        const data = await addItem({productId, variantId, size, color})
        
        return data
    }

    async function handleGetCart(){
        const data = await getCart();
        // Since aggregation returns an array, we take the first result or a default empty cart
        const cartData = Array.isArray(data.cart) && data.cart.length > 0 
            ? data.cart[0] 
            : { items: [], totalPrice: 0, currency: 'INR' };
            
        dispatch(setCart(cartData));
    }

    async function handleIncrementCartItem(itemParams){
        await incrementCartItemApi(itemParams)
        // Refresh the populated cart from the backend aggregation
        handleGetCart()
    }

    async function handleDecrementCartItem(itemParams){
        await decrementCartItemApi(itemParams)
        // Refresh the populated cart from the backend aggregation
        handleGetCart()
    }

    async function handleRemoveCartItem(itemParams){
        await removeCartItemApi(itemParams)
        // Refresh the populated cart from the backend aggregation
        handleGetCart()
    }


    async function handleCreateCartOrder(){
        const data = await createCartOrder();
        return data.order;
    }

    async function handleVerifyCartOrder({ razorpay_order_id, razorpay_payment_id, razorpay_signature }){
        const data = await verifyCartOrder({razorpay_order_id, razorpay_payment_id, razorpay_signature});
        return data.success;
    }

    return { handleAddItem, handleGetCart, handleIncrementCartItem, handleDecrementCartItem, handleRemoveCartItem, handleCreateCartOrder, handleVerifyCartOrder }

}