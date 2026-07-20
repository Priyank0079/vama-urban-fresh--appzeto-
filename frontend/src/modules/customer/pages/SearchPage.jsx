import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation as useRouterLocation } from 'react-router-dom';
import { Search, Mic, ArrowLeft, X, TrendingUp, ChevronRight, History, Camera, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Tesseract from 'tesseract.js';
import { customerApi } from '../services/customerApi';
import ProductCard from '../components/shared/ProductCard';
import { useProductDetail } from '../context/ProductDetailContext';
import { useSettings } from '@core/context/SettingsContext';
import { cn } from '@/lib/utils';
import { useLocation as useAppLocation } from '../context/LocationContext';
import { getJSON, setJSON, STORAGE_KEYS } from '@core/utils/storage';
import Lottie from 'lottie-react';

const SearchPage = () => {
    const navigate = useNavigate();
    const location = useRouterLocation();
    const { isOpen: isProductDetailOpen } = useProductDetail();
    const { settings } = useSettings();
    const { currentLocation } = useAppLocation();
    const appName = settings?.appName || 'App';

    // Get initial query from URL state or params
    const initialQuery = location.state?.query || new URLSearchParams(location.search).get('q') || '';

    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
     const [isListening, setIsListening] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
    const [noServiceData, setNoServiceData] = useState(null);

    // Image Search States & References
    const [isImageSearching, setIsImageSearching] = useState(false);
    const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const recognitionRef = useRef(null);

    // Manage Recent Searches with LocalStorage
    const [pastSearches, setPastSearches] = useState(() => {
        const saved = getJSON(STORAGE_KEYS.RECENT_SEARCHES, []);
        return Array.isArray(saved) ? saved.filter((s) => typeof s === 'string') : [];
    });

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Debounce Logic
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 400); 
        return () => clearTimeout(timer);
    }, [query]);

    const handleImageSearchStart = () => {
        setIsImageSearching(true);
    };

    const handleImageSearchStop = () => {
        setIsImageSearching(false);
        setIsAnalyzingImage(false);
        setImagePreview(null);
    };

    const processImageFile = async (file) => {
        if (!file) return;

        // Show image preview
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);

        setIsAnalyzingImage(true);

        try {
            const { data: { text } } = await Tesseract.recognize(
                file,
                'eng',
                { logger: m => console.log(m) }
            );

            console.log("Extracted OCR text:", text);
            if (text && text.trim()) {
                // Filter out non-alphanumeric, clean spacing
                const cleanText = text.replace(/[^a-zA-Z0-9\s]/g, ' ')
                                      .replace(/\s+/g, ' ')
                                      .trim();
                
                // Select a set of search keywords (discarding words under 3 characters)
                const keywords = cleanText.split(' ')
                                          .filter(w => w.length > 2)
                                          .slice(0, 3)
                                          .join(' ');
                                          
                if (keywords) {
                    setQuery(keywords);
                    saveSearch(keywords);
                } else {
                    toast.error("No clear product names detected. Try an image with clearer product labels.");
                }
            } else {
                toast.error("Could not recognize any text. Please upload an image with clear text/labels.");
            }
        } catch (error) {
            console.error("OCR Image analysis failed:", error);
            alert("Error during image analysis: " + error.message);
        } finally {
            setIsAnalyzingImage(false);
            setIsImageSearching(false);
            setImagePreview(null);
        }
    };

    // Handle auto-trigger from router state on mount
    useEffect(() => {
        if (location.state?.startVoice) {
            handleVoiceSearch();
            window.history.replaceState({}, document.title);
        } else if (location.state?.startImageSearch) {
            handleImageSearchStart();
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    // Voice Search Logic (Enhanced)
    const handleVoiceSearch = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Voice search is not supported in your browser. Please try Chrome.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = 'en-IN'; 
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onstart = () => {
            setIsListening(true);
            setQuery(''); // Clear previous search if starting fresh
        };
        
        recognition.onend = () => setIsListening(false);
        
        recognition.onresult = (event) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                transcript += event.results[i][0].transcript;
            }

            if (transcript) {
                setQuery(transcript);
                // Save to history only if it's the final result
                if (event.results[event.results.length - 1].isFinal) {
                    saveSearch(transcript);
                }
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
            if (event.error === 'not-allowed') {
                alert('Microphone access denied. Please enable it in your browser settings.');
            } else {
                console.warn('Voice recognition stopped due to error:', event.error);
            }
        };

        try {
            recognition.start();
        } catch (e) {
            console.error('Recognition start error:', e);
            setIsListening(false);
        }
    };

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            const hasValidLocation =
                Number.isFinite(currentLocation?.latitude) &&
                Number.isFinite(currentLocation?.longitude);
            if (!hasValidLocation) {
                setAllProducts([]);
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            try {
                const response = await customerApi.getProducts({
                    limit: 100,
                    lat: currentLocation.latitude,
                    lng: currentLocation.longitude,
                });
                if (response.data.success) {
                    const rawResult = response.data.result;
                    const dbProds = Array.isArray(response.data.results)
                        ? response.data.results
                        : Array.isArray(rawResult?.items)
                        ? rawResult.items
                        : Array.isArray(rawResult)
                        ? rawResult
                        : [];
                    const formattedProds = dbProds.map(p => ({
                        ...p,
                        id: p._id,
                        image:
                          p.mainImage ||
                          p.image ||
                          "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=400&h=400",
                        price: p.salePrice || p.price,
                        originalPrice: p.price,
                        weight: p.weight || '1 unit',
                        deliveryTime: '8-15 mins'
                    }));
                    setAllProducts(formattedProds);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, [currentLocation?.latitude, currentLocation?.longitude]);

    // Save search term to history
    const saveSearch = (term) => {
        if (!term.trim()) return;
        const updated = [term, ...pastSearches.filter(s => s !== term)].slice(0, 10);
        setPastSearches(updated);
        setJSON(STORAGE_KEYS.RECENT_SEARCHES, updated);
    };

    // Remove specific search term
    const handleRemoveSearch = (e, term) => {
        e.stopPropagation();
        const updated = pastSearches.filter(s => s !== term);
        setPastSearches(updated);
        setJSON(STORAGE_KEYS.RECENT_SEARCHES, updated);
    };

    // Trigger save on Enter or clicking a result
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && query.trim()) {
            saveSearch(query);
        }
    };

    // Predictive Suggestions Logic
    const suggestions = useMemo(() => {
        if (!query.trim()) return [];
        const uniqueSuggestions = new Set();
        const matched = [];
        
        // Find matching products
        for (const p of allProducts) {
            const name = p.name;
            if (name.toLowerCase().includes(query.toLowerCase()) && !uniqueSuggestions.has(name.toLowerCase())) {
                uniqueSuggestions.add(name.toLowerCase());
                matched.push({ type: 'product', text: name, category: p.categoryId?.name });
            }
            if (matched.length >= 6) break; // Limit to 6 suggestions
        }
        
        return matched;
    }, [query, allProducts]);

    // Real-time filtering logic
    const filteredResults = useMemo(() => {
        if (!debouncedQuery.trim()) return [];
        return allProducts.filter(p =>
            p.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            p.categoryId?.name?.toLowerCase().includes(debouncedQuery.toLowerCase())
        );
    }, [debouncedQuery, allProducts]);

    useEffect(() => {
        setResults(filteredResults);
    }, [filteredResults]);

    // Dynamically load no-service Lottie when results are empty
    useEffect(() => {
        if (!isLoading) {
            import('@/assets/lottie/animation.json')
                .then((m) => setNoServiceData(m.default))
                .catch(() => {});
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Lowest Price Section
    const lowestPriceProducts = useMemo(() => {
        return [...allProducts]
            .sort((a, b) => a.price - b.price)
            .slice(0, 10);
    }, [allProducts]);

    const handleClear = () => {
        setQuery('');
        setResults([]);
    };

    return (
        <div className="min-h-screen bg-white font-outfit">
            {/* Header / Search Input */}
            <div className={cn(
                "sticky top-0 z-50 bg-linear-to-r from-primary to-[var(--brand-400)] shadow-[0_4px_20px_rgba(0,0,0,0.12)] relative overflow-hidden",
                isProductDetailOpen && "hidden md:block"
            )}>
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12 blur-xl pointer-events-none" />

                <div className="px-4 pt-5 pb-6 flex items-center md:justify-center gap-3 relative z-10">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center justify-center w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full text-white backdrop-blur-md border border-white/10 transition-all flex-shrink-0 shadow-sm active:scale-90"
                        >
                            <ArrowLeft size={22} strokeWidth={2.5} />
                        </button>

                        <div className="flex-1 relative md:flex-none md:w-[500px] lg:w-[600px]">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                                <Search size={18} strokeWidth={3} className="text-slate-400" />
                            </div>
                             <input
                                autoFocus
                                type="text"
                                placeholder='Search items, categories...'
                                value={query}
                                onKeyDown={handleKeyDown}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full h-12 bg-white rounded-2xl pl-11 pr-28 shadow-xl shadow-black/10 border-none outline-none text-slate-800 font-bold placeholder:text-slate-400 placeholder:font-medium focus:ring-4 focus:ring-white/20 transition-all"
                            />
                            
                            {/* Integrated Actions inside Search Input */}
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex items-center gap-1">
                                {query && (
                                    <button
                                        onClick={handleClear}
                                        className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
                                    >
                                        <X size={12} strokeWidth={3} className="text-slate-600" />
                                    </button>
                                )}
                                <div className="w-[1px] h-6 bg-slate-100 mx-1" />
                                <button 
                                    onClick={handleVoiceSearch}
                                    className={cn(
                                        "p-2 transition-all rounded-full relative cursor-pointer",
                                        isListening ? "text-red-500 bg-red-50 scale-110" : "text-slate-400 hover:text-primary hover:bg-slate-50"
                                    )}
                                >
                                    <Mic size={20} strokeWidth={2.5} className={cn(isListening && "animate-pulse")} />
                                    {isListening && (
                                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                                    )}
                                </button>
                                <button 
                                    onClick={handleImageSearchStart}
                                    className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 transition-all rounded-full cursor-pointer"
                                    title="Search by image/camera"
                                >
                                    <Camera size={20} strokeWidth={2.5} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-5 space-y-10 pb-24">
                {/* Predictive Suggestions Dropdown */}
                {query && suggestions.length > 0 && (
                    <div className="bg-slate-50 rounded-2xl border border-slate-100 divide-y divide-slate-100 overflow-hidden shadow-sm">
                        {suggestions.map((sug, idx) => {
                            const text = sug.text;
                            const parts = text.split(new RegExp(`(${query})`, 'gi'));
                            return (
                                <div 
                                    key={idx}
                                    onClick={() => {
                                        setQuery(text);
                                        saveSearch(text);
                                    }}
                                    className="px-4 py-3 hover:bg-slate-100 transition-colors flex items-center justify-between cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <Search size={14} className="text-slate-400" />
                                        <span className="text-sm font-semibold text-slate-700">
                                            {parts.map((part, i) => 
                                                part.toLowerCase() === query.toLowerCase() ? (
                                                    <span key={i} className="text-primary font-extrabold" style={{ color: settings?.primaryColor || 'var(--primary)' }}>{part}</span>
                                                ) : (
                                                    part
                                                )
                                            )}
                                        </span>
                                    </div>
                                    {sug.category && (
                                        <span className="text-[10px] bg-slate-200/60 text-slate-500 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                            in {sug.category}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Search Results List */}
                {query ? (
                    <section>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-slate-800 tracking-tight">
                                Search Results
                            </h2>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{results.length} found</span>
                        </div>

                        {results.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-3 md:gap-x-4 gap-y-6 md:gap-y-10">
                                {results.map((product) => (
                                    <div key={product.id} onClick={() => saveSearch(query)} className="flex justify-center">
                                        <ProductCard product={product} compact={isMobile} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-16 flex flex-col items-center text-center">
                                <div className="w-48 h-48 md:w-64 md:h-64 mb-6">
                                    {noServiceData ? (
                                        <Lottie animationData={noServiceData} loop={true} />
                                    ) : (
                                        <div className="w-48 h-48 md:w-64 md:h-64" />
                                    )}
                                </div>
                                <h3 className="text-xl font-semibold text-slate-800 tracking-tight mb-2">No items found</h3>
                                <p className="text-slate-500 font-medium max-w-xs">We couldn't find anything for "{query}". Try different keywords!</p>
                            </div>
                        )}
                    </section>
                ) : (
                    <>
                        {/* 1. Recently Searched Item Section */}
                        {pastSearches.length > 0 && (
                            <section>
                                <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-4">Recently Searched</h3>
                                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                                    {pastSearches.map((term) => (
                                        <div
                                            key={term}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 shadow-sm rounded-full whitespace-nowrap active:scale-95 transition-transform cursor-pointer"
                                            onClick={() => setQuery(term)}
                                        >
                                            <div className="h-5 w-5 rounded flex items-center justify-center" style={{ backgroundColor: (settings?.primaryColor || 'var(--primary)') + '20' }}>
                                                <History size={12} style={{ color: settings?.primaryColor || 'var(--primary)' }} />
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">{term}</span>
                                            <button
                                                onClick={(e) => handleRemoveSearch(e, term)}
                                                className="ml-1 p-0.5 hover:bg-slate-100 rounded-full transition-colors"
                                            >
                                                <X size={12} className="text-slate-400 hover:text-red-500" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* 2. Lowest Price Ever Section */}
                        <section>
                            <div className="flex justify-between items-center mb-5">
                                <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Lowest Price Ever!</h2>
                                <button 
                                    className="flex items-center gap-1 md:gap-1.5 px-3 py-1 md:px-4 md:py-1.5 bg-slate-50 hover:bg-slate-100 rounded-full text-xs md:text-sm font-semibold transition-all" 
                                    style={{ color: settings?.primaryColor || 'var(--primary)' }}
                                    onClick={() => navigate('/category/all')}
                                >
                                    See All <ChevronRight size={14} strokeWidth={3} />
                                </button>
                            </div>
                            <div className="flex gap-2 md:gap-4 overflow-x-auto no-scrollbar -mx-5 px-5 pb-3 snap-x">
                                {isLoading && allProducts.length === 0 ? (
                                    [...Array(4)].map((_, i) => (
                                        <div key={i} className="min-w-[126px] sm:min-w-[136px] md:min-w-[148px] h-52 md:h-64 bg-slate-50 rounded-2xl animate-pulse" />
                                    ))
                                ) : lowestPriceProducts.map((product) => (
                                    <div key={product.id} className="min-w-[126px] sm:min-w-[136px] md:min-w-[148px] snap-start">
                                        <ProductCard product={product} compact={isMobile} />
                                    </div>
                                ))}
                            </div>
                        </section>
                    </>
                )}
            </div>

            {/* Listening Modal */}
            {isListening && (
                <div className="fixed inset-0 z-[200] bg-primary/95 backdrop-blur-lg flex flex-col items-center justify-center text-white" style={{ backgroundColor: settings?.primaryColor || 'var(--primary)' }}>
                    <div className="absolute top-6 right-6">
                        <button 
                            onClick={() => {
                                if (recognitionRef.current) {
                                    recognitionRef.current.abort();
                                }
                                setIsListening(false);
                            }} 
                            className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all cursor-pointer active:scale-95"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    
                    <div className="relative flex items-center justify-center mb-8">
                        <div className="absolute w-36 h-36 bg-white/10 rounded-full animate-ping" />
                        <div className="absolute w-28 h-28 bg-white/20 rounded-full animate-pulse" />
                        
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg text-primary z-10">
                            <Mic size={36} strokeWidth={2.5} className="animate-bounce" style={{ color: settings?.primaryColor || 'var(--primary)' }} />
                        </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-2 tracking-tight">Listening...</h2>
                    <p className="text-white/70 text-sm mb-12 max-w-xs text-center font-medium">Try saying product name, categories like "chips", "milk", or "bread"</p>
                    
                    <div className="px-6 py-4 bg-white/10 rounded-2xl max-w-sm text-center backdrop-blur-sm border border-white/5 font-bold min-h-[60px] flex items-center justify-center">
                        {query || <span className="opacity-40 italic font-medium">Listening to speech...</span>}
                    </div>
                </div>
            )}

            {/* Image / Camera Search Modal */}
            {isImageSearching && (
                <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md p-6 relative overflow-hidden shadow-2xl">
                        <button 
                            onClick={handleImageSearchStop} 
                            className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 transition-colors cursor-pointer"
                        >
                            <X size={20} />
                        </button>
                        
                        <h3 className="text-xl font-bold text-slate-800 mb-2 text-center flex items-center justify-center gap-2">
                            <Camera className="text-primary" style={{ color: settings?.primaryColor || 'var(--primary)' }} />
                            Search by Image
                        </h3>
                        <p className="text-sm text-slate-500 text-center mb-6">Take a photo or upload an image to find related products</p>
                        
                        {isAnalyzingImage ? (
                            <div className="flex flex-col items-center justify-center py-10 space-y-4">
                                {imagePreview && (
                                    <div className="w-32 h-32 rounded-2xl overflow-hidden relative shadow-md mb-2">
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-primary/20 backdrop-blur-xs flex items-center justify-center" style={{ backgroundColor: (settings?.primaryColor || 'var(--primary)') + '20' }}>
                                            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    </div>
                                )}
                                <p className="text-sm font-bold text-primary animate-pulse" style={{ color: settings?.primaryColor || 'var(--primary)' }}>
                                    Analyzing image content...
                                </p>
                                <p className="text-[10px] text-slate-400 font-semibold tracking-wide">
                                    Extracting text & matching products
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 hover:border-primary rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors group">
                                    <Camera size={32} className="text-slate-400 group-hover:text-primary mb-2" style={{ color: 'inherit' }} />
                                    <span className="text-xs font-bold text-slate-600 group-hover:text-primary">Take Photo</span>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        capture="environment" 
                                        className="hidden" 
                                        onChange={(e) => processImageFile(e.target.files?.[0])}
                                    />
                                </label>
                                
                                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 hover:border-primary rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors group">
                                    <Upload size={32} className="text-slate-400 group-hover:text-primary mb-2" style={{ color: 'inherit' }} />
                                    <span className="text-xs font-bold text-slate-600 group-hover:text-primary">Upload Image</span>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="hidden" 
                                        onChange={(e) => processImageFile(e.target.files?.[0])}
                                    />
                                </label>
                            </div>
                        )}
                        
                        <button 
                            onClick={handleImageSearchStop} 
                            className="mt-6 w-full py-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-700 font-bold transition-all cursor-pointer text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchPage;
