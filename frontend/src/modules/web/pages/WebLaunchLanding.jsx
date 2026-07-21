import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Smartphone,
  MapPin,
  ChevronDown,
  Download,
  Play,
  Menu,
  Lock,
  Flame,
  X,
  ArrowRight,
  MessageCircle,
  Star
} from "lucide-react";
import { toast } from "sonner";
import heroVideo from "../create_a_this_size_phone_video (1).mp4";
import LogoImage from "@/assets/Logo.png";
import { useSettings } from "@core/context/SettingsContext";

// Sample product mockups with rich details
const PRODUCTS = [
  {
    id: 1,
    name: "Organic Farm Milk",
    category: "Dairy & Eggs",
    price: "₹65",
    mrp: "₹75",
    time: "8 mins",
    tag: "Fresh Daily",
    unit: "500 ml",
    rating: 4.9,
    description: "Pure, farm-fresh pasteurized whole milk sourced directly from local organic dairy farms every morning. Rich in calcium and nutrients with zero preservatives.",
    img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    name: "Fresh Hass Avocado",
    category: "Fruits & Veggies",
    price: "₹149",
    mrp: "₹180",
    time: "10 mins",
    tag: "Organic",
    unit: "1 pc (approx. 200g)",
    rating: 4.8,
    description: "Handpicked premium Hass avocados with rich, creamy texture. Perfect for fresh guacamole, salads, and healthy morning toast.",
    img: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    name: "Artisanal Sourdough",
    category: "Bakery",
    price: "₹95",
    mrp: "₹120",
    time: "12 mins",
    tag: "Hot Baked",
    unit: "400g loaf",
    rating: 4.9,
    description: "Slow-fermented sourdough bread baked fresh in dark store wood-fired ovens. Crispy golden crust with soft, airy crumb.",
    img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: 4,
    name: "Cold-Pressed Juice",
    category: "Beverages",
    price: "₹120",
    mrp: "₹150",
    time: "7 mins",
    tag: "Trending",
    unit: "250 ml",
    rating: 4.7,
    description: "100% natural cold-pressed orange & passion fruit blend. No added sugar, no artificial flavors, packed with immune-boosting Vitamin C.",
    img: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&auto=format&fit=crop&q=80"
  }
];

const FEATURES = [
  { icon: Zap, title: "10-Minute Delivery", desc: "Proprietary dark-store network ensures sub-15 minute delivery at your doorstep.", color: "text-amber-600", bg: "bg-amber-100" },
  { icon: ShieldCheck, title: "100% Quality Guaranteed", desc: "Direct farm sourcing with rigorous 24-point quality inspection on every single item.", color: "text-rose-600", bg: "bg-rose-100" },
  { icon: MapPin, title: "Live Order Tracking", desc: "Ultra-precise GPS rider tracking with real-time ETA updates down to the minute.", color: "text-emerald-600", bg: "bg-emerald-100" },
  { icon: Smartphone, title: "AI-Powered Experience", desc: "Smart 1-tap reordering, personalized recommendations, and instant search.", color: "text-blue-600", bg: "bg-blue-100" },
  { icon: Lock, title: "Zero-Touch Safety", desc: "Tamper-evident thermal packaging preserving freshness and temperature control.", color: "text-purple-600", bg: "bg-purple-100" },
  { icon: Flame, title: "Unbeatable Deals", desc: "Direct-to-consumer pricing with exclusive flash sales and daily cashbacks.", color: "text-orange-600", bg: "bg-orange-100" }
];

const STEPS = [
  { num: "01", title: "Download App", desc: "Install our mobile app and set up your delivery location in under 30 seconds." },
  { num: "02", title: "Explore 5,000+ Items", desc: "Browse ultra-fresh groceries, daily essentials, snacks, beverages, and household goods." },
  { num: "03", title: "Track Real-Time Rider", desc: "Watch your dedicated delivery partner zoom through your neighborhood live on the map." },
  { num: "04", title: "Enjoy Freshness", desc: "Receive your order at your doorstep in sub-15 minutes, fresh and perfectly packed." }
];

const COMPARISON = [
  { feature: "Delivery Time", app: "⚡ 8 to 12 Minutes", traditional: "🐢 2 to 24 Hours" },
  { feature: "Freshness Control", app: "🌿 Sourced Daily & Temperature Controlled", traditional: "📦 Stored in Open Shelves for Days" },
  { feature: "Live GPS Tracking", app: "📍 Pinpoint Accurate Real-time Map", traditional: "❌ Untracked Bulk Courier" },
  { feature: "Minimum Order Value", app: "💰 ₹0 (No Minimum)", traditional: "⚠️ ₹500+ Threshold Required" },
  { feature: "Customer Support", app: "💬 24/7 Instant Live Chat Support", traditional: "📞 Automated Delayed Phone Support" }
];

