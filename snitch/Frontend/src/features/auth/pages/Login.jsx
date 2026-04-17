import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import ContinueWithGoogle from "../components/ContinueWithGoogle";

// ── Icons (inline SVG to avoid extra deps) ──────────────────────────────────

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

// ── Input Field Component ───────────────────────────────────────────────────

const InputField = ({ id, label, type, placeholder, icon, value, onChange, rightElement }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-[11px] font-bold uppercase tracking-wider text-[#ACAAB4]">
      {label}
    </label>
    <div className="relative flex items-center">
      <span className="absolute left-4 text-[#ACAAB4] pointer-events-none">{icon}</span>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete="off"
        className="
          w-full bg-[#13131A] text-[#E7E4EE] placeholder-[#48474F]
          border border-[#48474F]/40 rounded-xl
          pl-10 pr-10 py-3
          text-[13px] font-medium
          outline-none transition-all duration-200
          focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/30
          hover:border-[#7C3AED]/50
        "
      />
      {rightElement && (
        <span className="absolute right-4">{rightElement}</span>
      )}
    </div>
  </div>
);

// ── Login Page ──────────────────────────────────────────────────────────────

const Login = () => {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const heroImages = [
    "/hero-image.png",
    "/hero-image-girl.png"
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000); // 5 seconds crossfade
    return () => clearInterval(interval);
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      setLoading(true);
      const user = await handleLogin(form);
      if(user.role === "seller"){
        navigate("/seller/dashboard");
      }else{
        navigate("/");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex font-sans antialiased tracking-tight bg-[#0E0E15]">
      
      {/* ── Left Side Image Slideshow & Overlay (Hidden on Mobile) ── */}
      <div className="hidden lg:flex lg:w-[55%] relative h-screen sticky top-0 overflow-hidden bg-[#0E0E15] flex-col justify-between p-12">
        {/* Background Images */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((src, idx) => (
            <img 
              key={src}
              src={src} 
              alt="Cool Streetwear Fashion Model" 
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1500ms] ease-in-out ${
                idx === currentImageIndex ? "opacity-90 scale-100" : "opacity-0 scale-105"
              }`}
            />
          ))}
          {/* Gradient fade to make text ultra readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0E0E15]/20 to-[#0E0E15] pointer-events-none" />
        </div>

        {/* Text Overlay Top */}
        <div className="relative z-10 w-full select-none">
          <h1 className="text-[#7C3AED] text-2xl font-extrabold tracking-[0.2em] uppercase drop-shadow-xl" style={{ textShadow: "0 4px 12px rgba(0,0,0,0.5)"}}>
            SNITCH.
          </h1>
        </div>

        {/* Text Overlay Bottom */}
        <div className="relative z-10 w-full max-w-lg select-none mb-4">
          <h2 className="text-white text-5xl font-bold tracking-tight mb-4" style={{ textShadow: "0 4px 20px rgba(0,0,0,0.5)"}}>
             Welcome
          </h2>
          <h2 className="text-[#7C3AED] text-5xl font-bold tracking-tight mb-4" style={{ textShadow: "0 4px 20px rgba(0,0,0,0.5)"}}>
             back.
          </h2>
          <p className="text-[#e7e4ee] text-base font-medium leading-relaxed drop-shadow-md">
             Sign in to your account and keep exploring the freshest drops, curated styles, and premium aesthetic on Snitch.
          </p>
        </div>
      </div>

      {/* ── Right Side Form ── */}
      <div className="w-full lg:w-[45%] flex flex-col items-center justify-center py-10 px-4 overflow-y-auto relative">
        
        {/* Ambient glow blob for the form side */}
        <div
          className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full opacity-15 blur-3xl mix-blend-screen"
          style={{ background: "radial-gradient(circle, #7C3AED 0%, transparent 60%)" }}
        />

        {/* Glass card container layout: slightly wider and smaller paddings to fit vertically */}
        <div
          className="relative w-full max-w-[460px] rounded-[24px] p-6 sm:p-8 flex flex-col gap-6 m-auto"
          style={{
            background: "linear-gradient(180deg, rgba(25, 25, 33, 0.8) 0%, rgba(19, 19, 26, 0.9) 100%)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(124, 58, 237, 0.15)",
            boxShadow: "0 24px 40px -8px rgba(0,0,0,0.5), 0 0 40px -10px rgba(124,58,237,0.1)",
          }}
        >
          {/* ── Branding ── */}
          <div className="flex flex-col items-center gap-1.5 text-center">
            <h1
              className="text-2xl font-extrabold tracking-tight lg:hidden"
              style={{
                background: "linear-gradient(135deg, #E5C4FF 0%, #7C3AED 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              SNITCH
            </h1>
            <h2 className="text-[#E7E4EE] text-xl font-bold hidden lg:block">Welcome back</h2>
            <p className="text-[#ACAAB4] text-xs font-medium">Continue your journey</p>
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

            <InputField
              id="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              icon={<MailIcon />}
              value={form.email}
              onChange={handleChange("email")}
            />

            <InputField
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              icon={<LockIcon />}
              value={form.password}
              onChange={handleChange("password")}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="text-[#acaab4] hover:text-[#bd9dff] transition-colors duration-150 focus:outline-none"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              }
            />

            

            {/* ── Error message ── */}
            {error && (
              <p className="text-sm text-[#ff6e84] text-center font-medium -mt-1">{error}</p>
            )}

            {/* ── Submit button ── */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-3 rounded-xl text-sm font-bold tracking-wide text-white flex items-center justify-center
                transition-all duration-200 mt-2
                focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50 focus:ring-offset-2 focus:ring-offset-[#0E0E15]
                disabled:opacity-50 disabled:cursor-not-allowed
                hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]
              "
              style={{
                background: loading
                  ? "#3d1d7a"
                  : "linear-gradient(135deg, #bd9dff 0%, #7C3AED 60%, #5B21B6 100%)",
                boxShadow: "0 0 24px rgba(124,58,237,0.35)",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in…
                </span>
              ) : (
                "Sign In"
              )}
            </button>

            <ContinueWithGoogle />
          </form>

          {/* ── Footer link ── */}
          <p className="text-center text-sm text-[#ACAAB4] mt-2">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#bd9dff] hover:text-white transition-colors duration-150 underline-offset-4 hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;