import React from 'react';
import { Link } from 'react-router-dom';

const OrderFailed = () => {
    return (
        <div className="min-h-screen bg-[#0e0e15] text-white flex flex-col items-center justify-center px-6 selection:bg-red-500/20">
            {/* Visual Warning */}
            <div className="relative mb-10 group">
                <div className="absolute inset-0 bg-red-500/20 blur-[60px] rounded-full scale-150 animate-pulse group-hover:bg-red-500/30 transition-all"></div>
                <div className="relative w-24 h-24 rounded-full bg-[#1b1b22] border-2 border-red-500/50 flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.2)]">
                    <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                {/* Glitch Effect Elements */}
                <div className="absolute -top-1 -left-1 w-full h-full border border-red-500/30 rounded-full animate-ping opacity-20"></div>
            </div>

            {/* Typography */}
            <h1 className="text-4xl sm:text-7xl font-black text-center mb-4 tracking-tighter uppercase font-epilogue italic skew-x-[-4deg] text-red-500">
                Payment Failed
            </h1>
            <p className="text-[#958da1] text-center mb-12 max-w-sm font-manrope font-medium lowercase tracking-wide leading-relaxed">
                Transaction declined. Your order could not be processed. Let's fix that drip and try again.
            </p>

            {/* Error Detail Card */}
            <div className="w-full max-w-md p-6 rounded-3xl bg-[#13131a] border border-red-500/20 mb-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500/50"></div>
                <div className="flex justify-between items-center mb-6">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-[#4a4455] font-bold uppercase tracking-[0.2em] mb-1">Status Code</span>
                        <span className="text-sm font-bold text-red-400 font-mono">SN-PAY-FAIL-77</span>
                    </div>
                </div>
                <p className="text-xs text-[#958da1] leading-relaxed">
                    Common reasons: Insufficient funds, invalid card details, or authorization timeout. Please check your payment method and retry.
                </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <Link
                    to="/cart"
                    className="flex-1 h-14 rounded-xl flex items-center justify-center text-xs font-black uppercase tracking-[0.15em] text-white bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:bg-red-500 transition-all transform hover:-translate-y-1 active:translate-y-0"
                >
                    Try Again
                </Link>
                <Link
                    to="/"
                    className="flex-1 h-14 rounded-xl flex items-center justify-center text-xs font-black uppercase tracking-[0.15em] text-white bg-[#1b1b22] border-[1.5px] border-[#4a4455] hover:border-red-500 transition-all transform hover:-translate-y-1 active:translate-y-0"
                >
                    Back to Shop
                </Link>
            </div>

            <button className="mt-12 text-[10px] text-[#4a4455] font-bold uppercase underline underline-offset-4 tracking-[0.2em] hover:text-[#958da1] transition-colors">
                Contact Concierge Support
            </button>
        </div>
    );
};

export default OrderFailed;
