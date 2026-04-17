import React, { useEffect, useState } from 'react';
import { useProduct } from '../hook/useProduct';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const imagesCount = product.images?.length || 0;
    
    // Safely get the active image
    const activeImageObj = product.images?.[currentImageIndex];
    const image = activeImageObj?.url || activeImageObj?.secure_url || activeImageObj?.src || "https://placehold.co/600x600/1b1b22/7c3aed?text=No+Image";

    const nextImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % imagesCount);
    };

    const prevImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + imagesCount) % imagesCount);
    };

    return (
        <div className="group flex flex-col bg-[#13131a] rounded-2xl overflow-hidden hover:bg-[#1b1b22] transition-colors duration-300">
            
            {/* Image Container with Carousel Controls */}
            <div className="relative aspect-square overflow-hidden bg-[#0e0e15] group/carousel">
                <img 
                    src={image} 
                    alt={`${product.title} - Image ${currentImageIndex + 1}`} 
                    className="w-full h-full object-contain p-2 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-[#7C3AED] text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded shadow-lg z-10">
                    Published
                </div>

                {/* Carousel Arrows (only if more than 1 image) */}
                {imagesCount > 1 && (
                    <>
                        <button 
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-[#0e0e15]/50 text-white opacity-0 group-hover/carousel:opacity-100 hover:bg-[#7c3aed] transition-all z-10 backdrop-blur-sm"
                            aria-label="Previous image"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button 
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-[#0e0e15]/50 text-white opacity-0 group-hover/carousel:opacity-100 hover:bg-[#7c3aed] transition-all z-10 backdrop-blur-sm"
                            aria-label="Next image"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                        </button>
                        
                        {/* Image Indicators */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                            {product.images.map((_, idx) => (
                                <div 
                                    key={idx} 
                                    className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${
                                        idx === currentImageIndex 
                                            ? 'w-4 bg-[#d2bbff]' 
                                            : 'w-1.5 bg-[#e4e1eb]/50'
                                    }`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
            
            {/* Details */}
            <div className="p-5 sm:p-6 flex flex-col flex-1">
                <div className="flex flex-col gap-1.5 mb-2">
                    <h2 className="text-xl font-bold text-white leading-tight truncate">{product.title}</h2>
                    <p className="text-md font-semibold text-[#d2bbff]">
                        {product.price?.amount?.toLocaleString('en-US') || 0} {product.price?.currency || 'USD'}
                    </p>
                </div>
                
                <p className="text-sm text-[#958da1] line-clamp-2 mb-6 flex-1 mt-1">
                    {product.description}
                </p>
                
                {/* Actions */}
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-[#4a4455]/20">
                    <button className="flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest text-[#ccc3d8] hover:text-white hover:bg-[#4a4455]/30 transition-colors">
                        Edit
                    </button>
                    <button className="flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest text-[#ffb4ab] hover:text-white hover:bg-[#93000a]/50 transition-colors">
                        Delete
                    </button>
                </div>
            </div>

        </div>
    );
};

const Dashboard = () => {
    const { handleGetSellerProducts } = useProduct();
    const sellerProducts = useSelector((state) => state.product.sellerProducts);

    useEffect(() => {
        handleGetSellerProducts();
    }, []);

    return (
        <div className="min-h-screen bg-[#0e0e15] text-[#e4e1eb] font-sans antialiased tracking-tight">
            
            {/* ── Navbar ── */}
            <header className="sticky top-0 z-50 bg-[#0e0e15]/80 backdrop-blur-md border-b-[0.5px] border-[#4a4455]/20">
                <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
                    <Link to="/" className="text-xl font-bold tracking-tighter text-white tracking-tight font-semibold hover:opacity-80 transition-opacity flex items-center gap-2">
                        <div className="w-6 h-6 bg-[#7C3AED] rounded flex items-center justify-center">
                            <span className="text-white text-xs leading-none">S</span>
                        </div>
                        SNITCH.
                    </Link>
                    
                    <div className="relative group cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-[#1b1b22] border-2 border-[#1b1b22] overflow-hidden group-hover:border-[#7C3AED]/50 transition-colors">
                            <img src="https://ui-avatars.com/api/?name=St&background=7c3aed&color=fff" alt="User Avatar" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Main Content ── */}
            <main className="max-w-7xl mx-auto px-5 sm:px-8 py-10 lg:py-16">
                
                {/* ── Page Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2 text-white tracking-tight font-semibold">Your Listings</h1>
                        <p className="text-sm text-[#ccc3d8] font-medium">Manage and view all your published products.</p>
                    </div>
                    <Link 
                        to="/seller/create-product"
                        className="
                            inline-flex items-center justify-center h-12 px-8 rounded-xl text-sm font-bold uppercase tracking-[0.1em] text-white shrink-0
                            transition-all duration-200 shadow-[0_0_20px_rgba(124,58,237,0.15)]
                            hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(124,58,237,0.25)] active:scale-[0.98]
                        "
                        style={{
                            background: 'linear-gradient(135deg, #d2bbff 0%, #7C3AED 50%, #523787 100%)'
                        }}
                    >
                        <span className="mr-2 text-lg leading-none">+</span> New Listing
                    </Link>
                </div>

                {/* ── Product Grid ── */}
                {sellerProducts?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {sellerProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    /* ── Empty State ── */
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl bg-[#13131a] border border-[#4a4455]/10">
                        <div className="w-16 h-16 mb-4 rounded-full bg-[#1b1b22] flex items-center justify-center text-[#7c3aed]">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2 tracking-tight font-semibold">No listings yet</h3>
                        <p className="text-sm text-[#958da1] mb-6 max-w-sm">
                            Your marketplace dashboard is empty. Create your first product listing to start selling to the Snitch community.
                        </p>
                        <Link 
                            to="/seller/create-product"
                            className="text-xs font-bold uppercase tracking-widest text-[#d2bbff] hover:text-white hover:underline underline-offset-4"
                        >
                            Create a product →
                        </Link>
                    </div>
                )}
            </main>

        </div>
    );
};

export default Dashboard;