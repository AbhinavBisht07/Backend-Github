import { createProduct, getSellerProducts, getAllProducts, getProductDetails } from "../services/product.api";
import { useDispatch } from "react-redux";
import { setSellerProducts, setAllProducts } from "../state/product.slice";


export const useProduct = () => {

    const dispatch = useDispatch();

    async function handleCreateProduct(formData){
        const data = await createProduct(formData)
        return data.product
    }

    async function handleGetSellerProducts(){
        const data = await getSellerProducts()
        dispatch(setSellerProducts(data.products))
        return data.products;
    }

    async function handleGetAllProducts(){
        const data = await getAllProducts()
        dispatch(setAllProducts(data.products))
        return data.products;
    }

    async function handleGetProductDetails(productId){
        const data = await getProductDetails(productId)
        return data.product
    }

    return { handleCreateProduct, handleGetSellerProducts, handleGetAllProducts, handleGetProductDetails }
}