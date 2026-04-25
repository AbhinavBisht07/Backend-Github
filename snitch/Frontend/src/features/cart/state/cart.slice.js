import { createSlice } from "@reduxjs/toolkit";


const cartSlice = createSlice({
    name: "cart",
    initialState: {
        totalPrice: null,
        currency: null,
        items: [],
    },
    reducers: {
        setCart: (state, action) => {
            const { items, totalPrice, currency } = action.payload;
            state.items = items || [];
            state.totalPrice = totalPrice;
            state.currency = currency;
        },
        setItems: (state, action) => {
            state.items = action.payload;
        },
        addItem: (state, action) => {
            state.items.push(action.payload)
        },
        incrementCartItem: (state, action) => {
            const { productId, variantId, size, color } = action.payload;
            const item = state.items.find(item => item.product._id === productId &&
                item.variant === variantId &&
                item.size === size &&
                item.color === color
            )

            if (item) {
                item.quantity += 1;
            }
        },
        decrementCartItem: (state, action) => {
            const { productId, variantId, size, color } = action.payload;

            const index = state.items.findIndex(item => item.product._id === productId &&
                item.variant === variantId &&
                item.size === size &&
                item.color === color
            )

            // if item does not exist
            if (index === -1) return; 

            // if item exists but quantity is 1
            if (state.items[index].quantity === 1) {
                state.items.splice(index, 1); // remove item
            } else {
                state.items[index].quantity -= 1; // decrement
            }
        },
        removeItem: (state, action) => {
            const { productId, variantId, size, color } = action.payload;

            const index = state.items.findIndex(item =>
                item.product._id === productId &&
                item.variant === variantId &&
                item.size === size &&
                item.color === color
            )

            // if item exists
            if (index !== -1) {
                state.items.splice(index, 1);
            }
        }
    }
})


export const { setCart, setItems, addItem, incrementCartItem, decrementCartItem, removeItem } = cartSlice.actions;
export default cartSlice.reducer;