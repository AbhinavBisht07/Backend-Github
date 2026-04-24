import { createProduct, getSellerProducts, getAllProducts, getProductDetails, addProductVariant, deleteProductVariant, updateProduct, updateProductVariant } from "../services/product.api";
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

    async function handleAddProductVariant(productId, newProductVariant){
        const data = await addProductVariant(productId, newProductVariant)
        return data
    }


    
    async function handleUpdateProduct(productId, updateData){
        const data = await updateProduct(productId, updateData)
        return data
    }

    async function handleUpdateProductVariant(productId, variantId, updateData){
        const data = await updateProductVariant(productId, variantId, updateData)
        return data
    }

    async function handleDeleteProductVariant(productId, variantId){
        const data = await deleteProductVariant(productId, variantId)
        return data
    }

    return { handleCreateProduct, handleGetSellerProducts, handleGetAllProducts, handleGetProductDetails, handleAddProductVariant, handleUpdateProduct, handleUpdateProductVariant, handleDeleteProductVariant }
}