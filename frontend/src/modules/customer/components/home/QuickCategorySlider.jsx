import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { QUICK_CATEGORY_PALETTES } from "../../constants/homeConstants";
import { applyCloudinaryTransform } from "@/core/utils/imageUtils";
import QuickCategoriesBg from "@/assets/Catagorysection_bg.png";

const QuickCategorySlider = ({ categories, onCategoryClick }) => {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const totalDots = Math.min(5, Math.max(3, Math.ceil(categories.length / 4)));

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        const ratio = scrollLeft / maxScroll;
        const index = Math.min(totalDots - 1, Math.floor(ratio * totalDots));
        setActiveIndex(index);
      }
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll, { passive: true });
      return () => el.removeEventListener("scroll", handleScroll);
    }
  }, [categories]);

  const scrollToDot = (dotIndex) => {
    if (scrollRef.current) {
      const { scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const targetLeft = (dotIndex / (totalDots - 1)) * maxScroll;
      scrollRef.current.scrollTo({ left: targetLeft, behavior: "smooth" });
    }
  };

  if (!categories || categories.length === 0) return null;

  return (
    <div className="w-full mb-6 mt-3 overflow-hidden relative group/section z-20">
      <div
        className="relative overflow-hidden bg-gradient-to-b from-white via-rose-50/20 to-white shadow-[0_10px_30px_rgba(225,29,72,0.06)] border-y border-rose-100/60 py-3"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(255,241,242,0.65) 100%), url(${QuickCategoriesBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}>
        {/* Simple & Professional Centered Heading */}
        <div className="relative z-10 px-4 mb-3 text-center flex flex-col items-center">
          <span className="text-[9px] md:text-[10px] font-extrabold uppercase tracking-widest text-rose-500 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100/50 mb-1">
            Shop By
          </span>
          <h2 className="text-[18px] md:text-[22px] font-extrabold tracking-tight bg-gradient-to-r from-slate-950 via-rose-700 to-slate-950 bg-clip-text text-transparent leading-tight">
            Quick Categories
          </h2>
          <div className="w-8 h-[2.5px] rounded-full bg-gradient-to-r from-rose-500 to-amber-400 mt-3 shadow-xs" />
        </div>

        {/* Scrollable Category Cards Container */}
        <div
          ref={scrollRef}
          className="relative z-10 flex items-center gap-3 md:gap-4 overflow-x-auto px-4 pb-3 pt-1 md:px-8 snap-x scroll-smooth no-scrollbar">
          {categories.map((cat, idx) => {
            const palette = QUICK_CATEGORY_PALETTES[idx % QUICK_CATEGORY_PALETTES.length];
            const fallbackImage = "https://cdn-icons-png.flaticon.com/128/2321/2321831.png";
            const rawImage = cat.image || fallbackImage;
            
            const displayImage = rawImage.includes('cloudinary') || rawImage.includes('res.cloudinary.com')
              ? applyCloudinaryTransform(rawImage, "f_auto,q_auto,c_scale,w_200") 
              : rawImage;

            return (
              <div
                key={cat.id}
                onClick={() => onCategoryClick(cat.id)}
                className="flex flex-col items-center gap-1.5 min-w-[98px] md:min-w-[106px] lg:min-w-[118px] cursor-pointer group/item snap-start transition-all active:scale-95">
                <div
                  className="relative w-[98px] h-[104px] md:w-[106px] md:h-[114px] lg:w-[118px] lg:h-[126px] rounded-2xl md:rounded-[22px] lg:rounded-3xl shadow-[0_4px_14px_rgba(0,0,0,0.04)] flex flex-col items-center justify-between p-1.5 pb-2 md:p-2 md:pb-2.5 lg:p-2 lg:pb-3 transition-all duration-300 group-hover/item:-translate-y-1.5 group-hover/item:shadow-[0_12px_24px_rgba(0,0,0,0.08)] border overflow-hidden backdrop-blur-xs"
                  style={{
                    background: `linear-gradient(145deg, ${palette.bgFrom} 0%, ${palette.bgVia || palette.bgFrom} 55%, ${palette.bgTo || '#ffffff'} 100%)`,
                    borderColor: palette.frameColor || 'rgba(244,63,94,0.15)'
                  }}>
                  {/* Category Image Rectangle */}
                  <div className="relative w-[86px] h-[64px] md:w-[90px] md:h-[68px] lg:w-[102px] lg:h-[76px] rounded-xl bg-white p-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-white/60 flex items-center justify-center transition-all duration-300 group-hover/item:scale-105">
                    <img
                      src={displayImage}
                      alt={cat.name}
                      loading="lazy"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>

                  {/* Title */}
                  <div className="w-full text-center px-1">
                    <span className="block text-[11px] md:text-[12px] font-bold text-slate-800 leading-tight whitespace-nowrap overflow-hidden text-ellipsis group-hover/item:text-rose-600 transition-colors">
                      {cat.name}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Centered Bottom Scroll Indicator Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-1 relative z-10">
          {Array.from({ length: totalDots }).map((_, dIdx) => (
            <button
              key={dIdx}
              onClick={() => scrollToDot(dIdx)}
              aria-label={`Scroll to category set ${dIdx + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                activeIndex === dIdx
                  ? "w-5 h-1.5 bg-rose-600 shadow-xs"
                  : "w-1.5 h-1.5 bg-rose-300/60 hover:bg-rose-400"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(QuickCategorySlider);
