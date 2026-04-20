import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useProduct } from '../hook/useProduct';

// Variant Card 
const VariantCard = ({ variant, index, onStockChange, onDelete }) => {
    const image =
        variant.images?.[0]?.url ||
        'https://placehold.co/80x80/1b1b22/7c3aed?text=V';

    // attributes schema: { type: Map, of: String } — arrives as a plain object
    // after JSON serialization. Handle Map, plain object, or nothing.
    const attributes = !variant.attributes
        ? []
        : variant.attributes instanceof Map
            ? Array.from(variant.attributes.entries())          // Mongoose Map
            : Array.isArray(variant.attributes)
                ? variant.attributes.map(a => [a.key, a.value]) // defensive
                : Object.entries(variant.attributes);            // plain object ✓


    return (
        <div className="flex items-start gap-4 bg-[#1b1b22] rounded-2xl p-4 hover:bg-[#1f1f26] transition-colors">
            {/* Thumbnail */}
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#0e0e15] flex items-center justify-center shrink-0">
                <img src={image} alt="variant" className="w-full h-full object-contain p-1" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                {/* Attribute Chips */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                    {attributes.length > 0 ? attributes.map(([key, val]) => (
                        <span key={key} className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#2a2931] text-[#d2bbff]">
                            {key}: {val}
                        </span>
                    )) : (
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#2a2931] text-[#958da1]">
                            No Attributes
                        </span>
                    )}
                </div>

                {/* Price */}
                <p className="text-sm font-semibold text-[#d2bbff] mb-2">
                    {variant.price?.amount?.toLocaleString('en-US') || 0}{' '}
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#958da1]">
                        {variant.price?.currency || 'INR'}
                    </span>
                </p>

                {/* Stock Stepper */}
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#958da1]">Stock</span>
                    <div className="flex items-center gap-2 bg-[#0e0e15] rounded-lg px-2 py-1">
                        <button
                            onClick={() => onStockChange(index, -1)}
                            className="w-6 h-6 flex items-center justify-center rounded text-[#ccc3d8] hover:text-white hover:bg-[#4a4455]/40 transition-colors"
                        >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" /></svg>
                        </button>
                        <span className="text-sm font-bold text-white w-8 text-center">{variant.stock ?? 0}</span>
                        <button
                            onClick={() => onStockChange(index, 1)}
                            className="w-6 h-6 flex items-center justify-center rounded text-[#ccc3d8] hover:text-white hover:bg-[#7c3aed]/40 transition-colors"
                        >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-1.5 shrink-0">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[#ccc3d8] hover:text-white hover:bg-[#4a4455]/30 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button
                    onClick={() => onDelete(index)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-[#ffb4ab] hover:text-white hover:bg-[#93000a]/50 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
            </div>
        </div>
    );
};

// Add Variant Form 
const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'JPY'];
const MAX_IMAGES = 7;

const AddVariantForm = ({ onSave, onCancel }) => {
    // Clothing-specific predefined attributes
    const [standardAttributes, setStandardAttributes] = useState({
        Color: '',
        Material: '',
        Fit: ''
    });
    const PRESET_SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'OS'];
    const [selectedSizes, setSelectedSizes] = useState([]);
    // Custom attributes fallback
    const [customAttributes, setCustomAttributes] = useState([]);
    const [price, setPrice] = useState({ amount: '', currency: 'INR' });
    const [stock, setStock] = useState('');
    // Store both File objects (for FormData upload) and base64 previews (for display)
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [attrError, setAttrError] = useState('');
    // Form owns its own loading/error state — no prop-passing race conditions
    const [isSaving, setIsSaving] = useState(false);
    const [formError, setFormError] = useState('');
    const fileInputRef = useRef(null);

    const slotsLeft = MAX_IMAGES - imagePreviews.length;

    const addCustomAttribute = () => setCustomAttributes(prev => [...prev, { key: '', value: '' }]);

    const removeCustomAttribute = (i) =>
        setCustomAttributes(prev => prev.filter((_, idx) => idx !== i));

    const updateCustomAttribute = (i, field, val) =>
        setCustomAttributes(prev => prev.map((a, idx) => idx === i ? { ...a, [field]: val } : a));

    // Remove both the File and its preview by index (must stay in sync)
    const removeImage = (i) => {
        setImageFiles(prev => prev.filter((_, idx) => idx !== i));
        setImagePreviews(prev => prev.filter((_, idx) => idx !== i));
    };

    const handleFiles = (files) => {
        if (slotsLeft <= 0) return;
        const valid = Array.from(files)
            .filter(f => f.type.startsWith('image/'))
            .slice(0, slotsLeft);
        valid.forEach(f => {
            setImageFiles(prev => prev.length < MAX_IMAGES ? [...prev, f] : prev);
            const reader = new FileReader();
            reader.onload = (e) => setImagePreviews(prev =>
                prev.length < MAX_IMAGES ? [...prev, e.target.result] : prev
            );
            reader.readAsDataURL(f);
        });
    };

    const handleDrop = (e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    };

    const toggleSize = (s) => setSelectedSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

    // async: directly awaits onSave so isSaving resets the moment the parent resolves
    const handleSubmit = async () => {
        // Validate: at least one attribute across standard, sizes, or custom
        const hasStandard = Object.values(standardAttributes).some(v => v.trim() !== '');
        const hasSizes = selectedSizes.length > 0;
        const hasCustom = customAttributes.some(a => a.key.trim() !== '');
        
        if (!hasStandard && !hasSizes && !hasCustom) {
            setAttrError('Please provide at least one attribute (e.g., Size or Color)');
            return;
        }
        setAttrError('');
        setFormError('');

        const attrMap = {};
        Object.entries(standardAttributes).forEach(([key, value]) => {
            if (value.trim()) attrMap[key] = value.trim();
        });
        customAttributes.forEach(({ key, value }) => {
            if (key.trim()) attrMap[key.trim()] = value.trim();
        });

        const basePayload = {
            images: imageFiles.map(f => ({ file: f })),
            stock: Number(stock) || 0,
        };
        if (price.amount !== '') {
            basePayload.price = Number(price.amount);
        }

        try {
            setIsSaving(true);
            
            if (selectedSizes.length > 0) {
                // Save it exactly as one variant with a comma separated string
                attrMap.Size = selectedSizes.join(', ');
            }
            
            await onSave({
                ...basePayload,
                attributes: attrMap
            });
            
            onCancel(); // Close form upon success
        } catch (err) {
            setFormError(err?.response?.data?.message || 'Failed to save variant. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const inputClass = "w-full bg-[#0e0e15] border border-[#4a4455]/30 rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#4a4455] focus:outline-none focus:border-[#7c3aed] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.15)] transition-all";

    return (
        <div className="bg-[#13131a] rounded-2xl p-5 space-y-5 border border-[#4a4455]/15">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">New Variant</h3>

            {/* ── Image Upload ── */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#958da1]">
                        Variant Images <span className="text-[#4a4455] normal-case font-medium">(optional)</span>
                    </p>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${slotsLeft === 0 ? 'text-[#ffb4ab]' : 'text-[#4a4455]'}`}>
                        {imagePreviews.length}/{MAX_IMAGES}
                    </span>
                </div>

                {/* Previews grid */}
                {imagePreviews.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                        {imagePreviews.map((src, i) => (
                            <div key={i} className="relative group">
                                <img src={src} alt="" className="w-14 h-14 rounded-lg object-contain bg-[#0e0e15] p-1" />
                                <button
                                    onClick={() => removeImage(i)}
                                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#93000a] text-white text-[9px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >✕</button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Drop zone — hide when at 7 */}
                {slotsLeft > 0 && (
                    <div
                        onDrop={handleDrop}
                        onDragOver={e => e.preventDefault()}
                        onClick={() => fileInputRef.current?.click()}
                        className="border border-dashed border-[#4a4455]/40 rounded-xl p-3 text-center cursor-pointer hover:border-[#7c3aed]/60 hover:bg-[#7c3aed]/5 transition-all"
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={e => handleFiles(e.target.files)}
                        />
                        <svg className="w-5 h-5 mx-auto mb-1 text-[#4a4455]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-xs text-[#4a4455]">
                            {slotsLeft === MAX_IMAGES ? 'Drop images or click to upload' : `Add up to ${slotsLeft} more`}
                        </p>
                    </div>
                )}
                {slotsLeft === 0 && (
                    <p className="text-[10px] text-[#ffb4ab] font-bold uppercase tracking-widest">Max 7 images reached</p>
                )}
            </div>

            {/* ── Attributes ── */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#958da1]">
                        Clothing Attributes <span className="text-[#4a4455] normal-case font-medium">(fill at least one)</span>
                    </p>
                    {attrError && (
                        <p className="text-[10px] font-bold text-[#ffb4ab] uppercase tracking-wide">{attrError}</p>
                    )}
                </div>
                
                {/* Standard Clothing Presets */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#4a4455] block mb-2">Sizes (Select multiple to auto-generate variants)</label>
                        <div className="flex flex-wrap gap-2">
                            {PRESET_SIZES.map(s => (
                                <button 
                                    key={s} 
                                    onClick={() => toggleSize(s)}
                                    className={`h-9 px-4 rounded-lg text-xs font-bold tracking-wide transition-all ${
                                        selectedSizes.includes(s)
                                        ? 'bg-[#7c3aed] text-white shadow-[0_0_10px_rgba(124,58,237,0.3)]'
                                        : 'bg-[#0e0e15] border border-[#4a4455]/50 text-[#ccc3d8] hover:border-[#7c3aed] hover:text-white'
                                    }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#4a4455] block mb-1">Color</label>
                        <input 
                            value={standardAttributes.Color}
                            onChange={(e) => { setStandardAttributes(p => ({...p, Color: e.target.value})); setAttrError(''); }}
                            className={`${inputClass} placeholder-[#4a4455]/50`}
                            placeholder="e.g. Vintage Black"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#4a4455] block mb-1">Material</label>
                        <input 
                            value={standardAttributes.Material}
                            onChange={(e) => { setStandardAttributes(p => ({...p, Material: e.target.value})); setAttrError(''); }}
                            className={`${inputClass} placeholder-[#4a4455]/50`}
                            placeholder="e.g. 100% Cotton"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#4a4455] block mb-1">Fit</label>
                        <input 
                            value={standardAttributes.Fit}
                            onChange={(e) => { setStandardAttributes(p => ({...p, Fit: e.target.value})); setAttrError(''); }}
                            className={`${inputClass} placeholder-[#4a4455]/50`}
                            placeholder="e.g. Oversized"
                        />
                    </div>
                </div>

                {/* Custom Attributes */}
                {customAttributes.length > 0 && (
                    <div className="space-y-2 mb-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#4a4455] mb-2">Custom Attributes</p>
                        {customAttributes.map((attr, i) => (
                            <div key={i} className="flex gap-2 items-center">
                                <input
                                    value={attr.key}
                                    onChange={e => { updateCustomAttribute(i, 'key', e.target.value); setAttrError(''); }}
                                    placeholder="e.g. Pattern"
                                    className={`${inputClass} flex-1`}
                                />
                                <input
                                    value={attr.value}
                                    onChange={e => updateCustomAttribute(i, 'value', e.target.value)}
                                    placeholder="e.g. Striped"
                                    className={`${inputClass} flex-1`}
                                />
                                <button
                                    onClick={() => removeCustomAttribute(i)}
                                    className="w-8 h-9 flex items-center justify-center text-[#ffb4ab] hover:text-white hover:bg-[#93000a]/40 rounded-lg transition-colors shrink-0"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                
                <button
                    onClick={addCustomAttribute}
                    className="text-[10px] font-bold uppercase tracking-widest text-[#7c3aed] hover:text-[#d2bbff] transition-colors flex items-center gap-1"
                >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                    Add Custom Attribute
                </button>
            </div>

            {/* ── Price (optional) ── */}
            <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#958da1] mb-2">
                    Price <span className="text-[#4a4455] normal-case font-medium">(optional)</span>
                </p>
                <div className="flex gap-2">
                    <input
                        type="number"
                        value={price.amount}
                        onChange={e => setPrice(prev => ({ ...prev, amount: e.target.value }))}
                        placeholder="Amount"
                        className={`${inputClass} flex-1`}
                    />
                    <select
                        value={price.currency}
                        onChange={e => setPrice(prev => ({ ...prev, currency: e.target.value }))}
                        className="bg-[#0e0e15] border border-[#4a4455]/30 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#7c3aed] transition-all shrink-0"
                    >
                        {CURRENCIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            {/* ── Stock (optional) ── */}
            <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#958da1] mb-2">
                    Stock <span className="text-[#4a4455] normal-case font-medium">(optional, defaults to 0)</span>
                </p>
                <input
                    type="number"
                    value={stock}
                    onChange={e => setStock(e.target.value)}
                    placeholder="0"
                    className={inputClass}
                />
            </div>

            {/* ── API Error ── */}
            {formError && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#93000a]/20 border border-[#ffb4ab]/20">
                    <svg className="w-4 h-4 text-[#ffb4ab] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                    <p className="text-xs text-[#ffb4ab]">{formError}</p>
                </div>
            )}

            {/* ── Actions ── */}
            <div className="flex gap-3 pt-1">
                <button
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className="flex-1 h-11 rounded-xl text-sm font-bold uppercase tracking-widest text-white transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #523787 100%)' }}
                >
                    {isSaving ? (
                        <>
                            <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            Saving…
                        </>
                    ) : 'Save Variant'}
                </button>
                <button
                    onClick={onCancel}
                    disabled={isSaving}
                    className="flex-1 h-11 rounded-xl text-sm font-bold uppercase tracking-widest text-[#ccc3d8] border border-[#4a4455]/30 hover:bg-[#2a2931] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

//  Main Page
const SellerProductDetails = () => {
    const { productId } = useParams();
    const user = useSelector(state => state.auth.user);
    const { handleGetProductDetails, handleAddProductVariant } = useProduct();

    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [variants, setVariants] = useState([]);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [showAddForm, setShowAddForm] = useState(false);
    const thumbnailRef = useRef(null);

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const data = await handleGetProductDetails(productId);
                const p = data?.product || data;
                setProduct(p);
                setVariants(p?.variants || []);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [productId]);



    const handleStockChange = (idx, delta) => {
        setVariants(prev =>
            prev.map((v, i) => i === idx ? { ...v, stock: Math.max(0, (v.stock ?? 0) + delta) } : v)
        );
    };

    const handleDeleteVariant = (idx) =>
        setVariants(prev => prev.filter((_, i) => i !== idx));

    // Returns a promise so AddVariantForm's async handleSubmit can await it
    const handleSaveVariant = async (variantPayload) => {
        const result = await handleAddProductVariant(productId, variantPayload);

        const updatedVariants =
            result?.product?.variants ??
            result?.variants ??
            null;

        if (updatedVariants) {
            setVariants(updatedVariants);
        } else {
            setVariants(prev => [...prev, variantPayload]);
        }
    };

    // ── Loading ──
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0e0e15] flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-4 border-[#1b1b22] border-t-[#7c3aed] animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#0e0e15] flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-3xl font-bold text-white mb-2">Product Not Found</h1>
                <Link to="/seller/dashboard" className="text-[#d2bbff] hover:underline font-bold uppercase tracking-widest text-xs mt-4">
                    ← Back to Dashboard
                </Link>
            </div>
        );
    }

    const images = product.images || [];
    const activeImage =
        images[activeImageIndex]?.url ||
        'https://placehold.co/800x800/1b1b22/7c3aed?text=No+Image';

    return (
        <div className="min-h-screen bg-[#0e0e15] text-[#e4e1eb]">

            {/* ── Navbar ── */}
            <header className="sticky top-0 z-50 bg-[#0e0e15]/80 backdrop-blur-md border-b border-[#4a4455]/15">
                <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
                    <Link to="/" className="text-xl font-bold tracking-tighter text-white hover:opacity-80 transition-opacity flex items-center gap-2">
                        <div className="w-6 h-6 bg-[#7C3AED] rounded flex items-center justify-center">
                            <span className="text-white text-xs leading-none">S</span>
                        </div>
                        SNITCH.
                    </Link>
                    <div className="flex items-center gap-5">
                        <Link to="/seller/dashboard" className="text-xs font-bold uppercase tracking-widest text-[#d2bbff] hover:text-white transition-colors hidden sm:block">
                            ← Dashboard
                        </Link>
                        <div className="w-8 h-8 rounded-full bg-[#1b1b22] border-2 border-[#1b1b22] overflow-hidden">
                            <img src={`https://ui-avatars.com/api/?name=${user?.fullname || 'S'}&background=7c3aed&color=fff`} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Main ── */}
            <main className="max-w-7xl mx-auto px-5 sm:px-8 py-8 lg:py-12">

                {/* Back breadcrumb */}
                <Link to="/seller/dashboard" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-[#958da1] hover:text-[#d2bbff] transition-colors mb-8">
                    <span className="mr-2 text-base leading-none">←</span> All Listings
                </Link>

                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-14 items-start">

                    {/* ══ LEFT — Product Info ══════════════════════════════ */}
                    <div className="flex flex-col gap-3 w-full lg:sticky lg:top-24">

                        {/* Image Row: main image + thumbnails side by side */}
                        <div className="flex gap-3 h-80">
                            {/* Main Image */}
                            <div className="flex-1 bg-[#13131a] rounded-2xl overflow-hidden flex items-center justify-center">
                                <img src={activeImage} alt={product.title} className="w-full h-full object-contain p-3" />
                            </div>

                            {/* Thumbnail Strip — vertical */}
                            {images.length > 1 && (
                                <div
                                    ref={thumbnailRef}
                                    onWheel={e => { e.preventDefault(); thumbnailRef.current.scrollTop += e.deltaY; }}
                                    className="snitch-scroll flex flex-col gap-2 overflow-y-auto rounded-xl bg-[#13131a] p-2 w-16 shrink-0"
                                >
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImageIndex(idx)}
                                            className={`w-12 h-12 rounded-lg overflow-hidden shrink-0 mx-auto transition-all ${idx === activeImageIndex ? 'ring-2 ring-[#7C3AED] ring-offset-1 ring-offset-[#13131a] scale-[1.04]' : 'opacity-40 hover:opacity-75'}`}
                                        >
                                            <img src={img.url} alt="" className="w-full h-full object-contain bg-[#1b1b22] p-1" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Compact Product Info */}
                        <div className="bg-[#13131a] rounded-2xl p-4">
                            <div className="flex items-start justify-between gap-3 mb-2">
                                <h1 className="text-lg font-bold tracking-tight text-white leading-tight">{product.title}</h1>
                                <span className="text-sm font-semibold text-[#d2bbff] shrink-0">
                                    {product.price?.amount?.toLocaleString('en-US') || 0}
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#958da1] ml-1">
                                        {product.price?.currency || 'INR'}
                                    </span>
                                </span>
                            </div>
                            <p className="text-xs text-[#ccc3d8] leading-relaxed mb-3">{product.description}</p>
                            <div className="flex gap-4">
                                <div>
                                    <span className="block text-[9px] font-bold uppercase tracking-widest text-[#958da1]">Listed</span>
                                    <span className="text-xs text-white">
                                        {new Date(product.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-[9px] font-bold uppercase tracking-widest text-[#958da1]">Variants</span>
                                    <span className="text-xs text-white">{variants.length}</span>
                                </div>
                                <div>
                                    <span className="block text-[9px] font-bold uppercase tracking-widest text-[#958da1]">Total Stock</span>
                                    <span className="text-xs text-white">{variants.reduce((acc, v) => acc + (v.stock ?? 0), 0)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ══ RIGHT — Variants Management ══════════════════════ */}
                    <div className="flex flex-col gap-4 w-full">

                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold tracking-tight text-white">Product Variants</h2>
                                <p className="text-xs text-[#958da1] mt-0.5">
                                    {variants.length === 0 ? 'No variants yet' : `${variants.length} variant${variants.length > 1 ? 's' : ''} · ${variants.reduce((acc, v) => acc + (v.stock ?? 0), 0)} units total`}
                                </p>
                            </div>
                            {!showAddForm && (
                                <button
                                    onClick={() => setShowAddForm(true)}
                                    className="h-9 px-4 rounded-full text-xs font-bold uppercase tracking-widest text-white transition-all hover:opacity-90 flex items-center gap-1.5"
                                    style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #523787 100%)' }}
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                                    Add Variant
                                </button>
                            )}
                        </div>

                        {/* Add Variant Form */}
                        {showAddForm && (
                            <AddVariantForm
                                onSave={handleSaveVariant}
                                onCancel={() => setShowAddForm(false)}
                            />
                        )}

                        {/* Empty State */}
                        {variants.length === 0 && !showAddForm && (
                            <div className="flex flex-col items-center justify-center py-16 text-center bg-[#13131a] rounded-2xl">
                                <div className="w-14 h-14 rounded-full bg-[#1b1b22] flex items-center justify-center text-[#7c3aed] mb-4">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </div>
                                <h3 className="text-base font-bold text-white mb-1">No variants yet</h3>
                                <p className="text-sm text-[#958da1] max-w-xs mb-6">Add size, color, or any other variant to manage stock per option.</p>
                                <button
                                    onClick={() => setShowAddForm(true)}
                                    className="h-10 px-6 rounded-full text-xs font-bold uppercase tracking-widest text-white transition-all hover:opacity-90"
                                    style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #523787 100%)' }}
                                >
                                    + Create First Variant
                                </button>
                            </div>
                        )}

                        {/* Variant Cards */}
                        {variants.length > 0 && (
                            <div className="space-y-3">
                                {variants.map((variant, idx) => (
                                    <VariantCard
                                        key={idx}
                                        variant={variant}
                                        index={idx}
                                        onStockChange={handleStockChange}
                                        onDelete={handleDeleteVariant}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
};

export default SellerProductDetails;