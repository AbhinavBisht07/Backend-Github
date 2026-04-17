import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import ContinueWithGoogle from "../components/ContinueWithGoogle";

// ── Icons (inline SVG to avoid extra deps) ──────────────────────────────────

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 11.93a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.08 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
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

const StoreIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
    <path d="M2 7h20" />
    <path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7" />
  </svg>
);

// ── Input Field Component 

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



// ── Register Page ───────────────────────────────────────────────────────────

const Register = () => {
  const { handleRegister } = useAuth();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    contact: "",
    password: "",
    isSeller: false,
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
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.fullname || !form.email || !form.contact || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      setLoading(true);
      await handleRegister({
        email: form.email,
        contact: form.contact,
        password: form.password,
        fullname: form.fullname,
        isSeller: form.isSeller
      });
      navigate("/");
    } catch (err) {
      console.log(err);
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
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
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1500ms] ease-in-out ${idx === currentImageIndex ? "opacity-90 scale-100" : "opacity-0 scale-105"
                }`}
            />
          ))}
          {/* Gradient fade to make text ultra readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0E0E15]/20 to-[#0E0E15] pointer-events-none" />
        </div>

        {/* Text Overlay Top */}
        <div className="relative z-10 w-full select-none">
          <h1 className="text-[#7C3AED] text-2xl font-extrabold tracking-[0.2em] uppercase drop-shadow-xl" style={{ textShadow: "0 4px 12px rgba(0,0,0,0.5)" }}>
            SNITCH.
          </h1>
        </div>

        {/* Text Overlay Bottom */}
        <div className="relative z-10 w-full max-w-lg select-none mb-4">
          <h2 className="text-white text-5xl font-bold tracking-tight mb-4" style={{ textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
            Define your
          </h2>
          <h2 className="text-[#7C3AED] text-5xl  font-bold tracking-tight mb-4" style={{ textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
            aesthetic.
          </h2>
          <p className="text-[#e7e4ee] text-base font-medium leading-relaxed drop-shadow-md">
            Join the definitive community for modern streetwear. Discover exclusive drops, trade premium styles, and curate your aesthetic.
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
            <h2 className="text-[#E7E4EE] text-xl font-bold hidden lg:block">Create Account</h2>
            <p className="text-[#ACAAB4] text-xs font-medium">Join the culture today</p>
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>

            <InputField
              id="fullname"
              label="Full Name"
              type="text"
              placeholder="John Doe"
              icon={<UserIcon />}
              value={form.fullname}
              onChange={handleChange("fullname")}
            />

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
              id="contact"
              label="Contact Number"
              type="tel"
              placeholder="+91 98765 43210"
              icon={<PhoneIcon />}
              value={form.contact}
              onChange={handleChange("contact")}
            />

            <InputField
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Min. 8 characters"
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

            {/* ── isSeller toggle row ── */}
            <div
              className="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer select-none group mt-1"
              style={{ background: "#13131A", border: "1px solid rgba(72,71,79,0.3)" }}
              onClick={() => setForm((prev) => ({ ...prev, isSeller: !prev.isSeller }))}
            >
              <div className="flex items-center gap-3">
                <span className="text-[#ACAAB4] group-hover:text-[#bd9dff] transition-colors duration-150">
                  <StoreIcon />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#E7E4EE]">Register as a Seller</p>
                  <p className="text-[11px] leading-tight text-[#ACAAB4] mt-0.5">List and sell products on Snitch</p>
                </div>
              </div>

              {/* Pill toggle */}
              <div
                className={`relative w-10 h-5 rounded-full transition-all duration-300 flex-shrink-0 ${form.isSeller ? "bg-[#7C3AED]" : "bg-[#25252F]"
                  }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${form.isSeller ? "left-5" : "left-1"
                    }`}
                />
                <input
                  id="isSeller"
                  type="checkbox"
                  checked={form.isSeller}
                  onChange={handleChange("isSeller")}
                  className="sr-only"
                  readOnly
                />
              </div>
            </div>


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
                  Creating Account…
                </span>
              ) : (
                "Create Account"
              )}
            </button>

            <ContinueWithGoogle />
          </form>

          {/* ── Footer link ── */}
          <p className="text-center text-sm text-[#ACAAB4] mt-2">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#bd9dff] hover:text-white transition-colors duration-150 underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;