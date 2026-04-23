import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCart } from '../../cart/hook/useCart';

const Nav = () => {
    const user = useSelector(state => state.auth?.user);
    const cartItems = useSelector(state => state.cart?.items) || [];
    const { handleGetCart } = useCart();

    // Fetch cart if logged in so the badge is up to date
    useEffect(() => {
        if (user && user.role !== 'seller') {
            handleGetCart().catch(err => console.log('Cart fetch skipped/error'));
        }
    }, [user]);

    const totalItems = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

    return (
        <header className="sticky top-0 z-50 bg-[#0e0e15]/80 backdrop-blur-md border-b-[0.5px] border-[#4a4455]/20">
            <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
                
                <div className="flex items-center gap-8">
                    <Link to="/" className="text-xl font-bold tracking-tighter text-white font-semibold hover:opacity-80 transition-opacity flex items-center gap-2">
                        <div className="w-6 h-6 bg-[#7C3AED] rounded flex items-center justify-center">
                            <span className="text-white text-xs leading-none">S</span>
                        </div>
                        SNITCH.
                    </Link>
                    
                    {/* Navigation Links - Optional additions */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link to="/" className="text-xs font-bold uppercase tracking-widest text-[#958da1] hover:text-[#d2bbff] transition-colors">
                            New Drops
                        </Link>
                        <Link to="/" className="text-xs font-bold uppercase tracking-widest text-[#958da1] hover:text-[#d2bbff] transition-colors">
                            Clothing
                        </Link>
                    </nav>
                </div>
                
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
                        <div className="flex items-center gap-5">
                            {user.role !== 'seller' && (
                                <Link to="/cart" className="relative text-[#958da1] hover:text-[#d2bbff] transition-colors flex items-center justify-center h-10 w-10">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    {totalItems > 0 && (
                                        <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#7c3aed] text-[9px] font-bold text-white">
                                            {totalItems}
                                        </span>
                                    )}
                                </Link>
                            )}
                            
                            <div className="relative group cursor-pointer">
                                <div className="w-8 h-8 rounded-full bg-[#1b1b22] border-2 border-[#1b1b22] overflow-hidden group-hover:border-[#7C3AED]/50 transition-colors">
                                    <img 
                                        src={`https://ui-avatars.com/api/?name=${user.fullname || 'ST'}&background=7c3aed&color=fff`} 
                                        alt="Avatar" 
                                        className="w-full h-full object-cover" 
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Nav;