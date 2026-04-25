import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const OrderSuccess = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get("order_id") || "SN-ORDER-X";

    return (
        <div className="min-h-screen bg-[#0e0e15] text-white flex flex-col items-center justify-center px-6 selection:bg-[#7c3aed]/30">
            {/* Visual Confirmation */}
            <div className="relative mb-10">
                <div className="absolute inset-0 bg-[#7c3aed]/20 blur-[60px] rounded-full scale-150 animate-pulse"></div>
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-[#7c3aed] to-[#d2bbff] flex items-center justify-center shadow-[0_0_40px_rgba(124,58,237,0.3)]">
                    <svg className="w-12 h-12 text-[#0e0e15]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            </div>

            {/* Typography */}
            <h1 className="text-4xl sm:text-6xl font-black text-center mb-4 tracking-tighter uppercase font-epilogue italic italic-none">
                Order Placed
            </h1>
            <p className="text-[#958da1] text-center mb-12 max-w-sm font-manrope font-medium lowercase tracking-wide">
                Your drip is on the way. we've started prepping your selection for dispatch.
            </p>

            {/* Order Info Card */}
            <div className="w-full max-w-md p-6 rounded-3xl bg-[#13131a] border border-[#1b1b22] mb-12 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-[#4a4455] font-bold uppercase tracking-[0.2em] mb-1">Order ID</span>
                        <span className="text-sm font-bold text-[#d2bbff] font-mono">#{orderId}</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-[#4a4455] font-bold uppercase tracking-[0.2em] mb-1">Estimated Delivery</span>
                        <span className="text-sm font-bold text-white">4-6 Business Days</span>
                    </div>
                </div>
                <div className="h-[1px] bg-[#1b1b22] w-full mb-6"></div>
                <p className="text-xs text-[#958da1] leading-relaxed">
                    A confirmation email has been sent. You can track your shipping status in your dashboard.
                </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <Link
                    to="/"
                    className="flex-1 h-14 rounded-xl flex items-center justify-center text-xs font-black uppercase tracking-[0.15em] text-[#0e0e15] shadow-[0_0_30px_rgba(124,58,237,0.2)] hover:shadow-[0_0_40px_rgba(124,58,237,0.4)] transition-all transform hover:-translate-y-1 active:translate-y-0"
                    style={{
                        background: 'linear-gradient(135deg, #d2bbff 0%, #bd9dff 50%, #7c3aed 100%)'
                    }}
                >
                    Continue Shopping
                </Link>
                <Link
                    to="/dashboard"
                    className="flex-1 h-14 rounded-xl flex items-center justify-center text-xs font-black uppercase tracking-[0.15em] text-white bg-[#1b1b22] border-[1.5px] border-[#4a4455] hover:border-[#d2bbff] transition-all transform hover:-translate-y-1 active:translate-y-0"
                >
                    View Orders
                </Link>
            </div>

            <p className="mt-12 text-[10px] text-[#4a4455] font-bold uppercase tracking-[0.2em]">
                Snitch &copy; MMXXIV ATELIER
            </p>
        </div>
    );
};

export default OrderSuccess;