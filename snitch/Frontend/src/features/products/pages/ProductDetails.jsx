import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useProduct } from '../hook/useProduct';
import { useCart } from '../../cart/hook/useCart';

const ProductDetails = () => {
    const { productId } = useParams();
    const { handleAddItem } = useCart();

    const [product, setProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [cartStatus, setCartStatus] = useState({ type: null, message: '' });


    const thumbnailRef = useRef(null);
    const user = useSelector(state => state.auth.user);
    const { handleGetProductDetails } = useProduct();

    async function fetchProductDetails() {
        try {
            setIsLoading(true);
            const data = await handleGetProductDetails(productId);
            setProduct(data);
            if (data.variants?.length > 0) {
                setSelectedVariant(data.variants[0]);
            } else {
                setSelectedVariant(null);
            }
            setSelectedSize(null);
            setActiveImageIndex(0);
        } catch (error) {
            console.error("Failed to fetch product:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchProductDetails();
    }, [productId]);

    // Safety checks for rendering
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0e0e15] flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-4 border-[#1b1b22] border-t-[#7c3aed] animate-spin"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#0e0e15] flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight font-semibold">Product Not Found</h1>
                <p className="text-[#958da1] mb-6">The item you're looking for doesn't exist or has been removed.</p>
                <Link to="/" className="text-[#d2bbff] hover:underline font-bold uppercase tracking-widest text-xs">
                    ← Back to Archive
                </Link>
            </div>
        );
    }

    const handleVariantSelect = (variant) => {
        setSelectedVariant(variant);
        setSelectedSize(null);
        setActiveImageIndex(0);
    };

    const displayPrice = selectedVariant?.price?.amount ? selectedVariant.price : product.price;
    const displayImages = selectedVariant?.images?.length > 0 ? selectedVariant.images : (product.images || []);

    const activeImage = displayImages[activeImageIndex]?.url || displayImages[activeImageIndex]?.secure_url || displayImages[activeImageIndex]?.src || "https://placehold.co/800x800/1b1b22/7c3aed?text=No+Image";

    return (
        <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-[#0e0e15] text-[#e4e1eb] font-sans antialiased tracking-tight flex flex-col">



            {/* ── Main Content ── */}
            <main className="max-w-7xl mx-auto w-full px-5 sm:px-8 py-6 lg:py-8 lg:h-[calc(100vh-64px)] flex flex-col lg:overflow-hidden">

                {/* Back Link */}
                <Link to="/" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-[#958da1] hover:text-[#d2bbff] transition-colors mb-4 lg:mb-6 shrink-0">
                    <span className="text-lg leading-none mr-2 mt-[-2px]">←</span> Home
                </Link>

                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16 flex-1 min-h-0">

                    {/* ── Left Column: Image Gallery ── */}
                    <div className="flex flex-col gap-3 w-full h-full min-h-[300px]">
                        {/* Main Image — always object-contain so nothing is cropped */}
                        <div className="relative aspect-square lg:aspect-auto lg:flex-1 bg-[#13131a] rounded-2xl overflow-hidden lg:min-h-0 flex items-center justify-center">
                            <img
                                src={activeImage}
                                alt={product.title}
                                className="w-full h-full object-contain p-3"
                            />
                        </div>

                        {/* Thumbnail Strip */}
                        {displayImages.length > 1 && (
                            <div
                                ref={thumbnailRef}
                                onWheel={(e) => {
                                    e.preventDefault();
                                    thumbnailRef.current.scrollLeft += e.deltaY;
                                }}
                                className="snitch-scroll flex gap-2.5 overflow-x-auto rounded-xl bg-[#13131a] p-2.5"
                            >
                                {displayImages.map((img, idx) => {
                                    const src = img.url || img.secure_url || img.src;
                                    const isActive = idx === activeImageIndex;
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImageIndex(idx)}
                                            className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shrink-0 transition-all duration-200 ${isActive
                                                ? 'ring-2 ring-[#7C3AED] ring-offset-2 ring-offset-[#13131a] opacity-100 scale-[1.04]'
                                                : 'opacity-40 hover:opacity-75 hover:scale-[1.02]'
                                                }`}
                                        >
                                            <img src={src} alt={`View ${idx + 1}`} className="w-full h-full object-contain bg-[#1b1b22] p-1" />
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* ── Right Column: Details & Actions ── */}
                    <div className="snitch-scroll flex flex-col lg:overflow-y-auto pr-0 lg:pr-4 pb-4">

                        <div className="mb-8">
                            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-semibold mb-4 leading-tight">
                                {product.title}
                            </h1>
                            <div className="flex items-end gap-3 mb-8">
                                <p className="text-2xl sm:text-3xl font-semibold text-[#d2bbff]">
                                    {displayPrice?.amount?.toLocaleString('en-US') || 0}
                                </p>
                                <span className="text-sm font-bold tracking-widest uppercase text-[#958da1] mb-1.5">
                                    {displayPrice?.currency || 'USD'}
                                </span>
                            </div>

                            {/* Variant Selection */}
                            {product.variants?.length > 0 && (
                                <div className="mb-6 p-4 rounded-2xl border border-[#4a4455]/20 bg-[#13131a]">
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#958da1] mb-3">Options & Designs</h3>
                                    <div className="flex flex-wrap gap-3 items-center">
                                        {product.variants.map((v, i) => {
                                            // Parse attributes securely
                                            let attrObj = v.attributes;
                                            if (typeof attrObj === 'string') {
                                                try { attrObj = JSON.parse(attrObj); } catch (e) { attrObj = {}; }
                                            } else if (attrObj instanceof Map) {
                                                attrObj = Object.fromEntries(attrObj);
                                            }

                                            // Extract Size so it isn't part of the main option button label
                                            const { Size, ...otherAttrs } = attrObj || {};
                                            const Color = otherAttrs.Color;

                                            const fallbackLabel = Object.keys(otherAttrs).length > 0
                                                ? Object.entries(otherAttrs).map(([k, val]) => `${val}`).join(' · ')
                                                : `Option ${i + 1}`;

                                            // Use Color as primary label beneath the image; fallback to the combined string
                                            const label = Color ? Color : fallbackLabel;

                                            const isSelected = selectedVariant?._id === v._id;
                                            const hasImage = v.images && v.images.length > 0;

                                            if (hasImage) {
                                                return (
                                                    <button
                                                        key={v._id}
                                                        onClick={() => handleVariantSelect(v)}
                                                        title={fallbackLabel}
                                                        className="flex flex-col items-center justify-start group transition-all w-[72px]"
                                                    >
                                                        <div className={`relative w-[72px] h-24 rounded-xl overflow-hidden border mb-2 transition-all shrink-0 ${isSelected
                                                            ? 'border-[#7c3aed] ring-2 ring-[#7c3aed]/50 ring-offset-2 ring-offset-[#13131a]'
                                                            : 'border-[#4a4455]/30 group-hover:border-[#ccc3d8]/50'
                                                            }`}>
                                                            <img src={v.images[0].url || v.images[0].secure_url} alt={label} className="w-full h-full object-cover" />
                                                        </div>
                                                        <span className={`text-[10px] uppercase tracking-wide font-bold transition-all text-center leading-tight ${isSelected ? 'text-white' : 'text-[#958da1] group-hover:text-[#ccc3d8]'}`}>
                                                            {label}
                                                        </span>
                                                    </button>
                                                );
                                            }

                                            return (
                                                <button
                                                    key={v._id}
                                                    onClick={() => handleVariantSelect(v)}
                                                    title={fallbackLabel}
                                                    className={`h-10 px-4 rounded-xl text-xs font-bold transition-all border ${isSelected
                                                        ? 'border-[#7c3aed] ring-2 ring-[#7c3aed]/50 ring-offset-2 ring-offset-[#13131a] bg-[#7c3aed] text-white'
                                                        : 'border-[#4a4455]/30 bg-[#0e0e15] text-[#ccc3d8] hover:border-[#7c3aed] hover:text-white'
                                                        }`}
                                                >
                                                    {label}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {selectedVariant && (
                                        <p className="mt-4 text-[11px] font-medium text-[#958da1]">
                                            <span className={selectedVariant.stock > 0 ? "text-white" : "text-[#ffb4ab]"}>
                                                {selectedVariant.stock} units available
                                            </span>
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Size Selection (Only shows if selected variant has multiple sizes) */}
                            {(() => {
                                let sizes = [];
                                if (selectedVariant) {
                                    let attrObj = selectedVariant.attributes;
                                    if (typeof attrObj === 'string') {
                                        try { attrObj = JSON.parse(attrObj); } catch (e) { }
                                    } else if (attrObj instanceof Map) {
                                        attrObj = Object.fromEntries(attrObj);
                                    }
                                    if (attrObj && attrObj.Size) {
                                        sizes = attrObj.Size.split(',').map(s => s.trim()).filter(Boolean);
                                    }
                                }

                                if (sizes.length > 0) {
                                    return (
                                        <div className="mb-8 p-4 rounded-2xl border border-[#4a4455]/20 bg-[#13131a]">
                                            <div className="flex justify-between items-center mb-3">
                                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#958da1]">Select Size</h3>
                                                <span className="text-[10px] uppercase font-bold text-[#4a4455] hover:text-white cursor-pointer transition-colors border-b border-[#4a4455] hover:border-white">Size Guide</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {sizes.map(size => (
                                                    <button
                                                        key={size}
                                                        onClick={() => setSelectedSize(size)}
                                                        className={`h-11 min-w-[3.5rem] px-3 rounded-lg text-xs font-bold tracking-wide transition-all ${selectedSize === size
                                                            ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                                                            : 'bg-[#0e0e15] border border-[#4a4455]/50 text-[#ccc3d8] hover:border-white hover:text-white'
                                                            }`}
                                                    >
                                                        {size}
                                                    </button>
                                                ))}
                                            </div>
                                            {!selectedSize && (
                                                <p className="mt-2 text-[10px] text-[#ffb4ab] font-medium tracking-wide">Please select a size to continue</p>
                                            )}
                                        </div>
                                    );
                                }
                                return null;
                            })()}

                            {/* Product Description */}
                            <div className="prose prose-invert max-w-none">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-3">About this piece</h3>
                                <p className="text-[#ccc3d8] leading-relaxed whitespace-pre-line">
                                    {product.description}
                                </p>
                            </div>
                        </div>

                        {/* Metadata row */}
                        <div className="flex flex-col sm:flex-row gap-6 py-6 border-y border-[#4a4455]/20 mb-8">
                            <div>
                                <span className="block text-[10px] font-bold uppercase tracking-widest text-[#958da1] mb-1">Listed</span>
                                <span className="text-sm text-white">
                                    {new Date(product.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </span>
                            </div>
                            <div>
                                <span className="block text-[10px] font-bold uppercase tracking-widest text-[#958da1] mb-1">Condition</span>
                                <span className="text-sm text-white flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]"></span> Authenticated
                                </span>
                            </div>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col gap-4 mt-auto">
                            {cartStatus.message && (
                                <div className={`px-4 py-3 rounded-xl text-xs font-bold transition-all border ${
                                    cartStatus.type === 'error' 
                                        ? 'bg-[#ffb4ab]/10 border-[#ffb4ab]/30 text-[#ffb4ab]' 
                                        : 'bg-[#d2bbff]/10 border-[#d2bbff]/30 text-[#d2bbff]'
                                }`}>
                                    {cartStatus.message}
                                </div>
                            )}

                            <button
                                onClick={ () => {
                                    setCartStatus({ type: null, message: '' });

                                    if (product.variants?.length > 0 && !selectedVariant) {
                                        setCartStatus({ type: 'error', message: 'Please select a design/option before adding to cart.'});
                                        return;
                                    }

                                    let requiresSize = false;
                                    let parsedColor = null;
                                    
                                    if (selectedVariant) {
                                        let attrObj = selectedVariant.attributes;
                                        if (typeof attrObj === 'string') {
                                            try { attrObj = JSON.parse(attrObj); } catch(e) {}
                                        } else if (attrObj instanceof Map) {
                                            attrObj = Object.fromEntries(attrObj);
                                        }
                                        if (attrObj && attrObj.Size && attrObj.Size.split(',').length > 1) {
                                            requiresSize = true;
                                        }
                                        if (attrObj && attrObj.Color) {
                                            parsedColor = attrObj.Color;
                                        }
                                    }

                                    if (requiresSize && !selectedSize) {
                                        setCartStatus({ type: 'error', message: 'Please select a size to continue.'});
                                        return;
                                    }

                                    // Pass the selection logic securely
                                    handleAddItem({
                                        productId: product._id,
                                        variantId: selectedVariant?._id || "none",
                                        size: selectedSize,
                                        color: parsedColor
                                    }).then(() => setCartStatus({ type: 'success', message: 'Item perfectly added to cart!' }))
                                      .catch(err => {
                                          console.error("Cart Error:", err);
                                          const apiMessage = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to add to cart. Please try again.';
                                          setCartStatus({ type: 'error', message: apiMessage });
                                      });
                                } }
                                className="w-full h-14 rounded-xl text-sm font-bold uppercase tracking-[0.1em] text-white flex items-center justify-center gap-2 border-[1.5px] border-[#4a4455] hover:bg-[#1b1b22] hover:border-[#958da1] transition-all">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                Add to Cart
                            </button>

                            <button
                                className="w-full h-14 rounded-xl text-sm font-bold uppercase tracking-[0.1em] text-[#0e0e15] shadow-[0_0_20px_rgba(124,58,237,0.2)] hover:shadow-[0_0_30px_rgba(124,58,237,0.4)] transition-all transform hover:scale-[1.01] active:scale-[0.99]"
                                style={{
                                    background: 'linear-gradient(135deg, #eaddff 0%, #d2bbff 50%, #bd9dff 100%)'
                                }}
                            >
                                Buy Now
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex items-center justify-center gap-6 mt-6 pt-4">
                            <div className="flex items-center gap-2 text-xs text-[#958da1]">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                Verified Seller
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[#958da1]">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                Secure Transaction
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProductDetails;