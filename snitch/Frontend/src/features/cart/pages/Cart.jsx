import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useCart } from '../hook/useCart';
import { Link } from 'react-router-dom';

// Helper to map currency codes to symbols
const getCurrencySymbol = (currencyCode) => {
    const symbols = {
        'INR': '₹',
        'USD': '$',
        'JPY': '¥',
        'EUR': '€',
        'GBP': '£'
    };
    return symbols[currencyCode] || currencyCode;
};

const Cart = () => {
    const cartItems = useSelector(state => state.cart.items) || [];
    const { handleGetCart, handleIncrementCartItem, handleDecrementCartItem, handleRemoveCartItem } = useCart();

    useEffect(() => {
        handleGetCart();
    }, []);

    /**
     * Logic: We always calculate the subtotal using the LIVE price found in the product listing,
     * ensuring the user's bag stays synchronized with seller updates.
     */
    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => {
            // Find the specific variant's current data
            const variant = item.product.variants?.find(v => v._id === item.variant);
            // Variant price takes priority; falls back to main product price
            const realPrice = variant?.price?.amount ? variant.price : item.product.price;
            return total + (realPrice.amount * item.quantity);
        }, 0);
    };

    const subtotal = calculateSubtotal();
    const gstRate = 0.05; // 5% GST Example
    const estimatedGST = subtotal * gstRate;
    const isFreeShipping = subtotal > 1500;
    const shippingFee = isFreeShipping ? 0 : 99;
    const total = subtotal + estimatedGST + (subtotal > 0 ? shippingFee : 0);

    return (
        <div className="min-h-screen bg-[#0e0e15] selection:bg-[#7c3aed]/30 selection:text-white pb-8">


            <main className="max-w-7xl mx-auto px-5 sm:px-8 py-6 lg:py-10">
                <div className="mb-6 lg:mb-10">
                    <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-white mb-2">Shopping Bag</h1>
                    <p className="text-[#958da1] text-sm">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
                </div>

                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-3xl bg-[#13131a]">
                        <div className="w-24 h-24 rounded-full bg-[#1b1b22] flex items-center justify-center mb-6">
                            <svg className="w-10 h-10 text-[#4a4455]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3">Your cart is empty</h2>
                        <p className="text-[#958da1] max-w-md mx-auto mb-8 text-sm">Looks like you haven't added anything to your bag yet. Explore our latest drops and elevate your wardrobe.</p>
                        <Link 
                            to="/"
                            className="h-12 px-8 rounded-full text-xs font-bold uppercase tracking-[0.1em] text-white flex items-center justify-center bg-[#1b1b22] border-[1.5px] border-[#4a4455] hover:border-[#7c3aed] transition-all"
                        >
                            Explore Collection
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                        
                        {/* Left: Cart Items List */}
                        <div className="lg:col-span-8 w-full flex flex-col gap-6">
                            {cartItems.map((item) => {
                                // Extract the specific variant being purchased
                                const variantDetails = item.product.variants?.find(v => v._id === item.variant);
                                const imageSrc = variantDetails?.images?.[0]?.url || item.product.images?.[0]?.url;
                                
                                // Format Attributes
                                let attrString = "Standard Option";
                                if (variantDetails?.attributes) {
                                    let attrObj = variantDetails.attributes;
                                    // Protect against unparsed string attributes
                                    if (typeof attrObj === 'string') {
                                        try { attrObj = JSON.parse(attrObj); } catch(e) { attrObj = {}; }
                                    } else if (attrObj instanceof Map) {
                                        attrObj = Object.fromEntries(attrObj);
                                    }
                                    const { Size, Color, ...rest } = attrObj;
                                    const components = [];
                                    
                                    // strictly match network-derived saved color
                                    if (item.color) components.push(`Color: ${item.color}`);
                                    else if (Color) components.push(`Color: ${Color}`);
                                    
                                    // strictly match network-derived saved size
                                    if (item.size) components.push(`Size: ${item.size}`);
                                    // Fallback to variant attribute if no size was logged
                                    else if (Size) components.push(`Size: ${Size}`);
                                    
                                    attrString = components.length > 0 ? components.join(' | ') : "Standard Option";                                    
                                }

                                /** 
                                 * PRICE SYNCHRONIZATION LOGIC
                                 * We compare the price stored when the item was first "added to bag" (item.price)
                                 * with the current price in the product's listing database (realPrice).
                                 */
                                const variant = item.product.variants?.find(v => v._id === item.variant);
                                const realPrice = variant?.price?.amount ? variant.price : item.product.price;
                                
                                const hasPriceChanged = realPrice.amount !== item.price.amount;
                                const diff = Math.abs(realPrice.amount - item.price.amount);
                                const isIncreased = realPrice.amount > item.price.amount;
                                
                                // Currency symbols
                                const symbol = getCurrencySymbol(realPrice.currency);
                                const oldSymbol = getCurrencySymbol(item.price.currency);

                                return (
                                    <div key={item._id} className="group relative flex gap-5 p-4 sm:p-5 rounded-3xl bg-[#13131a] transition-all hover:bg-[#1b1b22]">
                                        <div className="w-24 sm:w-32 aspect-[3/4] shrink-0 rounded-2xl overflow-hidden bg-[#0e0e15]">
                                            {imageSrc ? (
                                                <img src={imageSrc} alt={item.product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[#4a4455]">No Image</div>
                                            )}
                                        </div>
                                        
                                        <div className="flex flex-col flex-1 py-1">
                                            <div className="flex justify-between items-start mb-1 gap-4">
                                                <Link to={`/product/${item.product._id}`} className="text-base sm:text-lg font-bold text-white hover:text-[#d2bbff] transition-colors leading-tight line-clamp-2">
                                                    {item.product.title}
                                                </Link>
                                                
                                                <div className="flex flex-col items-end shrink-0">
                                                    {hasPriceChanged ? (
                                                        <>
                                                            <span className="text-[10px] font-bold text-[#958da1] line-through uppercase tracking-widest opacity-50">
                                                                {oldSymbol}{item.price.amount.toLocaleString()}
                                                            </span>
                                                            <span className="text-base font-bold text-white">
                                                                {symbol}{realPrice.amount.toLocaleString()}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-base font-bold text-white">
                                                            {symbol}{item.price.amount.toLocaleString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {hasPriceChanged && (
                                                <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${isIncreased ? 'text-[#ffb4ab]' : 'text-[#b4f1be]'}`}>
                                                    {isIncreased 
                                                        ? `Price Update: This item has increased by ${symbol}${diff.toLocaleString()}. Current price: ${symbol}${realPrice.amount.toLocaleString()}`
                                                        : `Price Drop: You save ${symbol}${diff.toLocaleString()}! This item is now ${symbol}${realPrice.amount.toLocaleString()}`
                                                    }
                                                </p>
                                            )}
                                            
                                            <p className="text-xs font-semibold text-[#958da1] tracking-wide mb-auto">
                                                {attrString}
                                            </p>
                                            
                                            <div className="flex items-center justify-between mt-4">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-3 bg-[#0e0e15] rounded-full p-1 border border-[#4a4455]/30">
                                                    <button 
                                                        onClick={() => handleDecrementCartItem({
                                                            productId: item.product._id,
                                                            variantId: item.variant,
                                                            size: item.size,
                                                            color: item.color
                                                        })}
                                                        className="w-8 h-8 rounded-full flex items-center justify-center text-[#958da1] hover:text-white hover:bg-[#2a2931] transition-colors" 
                                                        title="Decrease Quantity"
                                                    >
                                                        <span className="text-lg leading-none mt-[-2px]">-</span>
                                                    </button>
                                                    <span className="text-xs text-white font-bold w-4 text-center">{item.quantity}</span>
                                                    <button 
                                                        onClick={() => handleIncrementCartItem({
                                                            productId: item.product._id,
                                                            variantId: item.variant,
                                                            size: item.size,
                                                            color: item.color
                                                        })}
                                                        className="w-8 h-8 rounded-full flex items-center justify-center text-[#958da1] hover:text-white hover:bg-[#2a2931] transition-colors" 
                                                        title="Increase Quantity"
                                                    >
                                                        <span className="text-lg leading-none mt-[-2px]">+</span>
                                                    </button>
                                                </div>
                                                
                                                <button 
                                                    onClick={() => handleRemoveCartItem({
                                                        productId: item.product._id,
                                                        variantId: item.variant,
                                                        size: item.size,
                                                        color: item.color
                                                    })}
                                                    className="text-[10px] font-bold uppercase tracking-widest text-[#ffb4ab] hover:text-[#ffdad6] transition-colors underline underline-offset-4 decoration-[#ffb4ab]/30 hover:decoration-[#ffb4ab]"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            
                            {/* Trust Badges - Moved below cart items */}
                            <div className="mt-4 pt-6 border-t border-[#1b1b22] grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="flex flex-col items-center justify-center text-center gap-2 p-4 rounded-2xl bg-[#13131a] border border-[#1b1b22]">
                                    <svg className="w-6 h-6 text-[#ccc3d8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#958da1]">Authentic</span>
                                </div>
                                <div className="flex flex-col items-center justify-center text-center gap-2 p-4 rounded-2xl bg-[#13131a] border border-[#1b1b22]">
                                    <svg className="w-6 h-6 text-[#ccc3d8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#958da1]">14-Day Returns</span>
                                </div>
                                <div className="flex flex-col items-center justify-center text-center gap-2 p-4 rounded-2xl bg-[#13131a] border border-[#1b1b22]">
                                    <svg className="w-6 h-6 text-[#ccc3d8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                    </svg>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#958da1]">Secure Shipping</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Right: Order Summary Sticky */}
                        <div className="lg:col-span-4 w-full sticky top-24">
                            <div className="p-6 sm:p-8 rounded-3xl bg-[#13131a] border border-[#1b1b22]">
                                <h3 className="text-lg font-bold text-white mb-6">Order Summary</h3>
                                
                                <div className="space-y-4 text-sm mb-6">
                                    <div className="flex items-center justify-between text-[#ccc3d8]">
                                        <span>Subtotal</span>
                                        <span>{getCurrencySymbol(cartItems[0]?.price?.currency)} {subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[#ccc3d8]">
                                        <span>Estimated GST (5%)</span>
                                        <span>{getCurrencySymbol(cartItems[0]?.price?.currency)} {Math.round(estimatedGST).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[#ccc3d8]">
                                        <span>Shipping</span>
                                        <span>{isFreeShipping ? <span className="text-[#b4f1be]">Free</span> : `${getCurrencySymbol(cartItems[0]?.price?.currency)} ${shippingFee}`}</span>
                                    </div>
                                </div>
                                
                                <div className="h-[1px] w-full bg-[#1b1b22] mb-6"></div>
                                
                                <div className="flex items-center justify-between text-white font-bold text-base mb-8">
                                    <span>Total</span>
                                    <span>{getCurrencySymbol(cartItems[0]?.price?.currency)} {Math.round(total).toLocaleString()}</span>
                                </div>
                                
                                <button 
                                    className="w-full h-14 rounded-xl text-xs font-bold uppercase tracking-[0.1em] text-[#0e0e15] shadow-[0_0_20px_rgba(124,58,237,0.15)] hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                                    style={{
                                        background: 'linear-gradient(135deg, #d2bbff 0%, #bd9dff 50%, #7c3aed 100%)'
                                    }}
                                >
                                    Proceed to Checkout
                                </button>
                                
                                <p className="text-center text-[10px] text-[#958da1] mt-4 tracking-wide">
                                    Taxes and shipping calculated at checkout.
                                </p>
                            </div>
                        </div>
                        
                    </div>
                )}
            </main>
        </div>
    );
};

export default Cart;