const FAQS = [
  { q: "When will the mobile application officially launch?", a: "We are currently in private beta testing across select pin-codes and launching publicly on iOS App Store and Google Play Store very soon! Enter your email above to get early VIP access." },
  { q: "How do you achieve delivery under 15 minutes?", a: "We operate micro-fulfillment dark stores strategically stationed within 2-3 km radii of major residential areas, backed by automated packing systems." },
  { q: "Is there a minimum order requirement?", a: "No! You can order a single bar of chocolate or your entire month's grocery list without any minimum threshold limits." },
  { q: "What cities will be available at launch?", a: "Phase 1 launch covers major metro hubs including Indore, Mumbai, Bengaluru, Delhi NCR, and Hyderabad, followed rapidly by 15+ tier-2 cities." }
];

export default function WebLaunchLanding() {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const logoUrl = settings?.logoUrl || LogoImage;
  const appName = settings?.appName || "Vamaa Urban Fresh";
  const [email, setEmail] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (!element) return;

    const navHeight = 80;
    const elementRect = element.getBoundingClientRect();
    const absoluteElementTop = elementRect.top + window.pageYOffset;
    const elementHeight = elementRect.height;
    const windowHeight = window.innerHeight;

    // Calculate center offset so section header is centered on screen
    let targetScrollY = absoluteElementTop - navHeight;
    if (elementHeight < windowHeight - navHeight) {
      targetScrollY = absoluteElementTop - (windowHeight - elementHeight) / 2;
    }

    window.scrollTo({
      top: Math.max(0, targetScrollY),
      behavior: "smooth"
    });

    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("🚀 You're on the VIP launch list! Stay tuned.");
    setEmail("");
  };

  const handlePreOrderWhatsApp = (product) => {
    const phoneNumber = "918305357624";
    const text = encodeURIComponent(
      `*NEW PRE-ORDER REQUEST*\n\n` +
      `📦 *Product:* ${product.name}\n` +
      `🏷️ *Category:* ${product.category}\n` +
      `💰 *Price:* ${product.price}\n` +
      `⚡ *Est. Delivery:* ${product.time}\n\n` +
      `I would like to pre-order this item on ${appName} launch!`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, "_blank");
  };

  const openWhatsAppContact = () => {
    const phoneNumber = "918305357624";
    const text = encodeURIComponent(`Hello ${appName} Team, I would like to inquire about your upcoming launch and services.`);
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, "_blank");
  };

  const notifyLaunch = () => {
    navigate("/coming-soon");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-rose-500 selection:text-white overflow-x-hidden">
      {/* Light Mode Navigation Bar */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/90 backdrop-blur-md border-b border-rose-100 shadow-sm py-3" : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img
              src={logoUrl}
              alt={appName}
              className="h-10 md:h-12 w-auto object-contain transition-transform hover:scale-105"
            />
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600">
            <a href="#features" onClick={(e) => scrollToSection(e, "features")} className="hover:text-rose-600 transition-colors">Features</a>
            <a href="#showcase" onClick={(e) => scrollToSection(e, "showcase")} className="hover:text-rose-600 transition-colors">Products</a>
            <a href="#howitworks" onClick={(e) => scrollToSection(e, "howitworks")} className="hover:text-rose-600 transition-colors">How it Works</a>
            <a href="#comparison" onClick={(e) => scrollToSection(e, "comparison")} className="hover:text-rose-600 transition-colors">Why Us</a>
            <a href="#faq" onClick={(e) => scrollToSection(e, "faq")} className="hover:text-rose-600 transition-colors">FAQ</a>
          </div>

          <div className="hidden md:flex items-center gap-2.5">
            <button
              onClick={openWhatsAppContact}
              className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold text-xs border border-emerald-200 shadow-2xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 hover:text-white" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={notifyLaunch}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Get App</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-700 hover:text-slate-900 p-1.5"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-rose-100 px-6 py-4 shadow-xl flex flex-col gap-3 animate-in slide-in-from-top-3 duration-200">
            <a
              href="#features"
              onClick={(e) => scrollToSection(e, "features")}
              className="text-sm font-bold text-slate-700 hover:text-rose-600 py-1"
            >
              Features
            </a>
            <a
              href="#showcase"
              onClick={(e) => scrollToSection(e, "showcase")}
              className="text-sm font-bold text-slate-700 hover:text-rose-600 py-1"
            >
              Products
            </a>
            <a
              href="#howitworks"
              onClick={(e) => scrollToSection(e, "howitworks")}
              className="text-sm font-bold text-slate-700 hover:text-rose-600 py-1"
            >
              How it Works
            </a>
            <a
              href="#comparison"
              onClick={(e) => scrollToSection(e, "comparison")}
              className="text-sm font-bold text-slate-700 hover:text-rose-600 py-1"
            >
              Why Us
            </a>
            <a
              href="#faq"
              onClick={(e) => scrollToSection(e, "faq")}
              className="text-sm font-bold text-slate-700 hover:text-rose-600 py-1"
            >
              FAQ
            </a>
            <div className="pt-2 flex flex-col gap-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openWhatsAppContact();
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Support</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  notifyLaunch();
                }}
                className="w-full py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Get App</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-28 pb-14 md:pt-36 md:pb-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100/80 border border-rose-200 text-rose-700 text-xs font-extrabold mb-4">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>NEXT-GEN QUICK COMMERCE APP</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-4">
              Ultra-Fast Groceries Delivered in <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-amber-500">10 Minutes.</span>
            </h1>

            <p className="text-slate-600 text-sm md:text-base font-medium max-w-xl leading-relaxed mb-6">
              Experience the future of instant delivery. Fresh organic produce, daily essentials, and household goods brought straight to your doorstep in minutes.
            </p>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto mb-8">
              <button
                onClick={notifyLaunch}
                className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Pre-Register on App Store</span>
              </button>

              <a
                href="#howitworks"
                onClick={(e) => scrollToSection(e, "howitworks")}
                className="px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm border border-slate-200 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-slate-600 text-slate-600" />
                <span>See How It Works</span>
              </a>
            </div>

            {/* Mobile-Responsive Live Counters */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-slate-200 w-full max-w-md">
              <div className="text-center sm:text-left">
                <div className="text-base sm:text-2xl font-black text-slate-900 leading-tight">5,000+</div>
                <div className="text-[10px] sm:text-xs font-semibold text-slate-500">Fresh Products</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-base sm:text-2xl font-black text-rose-600 leading-tight">⚡ &lt;12m</div>
                <div className="text-[10px] sm:text-xs font-semibold text-slate-500">Avg Delivery</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-base sm:text-2xl font-black text-amber-600 leading-tight">10k+</div>
                <div className="text-[10px] sm:text-xs font-semibold text-slate-500">Waitlist Users</div>
              </div>
            </div>
          </div>

          {/* Clean Muted Standalone Hero Video (No Phone Frame or Overlays) */}
          <div className="lg:col-span-5 relative flex justify-center py-2">
            {/* Soft Ambient Background Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-rose-500/15 via-amber-500/15 to-rose-400/15 rounded-full blur-3xl opacity-70 pointer-events-none" />

            <div className="relative w-full max-w-[290px] rounded-[32px] overflow-hidden shadow-[0_20px_45px_rgba(225,29,72,0.12)] border border-slate-200/80 bg-black">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover rounded-[32px] block"
              >
                <source src={heroVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 py-14 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
              Engineered for <span className="text-rose-600">Instant Perfection.</span>
            </h2>
            <p className="text-slate-600 text-xs md:text-sm">
              We redesigned quick commerce from the ground up with AI routing, dark stores, and sub-10 minute fulfillment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 hover:border-rose-300 transition-all hover:shadow-md group"
              >
                <div className={`w-10 h-10 rounded-xl ${f.bg} ${f.color} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1.5">{f.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section id="showcase" className="relative z-10 py-14 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-rose-600 font-extrabold text-xs uppercase tracking-wider mb-1">CURATED SELECTION</div>
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">Freshness Showcase</h2>
          </div>
          <button onClick={notifyLaunch} className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200 cursor-pointer shadow-2xs self-start sm:self-auto">
            Explore All 5,000+ Items →
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {PRODUCTS.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-slate-200 rounded-2xl p-3 overflow-hidden group hover:border-rose-300 transition-all shadow-2xs cursor-pointer flex flex-col justify-between"
              onClick={() => setSelectedProduct(p)}
            >
              <div>
                <div className="relative h-36 rounded-xl overflow-hidden mb-3 bg-slate-100">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-extrabold text-rose-700 border border-rose-200">
                    {p.tag}
                  </div>
                </div>
                <div className="text-[10px] font-bold text-slate-400 mb-0.5">{p.category}</div>
                <h3 className="text-sm font-bold text-slate-900 mb-1 truncate group-hover:text-rose-600 transition-colors">{p.name}</h3>
                <div className="text-[11px] font-semibold text-slate-500 mb-2">{p.unit}</div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-black text-rose-600">{p.price}</span>
                  {p.mrp && <span className="text-[10px] font-semibold text-slate-400 line-through">{p.mrp}</span>}
                </div>
                <button
                  onClick={() => handlePreOrderWhatsApp(p)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold text-[11px] border border-emerald-200 transition-all cursor-pointer flex items-center gap-1 shadow-2xs active:scale-95"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600 group-hover:text-white" />
                  <span>Pre-Order</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section id="howitworks" className="relative z-10 py-14 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">How It Works</h2>
            <p className="text-slate-600 text-xs md:text-sm">Simple 4-step seamless process from tapping order to receiving fresh items.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, idx) => (
              <div key={idx} className="relative bg-slate-50 border border-slate-200/80 rounded-2xl p-5">
                <div className="text-3xl font-black text-rose-600/30 mb-2">{s.num}</div>
                <h3 className="text-base font-bold text-slate-900 mb-1">{s.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section id="comparison" className="relative z-10 py-14 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">Why Vamaa Urban Fresh?</h2>
          <p className="text-slate-600 text-xs md:text-sm">See how we compare against traditional grocery shopping.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs overflow-x-auto">
          <div className="min-w-[500px]">
            <div className="grid grid-cols-12 bg-slate-100 p-3.5 font-extrabold text-[11px] sm:text-xs border-b border-slate-200">
              <div className="col-span-4 text-slate-700">Feature</div>
              <div className="col-span-4 text-rose-700">Vamaa Urban Fresh</div>
              <div className="col-span-4 text-slate-500">Traditional Grocery</div>
            </div>
            {COMPARISON.map((c, idx) => (
              <div key={idx} className="grid grid-cols-12 p-3.5 text-[11px] sm:text-xs border-b border-slate-100 last:border-0 items-center">
                <div className="col-span-4 font-bold text-slate-900">{c.feature}</div>
                <div className="col-span-4 font-extrabold text-emerald-700 leading-tight">{c.app}</div>
                <div className="col-span-4 font-medium text-slate-500 leading-tight">{c.traditional}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative z-10 py-14 bg-white border-y border-slate-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">Frequently Asked Questions</h2>
            <p className="text-slate-600 text-xs md:text-sm">Everything you need to know about our upcoming launch.</p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between font-bold text-xs sm:text-sm text-slate-900 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-rose-600 transition-transform ${openFaq === idx ? "rotate-180" : ""}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-slate-600 text-xs leading-relaxed border-t border-slate-200/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIP Early Access Form */}
      <section className="relative z-10 py-14 max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-rose-500 to-rose-700 rounded-3xl p-6 sm:p-10 text-center shadow-xl text-white relative overflow-hidden">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">Be First in Line.</h2>
          <p className="text-rose-100 text-xs sm:text-sm max-w-md mx-auto mb-6">
            Get exclusive VIP early access, zero delivery fees for 30 days, and ₹200 launch credits.
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="flex-1 px-4 py-3 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 outline-none text-xs font-semibold"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md cursor-pointer transition-all active:scale-95"
            >
              Get VIP Access
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 bg-white py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-xs">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src={logoUrl} alt={appName} className="h-8 md:h-10 w-auto object-contain" />
          </div>
          <div>© {new Date().getFullYear()} {appName}. All rights reserved.</div>
          <div className="flex items-center gap-4 font-semibold">
            <button
              onClick={openWhatsAppContact}
              className="hover:text-emerald-600 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp Support (8305357624)</span>
            </button>
            <a href="#privacy" className="hover:text-rose-600 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-rose-600 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
      {/* Product Detail Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-[600] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white border border-slate-200 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Image */}
            <div className="relative h-56 bg-slate-100">
              <img
                src={selectedProduct.img}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:text-slate-950 flex items-center justify-center shadow-md cursor-pointer border border-slate-200/80 transition-transform active:scale-90"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-extrabold text-rose-700 border border-rose-200 shadow-2xs">
                {selectedProduct.tag}
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-0.5">
                    {selectedProduct.category}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 leading-tight">
                    {selectedProduct.name}
                  </h3>
                  <div className="text-xs font-semibold text-slate-500 mt-0.5">
                    {selectedProduct.unit}
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 text-amber-800 text-xs font-black shrink-0">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{selectedProduct.rating}</span>
                </div>
              </div>

              <p className="text-slate-600 text-xs leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                {selectedProduct.description}
              </p>

              {/* ETA Highlight */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 bg-rose-50/70 px-4 py-2.5 rounded-2xl border border-rose-100">
                <span className="flex items-center gap-1.5 text-rose-700">
                  ⚡ Guaranteed Sub-15 Min Delivery
                </span>
                <span className="text-rose-800 font-extrabold">{selectedProduct.time}</span>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-4">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-rose-600">{selectedProduct.price}</span>
                  {selectedProduct.mrp && (
                    <span className="text-xs font-semibold text-slate-400 line-through">
                      {selectedProduct.mrp}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => {
                    handlePreOrderWhatsApp(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white/20 text-white" />
                  <span>Pre-Order via WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
