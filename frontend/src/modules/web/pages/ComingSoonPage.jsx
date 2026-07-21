import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, ArrowLeft, MessageCircle, Zap, Sparkles, Clock, ShieldCheck, Mail, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import LogoImage from "@/assets/Logo.png";
import { useSettings } from "@core/context/SettingsContext";

export default function ComingSoonPage() {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const logoUrl = settings?.logoUrl || LogoImage;
  const appName = settings?.appName || "Vamaa Urban Fresh";

  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setIsSubmitted(true);
    toast.success("🎉 You're on the VIP launch list!");
  };

  const openWhatsApp = () => {
    const phoneNumber = "918305357624";
    const text = encodeURIComponent(`Hello ${appName} Team, I would like to inquire about the upcoming app launch.`);
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between p-4 sm:p-6 selection:bg-rose-500 selection:text-white">
      {/* Top Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between py-2">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Landing</span>
        </button>

        <div className="flex items-center gap-2">
          <img src={logoUrl} alt={appName} className="h-8 sm:h-10 w-auto object-contain" />
        </div>
      </header>

      {/* Main Compact Content Card */}
      <main className="max-w-xl mx-auto w-full my-auto py-8">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/60 text-center relative overflow-hidden">
          {/* Subtle Ambient Top Accent */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-600" />

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold mb-5">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>OFFICIAL APP LAUNCHING SOON</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
            Something Instant is <span className="text-rose-600">On The Way.</span>
          </h1>

          <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed max-w-md mx-auto mb-6">
            We are fine-tuning our sub-10 minute quick commerce mobile application for iOS App Store and Google Play Store.
          </p>

          {/* Quick Highlights */}
          <div className="grid grid-cols-3 gap-2 py-4 px-3 bg-slate-50 border border-slate-100 rounded-2xl mb-6 text-left">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-900 leading-tight">&lt;10 Mins</div>
                <div className="text-[9px] font-medium text-slate-500">Delivery</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-900 leading-tight">100% Organic</div>
                <div className="text-[9px] font-medium text-slate-500">Quality</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-900 leading-tight">5,000+ Items</div>
                <div className="text-[9px] font-medium text-slate-500">In Stock</div>
              </div>
            </div>
          </div>

          {/* VIP Access Email Box */}
          {!isSubmitted ? (
            <form onSubmit={handleSubscribe} className="space-y-3 mb-6">
              <div className="text-xs font-bold text-slate-700 text-left">
                Get notified on launch & get ₹200 free credits:
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-rose-400 focus:bg-white transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Notify Me</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2 mb-6">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>You're registered for VIP early launch updates!</span>
            </div>
          )}

          {/* WhatsApp Support Direct Button */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs font-medium text-slate-500">Need urgent assistance or bulk pre-orders?</span>
            <button
              onClick={openWhatsApp}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold text-xs border border-emerald-200 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp Support</span>
            </button>
          </div>
        </div>
      </main>

      {/* Compact Simple Footer */}
      <footer className="max-w-4xl mx-auto w-full text-center py-4 text-xs font-medium text-slate-400">
        © {new Date().getFullYear()} {appName}. All rights reserved.
      </footer>
    </div>
  );
}
