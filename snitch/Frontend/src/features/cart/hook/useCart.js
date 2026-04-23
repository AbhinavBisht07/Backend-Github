import { addItem, decrementCartItemApi, getCart, incrementCartItemApi, removeCartItemApi } from "../service/cart.api"
import { useDispatch } from "react-redux"
import { addItem as addItemToCart, setItems, incrementCartItem, decrementCartItem, removeItem } from "../state/cart.slice"



export const useCart = () => {

    const dispatch = useDispatch();

    async function handleAddItem( {productId, variantId, size, color} ){
        const data = await addItem({productId, variantId, size, color})
        
        return data
    }

    async function handleGetCart(){
        const data = await getCart()
        dispatch(setItems(data.cart.items))
    }

    async function handleIncrementCartItem(itemParams){
        const data = await incrementCartItemApi(itemParams)
        dispatch(incrementCartItem(itemParams))
    }

    async function handleDecrementCartItem(itemParams){
        const data = await decrementCartItemApi(itemParams)
        dispatch(decrementCartItem(itemParams))
    }

    async function handleRemoveCartItem(itemParams){
        await removeCartItemApi(itemParams)
        dispatch(removeItem(itemParams))
    }

    return { handleAddItem, handleGetCart, handleIncrementCartItem, handleDecrementCartItem, handleRemoveCartItem }

}