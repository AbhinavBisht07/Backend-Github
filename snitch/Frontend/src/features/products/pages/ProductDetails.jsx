import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useProduct } from '../hook/useProduct';

const ProductDetails = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isGalleryHovered, setIsGalleryHovered] = useState(false);
    
    const { handleGetProductDetails } = useProduct();
    const thumbnailRef = useRef(null);
    const user = useSelector(state => state.auth.user);

    async function fetchProductDetails(){
        try {
            setIsLoading(true);
            const data = await handleGetProductDetails(productId);
            setProduct(data);
            setActiveImageIndex(0);
        } catch (error) {
            console.error("Failed to fetch product:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(()=>{
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

    const images = product.images || [];
    const activeImage = images[activeImageIndex]?.url || images[activeImageIndex]?.secure_url || images[activeImageIndex]?.src || "https://placehold.co/800x800/1b1b22/7c3aed?text=No+Image";

    return (
        <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-[#0e0e15] text-[#e4e1eb] font-sans antialiased tracking-tight flex flex-col">
            
            {/* ── Navbar ── */}
            <header className="sticky top-0 z-50 bg-[#0e0e15]/80 backdrop-blur-md border-b-[0.5px] border-[#4a4455]/20">
                <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
                    <Link to="/" className="text-xl font-bold tracking-tighter text-white tracking-tight font-semibold hover:opacity-80 transition-opacity flex items-center gap-2">
                        <div className="w-6 h-6 bg-[#7C3AED] rounded flex items-center justify-center">
                            <span className="text-white text-xs leading-none">S</span>
                        </div>
                        SNITCH.
                    </Link>
                    
                    <div className="flex items-center gap-6">
                        {user?.role === 'seller' && (
                            <Link to="/seller/dashboard" className="text-xs font-bold uppercase tracking-widest text-[#d2bbff] hover:text-white transition-colors hidden sm:block">
                                Seller Dashboard
                            </Link>
                        )}
                        {!user ? (
                            <Link to="/login" className="text-xs font-bold uppercase tracking-widest text-white px-4 py-2 rounded bg-[#7c3aed] hover:bg-[#523787] transition-colors">
                                Sign In
                            </Link>
                        ) : (
                            <div className="relative group cursor-pointer">
                                <div className="w-8 h-8 rounded-full bg-[#1b1b22] border-2 border-[#1b1b22] overflow-hidden group-hover:border-[#7C3AED]/50 transition-colors">
                                    <img src={`https://ui-avatars.com/api/?name=${user.fullname || 'St'}&background=7c3aed&color=fff`} alt="Avatar" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* ── Main Content ── */}
            <main className="max-w-7xl mx-auto w-full px-5 sm:px-8 py-6 lg:py-8 lg:h-[calc(100vh-64px)] flex flex-col lg:overflow-hidden">
                
                {/* Back Link */}
                <Link to="/" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-[#958da1] hover:text-[#d2bbff] transition-colors mb-4 lg:mb-6 shrink-0">
                    <span className="text-lg leading-none mr-2 mt-[-2px]">←</span> Home
                </Link>

                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16 flex-1 min-h-0">
                    
                    {/* ── Left Column: Image Gallery ── */}
                    <div 
                        className="flex flex-col gap-3 w-full h-full min-h-[300px]"
                        onMouseEnter={() => setIsGalleryHovered(true)}
                        onMouseLeave={() => setIsGalleryHovered(false)}
                    >
                        {/* Main Image — always object-contain so nothing is cropped */}
                        <div className="relative aspect-square lg:aspect-auto lg:flex-1 bg-[#13131a] rounded-2xl overflow-hidden lg:min-h-0 flex items-center justify-center">
                            <img 
                                src={activeImage} 
                                alt={product.title} 
                                className="w-full h-full object-contain p-3"
                            />
                        </div>

                        {/* Thumbnail Strip */}
                        {images.length > 1 && (
                            <div 
                                ref={thumbnailRef}
                                onWheel={(e) => {
                                    e.preventDefault();
                                    thumbnailRef.current.scrollLeft += e.deltaY;
                                }}
                                className="flex gap-2.5 overflow-x-auto rounded-xl bg-[#13131a] p-2.5 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full"
                                style={{ 
                                    scrollbarWidth: 'thin', 
                                    scrollbarColor: isGalleryHovered ? 'rgba(124,58,237,0.5) transparent' : 'rgba(74,68,85,0.5) transparent'
                                }}
                            >
                                {images.map((img, idx) => {
                                    const src = img.url || img.secure_url || img.src;
                                    const isActive = idx === activeImageIndex;
                                    return (
                                        <button 
                                            key={idx}
                                            onClick={() => setActiveImageIndex(idx)}
                                            className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shrink-0 transition-all duration-200 ${
                                                isActive 
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
                    <div className="flex flex-col lg:overflow-y-auto pr-0 lg:pr-4 pb-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#4a4455]/50 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#7c3aed]/50">
                        
                        <div className="mb-8">
                            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white tracking-tight font-semibold mb-4 leading-tight">
                                {product.title}
                            </h1>
                            <div className="flex items-end gap-3 mb-8">
                                <p className="text-2xl sm:text-3xl font-semibold text-[#d2bbff]">
                                    {product.price?.amount?.toLocaleString('en-US') || 0}
                                </p>
                                <span className="text-sm font-bold tracking-widest uppercase text-[#958da1] mb-1.5">
                                    {product.price?.currency || 'USD'}
                                </span>
                            </div>
                            
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
                            <button className="w-full h-14 rounded-xl text-sm font-bold uppercase tracking-[0.1em] text-white flex items-center justify-center gap-2 border-[1.5px] border-[#4a4455] hover:bg-[#1b1b22] hover:border-[#958da1] transition-all">
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