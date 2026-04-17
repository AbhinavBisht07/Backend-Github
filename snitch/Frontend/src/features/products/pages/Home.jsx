import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useProduct } from '../hook/useProduct';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const PublicProductCard = ({ product }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const imagesCount = product.images?.length || 0;

    const navigate = useNavigate();
    
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
            <div className="relative aspect-[4/5] overflow-hidden bg-[#0e0e15] group/carousel cursor-pointer">
                <img 
                    src={image} 
                    alt={`${product.title} - Image ${currentImageIndex + 1}`} 
                    className="w-full h-full object-contain p-2 transition-transform duration-700"
                />

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
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
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
            
            {/* Details & Actions */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex flex-col gap-1 mb-2">
                    <h2 className="text-lg font-bold text-white leading-tight truncate">{product.title}</h2>
                    <p className="text-md font-semibold text-[#d2bbff]">
                        {product.price?.amount?.toLocaleString('en-US') || 0} {product.price?.currency || 'USD'}
                    </p>
                </div>
                
                <p className="text-sm text-[#958da1] line-clamp-2 mb-6 flex-1 mt-1">
                    {product.description}
                </p>
                
                {/* Actions */}
                <div className="mt-auto pt-4 border-t border-[#4a4455]/20">
                    <button
                    onClick={()=>{
                        navigate(`/product/${product._id}`)
                    }} 
                    className="w-full py-3 rounded-lg text-xs font-bold uppercase tracking-widest text-[#13131a] bg-[#d2bbff] hover:bg-[#7C3AED] hover:text-white transition-colors duration-300">
                        View Details
                    </button>
                </div>
            </div>

        </div>
    );
};

const Home = () => {

    const user = useSelector(state => state.auth.user);
    const allProducts = useSelector((state) => state.product.allProducts);
    const { handleGetAllProducts } = useProduct();

    useEffect(() => {
        handleGetAllProducts();
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
            <main className="max-w-7xl mx-auto px-5 sm:px-8 py-10 lg:py-16">
                
                {/* ── Hero / Page Header ── */}
                <div className="flex flex-col items-center text-center justify-center mb-16 mt-8">
                    <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-4 text-white tracking-tight font-semibold max-w-3xl leading-tight">
                        Discover Curated <br className="hidden sm:block"/> Streetwear Archives
                    </h1>
                    <p className="text-base sm:text-lg text-[#ccc3d8] font-medium max-w-2xl">
                        Shop rare finds, exclusive drops, and verified pieces from our community of sellers.
                    </p>
                </div>

                {/* ── Product Grid ── */}
                {allProducts?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {allProducts.map((product) => (
                            <PublicProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    /* ── Empty State ── */
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl bg-[#13131a] border border-[#4a4455]/10">
                        <div className="w-16 h-16 mb-4 rounded-full bg-[#1b1b22] flex items-center justify-center text-[#7c3aed]">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2 tracking-tight font-semibold">The archive is empty.</h3>
                        <p className="text-sm text-[#958da1] mb-6 max-w-sm">
                            There are currently no active listings on Snitch. Check back later or start selling your own pieces.
                        </p>
                        {user?.role === 'seller' && (
                            <Link 
                                to="/seller/create-product"
                                className="text-xs font-bold uppercase tracking-widest text-[#d2bbff] hover:text-white hover:underline underline-offset-4"
                            >
                                Publish a listing →
                            </Link>
                        )}
                    </div>
                )}
            </main>

        </div>
    );
};

export default Home;