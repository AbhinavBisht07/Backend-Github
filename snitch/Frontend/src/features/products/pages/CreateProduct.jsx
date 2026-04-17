import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProduct } from '../hook/useProduct';

// ── Icons ────────────────────────────────────────────────────────────────────

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// ── Field Label ───────────────────────────────────────────────────────────────

const FieldLabel = ({ children }) => (
  <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#ccc3d8] mb-2.5">
    {children}
  </label>
);

// ── Input styles (shared) ─────────────────────────────────────────────────────
const inputCls = `
  w-full bg-[#0e0e15]/90 backdrop-blur-md text-white placeholder-[#6b6780]
  border border-[#4a4455]/40 rounded-lg
  px-4 py-3 text-sm font-medium font-sans antialiased tracking-tight
  outline-none transition-all duration-200
  focus:border-[#7C3AED]/60 focus:shadow-[0_0_0_3px_rgba(124,58,237,0.12)]
  hover:border-[#4a4455]/60
`;

// ── CreateProduct Page ────────────────────────────────────────────────────────

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'AED', 'JPY'];
const MAX_IMAGES = 7;

const CreateProduct = () => {
  const navigate = useNavigate();
  const { handleCreateProduct } = useProduct();
  const fileInputRef = useRef(null);
  const dropRef = useRef(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    priceAmount: '',
    priceCurrency: 'INR',
  });

  const [images, setImages] = useState([]); // [{file, preview}]
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ── Helpers ──────────────────────────────────────────────────────────────

  const addFiles = useCallback((files) => {
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) return;
    const valid = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, remaining);
    const previews = valid.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...previews]);
    setError('');
  }, [images.length]);

  const removeImage = (idx) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // ── Drag & Drop ──────────────────────────────────────────────────────────

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  // ── Submit ───────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (!form.priceAmount || isNaN(form.priceAmount)) { setError('Enter a valid price.'); return; }
    if (images.length === 0) { setError('Upload at least one product image.'); return; }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('priceAmount', form.priceAmount);
      formData.append('priceCurrency', form.priceCurrency);
      images.forEach(({ file }) => formData.append('images', file));
      await handleCreateProduct(formData);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      className="min-h-screen font-sans antialiased tracking-tight relative"
      style={{ color: '#e4e1eb' }}
    >
      {/* ── Background Image Layer ── */}
      <div className="fixed inset-0 z-0">
        <img
          src="/streetwear-bg.png"
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Heavy dark overlay so form is perfectly readable */}
        <div className="absolute inset-0 bg-[#0e0e15]/80" />
        {/* Subtle purple vignette */}
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: 'radial-gradient(ellipse at 50% 20%, rgba(124,58,237,0.3) 0%, transparent 70%)' }}
        />
      </div>

      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-20 bg-[#0e0e15]/70 backdrop-blur-xl border-b border-[#4a4455]/15">
        <div className="max-w-2xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#ccc3d8] hover:text-white transition-colors duration-150 text-sm font-medium"
          >
            <ArrowLeftIcon />
            <span className="hidden sm:inline">Back</span>
          </button>

          <span
            className="text-base font-extrabold tracking-[0.2em] uppercase"
            style={{
              background: 'linear-gradient(135deg, #d2bbff 0%, #7C3AED 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            SNITCH.
          </span>

          <div className="w-16" /> {/* spacer */}
        </div>
      </header>

      {/* ── Main ── */}
      <main className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 py-4 flex flex-col h-auto lg:h-[calc(100vh-85px)] overflow-hidden">

        {/* Page heading */}
        <div className="mb-6 bg-[#7c3aed00] w-fit p-6 rounded-xl backdrop-blur-sm shrink-0">
          <h1
            className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 text-white"
            style={{ fontFamily: "'Epilogue', 'Manrope', sans-serif", letterSpacing: '-0.02em' }}
          >
            New Listing
          </h1>
          <p className="text-sm text-[#ccc3d8] font-medium">Fill in the details below to publish your product.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-2 lg:gap-12 flex-1 min-h-0" noValidate>

          {/* ── Left Column: Details & Submit ── */}
          <div className="flex flex-col gap-3 lg:gap-5 pr-0 lg:pr-2 pb-0 pt-4 lg:pt-0">
            {/* ── Title ── */}
            <section>
              <FieldLabel>Title</FieldLabel>
              <input
                id="title"
                type="text"
                placeholder="e.g. Nike Air Max 90 — Off White"
                value={form.title}
                onChange={handleChange('title')}
                className={inputCls}
              />
            </section>

            {/* ── Description ── */}
            <section>
              <FieldLabel>Description</FieldLabel>
              <textarea
                id="description"
                rows={3}
                placeholder="Describe the item — condition, size, colourway..."
                value={form.description}
                onChange={handleChange('description')}
                className={`${inputCls} resize-none leading-relaxed`}
              />
            </section>

            {/* ── Price ── */}
            <section>
              <FieldLabel>Price</FieldLabel>
              <div className="flex gap-3">
                <div className="flex-1">
                  <input
                    id="priceAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={form.priceAmount}
                    onChange={handleChange('priceAmount')}
                    className={`${inputCls} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none`}
                  />
                  <p className="text-[10px] text-[#958da1] uppercase tracking-widest mt-1.5 pl-1">Amount</p>
                </div>
                <div className="w-32">
                  <select
                    id="priceCurrency"
                    value={form.priceCurrency}
                    onChange={handleChange('priceCurrency')}
                    className={`${inputCls} cursor-pointer`}
                    style={{ backgroundImage: 'none' }}
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c} className="bg-[#1f1f26]">{c}</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-[#4a4455] uppercase tracking-widest mt-1.5 pl-1">Currency</p>
                </div>
              </div>
            </section>

            {/* ── Error ── */}
            {error && (
              <p className="text-sm font-medium text-[#ffb4ab] mt-2">{error}</p>
            )}

            {/* ── Submit ── */}
            <section className="mt-2 shrink-0">
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full py-4 rounded-xl text-sm font-bold uppercase tracking-[0.1em] text-white
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50 focus:ring-offset-2 focus:ring-offset-[#0e0e15]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  hover:opacity-90 hover:scale-[1.01] active:scale-[0.99]
                "
                style={{
                  background: loading
                    ? '#3d1d7a'
                    : 'linear-gradient(135deg, #d2bbff 0%, #7C3AED 50%, #523787 100%)',
                  boxShadow: '0 0 30px rgba(124,58,237,0.3)',
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Publishing…
                  </span>
                ) : (
                  'Publish Listing'
                )}
              </button>
              <p className="text-center text-[10px] text-[#958da1] uppercase tracking-widest mt-3">
                Your listing will be visible immediately after publishing
              </p>
            </section>
          </div>

          {/* ── Right Column: Images ── */}
          <div className="flex flex-col min-h-[250px] lg:h-full lg:overflow-hidden pb-0">
            <section className="flex flex-col h-full">
              <FieldLabel>Product Images (up to {MAX_IMAGES})</FieldLabel>

              {/* Drop zone */}
              {images.length < MAX_IMAGES && (
                <div
                  ref={dropRef}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    relative flex flex-col items-center justify-center gap-3 flex-1 min-h-[150px]
                    border-2 border-dashed rounded-xl cursor-pointer
                    py-8 px-6 text-center
                    transition-all duration-200
                    ${dragging
                      ? 'border-[#7C3AED] bg-[#7C3AED]/8 shadow-[0_0_0_3px_rgba(124,58,237,0.12)]'
                      : 'border-[#4a4455]/40 hover:border-[#7C3AED]/50 hover:bg-[#7C3AED]/5'
                    }
                  `}
                >
                  <span className={`transition-colors duration-200 ${dragging ? 'text-[#7C3AED]' : 'text-[#4a4455]'}`}>
                    <UploadIcon />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {dragging ? 'Drop to upload' : 'Drop images here or click to upload'}
                    </p>
                    <p className="text-xs text-[#958da1] mt-1">{MAX_IMAGES - images.length} slot{MAX_IMAGES - images.length !== 1 ? 's' : ''} remaining · PNG, JPG, WEBP</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={(e) => addFiles(e.target.files)}
                  />
                </div>
              )}

              {/* Image previews */}
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-4 sm:grid-cols-5 gap-2 shrink-0">
                  {images.map(({ preview }, idx) => (
                    <div
                      key={preview}
                      className="relative aspect-square rounded-lg overflow-hidden group bg-[#1b1b22]"
                    >
                      <img
                        src={preview}
                        alt={`Product image ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="
                          absolute top-1 right-1 w-5 h-5 rounded-full
                          bg-[#0e0e15]/80 text-[#e4e1eb] flex items-center justify-center
                          opacity-0 group-hover:opacity-100 transition-all duration-150
                          hover:bg-[#ff6e84] hover:text-white
                        "
                        aria-label="Remove image"
                      >
                        <XIcon />
                      </button>
                      {idx === 0 && (
                        <span className="absolute bottom-1 left-1 text-[8px] font-bold uppercase tracking-wider bg-[#7C3AED]/80 text-white px-1.5 py-0.5 rounded">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}

                  {/* Add more slot */}
                  {images.length < MAX_IMAGES && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="
                        aspect-square rounded-lg border-2 border-dashed border-[#4a4455]/40
                        flex items-center justify-center text-[#4a4455]
                        hover:border-[#7C3AED]/50 hover:text-[#7C3AED] hover:bg-[#7C3AED]/5
                        transition-all duration-200
                      "
                      aria-label="Add more images"
                    >
                      <PlusIcon />
                    </button>
                  )}
                </div>
              )}
            </section>
          </div>

        </form>
      </main>
    </div>
  );
};

export default CreateProduct;