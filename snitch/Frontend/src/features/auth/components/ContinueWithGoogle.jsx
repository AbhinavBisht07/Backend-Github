import React from 'react'
import GoogleIcon from './GoogleIcon'

const ContinueWithGoogle = () => {
    return (
        <>
            {/* ── Social Login ── */}
            <div className="flex items-center gap-3 my-0.5">
                <div className="h-px bg-[#48474F]/40 flex-1"></div>
                <span className="text-[10px] text-[#ACAAB4] uppercase tracking-widest font-bold">Or continue with</span>
                <div className="h-px bg-[#48474F]/40 flex-1"></div>
            </div>

            <a
                href="/api/auth/google"
                className="
                w-full flex items-center justify-center gap-3
                bg-[#13131A] text-[#E7E4EE] 
                border border-[#48474F]/40 rounded-xl
                py-3 px-4
                text-sm font-bold tracking-wide
                transition-all duration-200
                hover:bg-[#1C1C24] hover:border-[#7C3AED]/50 hover:shadow-[0_0_15px_rgba(124,58,237,0.15)]
                active:scale-[0.98]
              "
            >
                <GoogleIcon />
                Continue with Google
            </a>
        </>
    )
}

export default ContinueWithGoogle