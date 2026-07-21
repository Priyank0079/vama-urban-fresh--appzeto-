import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Lottie from "lottie-react";
import ProductCard from "../shared/ProductCard";
import {
  getBackgroundColorByValue,
  getBackgroundGradientByValue,
} from "@/shared/constants/offerSectionOptions";
import { applyCloudinaryTransform } from "@/core/utils/imageUtils";

const OfferSections = ({ sections, noServiceData }) => {
  if (!sections || sections.length === 0) return null;

  return (
    <div className="w-full px-0 pt-0 pb-2 md:pb-4">
      {[...sections]
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((section) => {
          const bgColor = getBackgroundColorByValue(section.backgroundColor);
          const sectionProducts = (section.productIds || [])
            .filter((p) => typeof p === "object" && p !== null)
            .map((p) => ({
              id: p._id,
              _id: p._id,
              name: p.name,
              image: p.mainImage || p.image || "",
              price: p.salePrice ?? p.price,
              originalPrice: p.price ?? p.salePrice,
              weight: p.weight,
              deliveryTime: p.deliveryTime,
            }));

          const sectionSellers = (section.sellerIds || [])
            .filter((s) => typeof s === "object" && s !== null)
            .map((s) => ({
              id: s._id,
              name: s.shopName || s.name,
              image: s.logo || "",
            }));

          return (
            <motion.div
              key={section._id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.4 }}
              className="mb-4 rounded-none overflow-hidden shadow-[0_18px_35px_rgba(15,23,42,0.16)] bg-white border-y border-slate-100/70 border-x-0 md:border-x">
              <div
                className="relative flex items-center justify-between px-5 md:px-8 py-5 md:py-6 text-white overflow-hidden rounded-t-xl"
                style={{
                  background: "linear-gradient(135deg, #e11d48 0%, #be123c 45%, #9f1239 100%)",
                }}>
                {/* Decorative background glow & shapes */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <div className="absolute -top-12 -left-12 w-44 h-44 md:w-60 md:h-60 bg-rose-400/25 rounded-full blur-3xl animate-pulse" />
                  <div className="absolute -bottom-10 right-10 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl" />
                  <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-64 h-24 bg-white/5 rotate-12 blur-2xl pointer-events-none" />
                </div>

                <div className="flex-1 pr-4 relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-rose-100 mb-2 shadow-sm">
                    <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300 animate-spin-slow" />
                    <span>Trending Right Now</span>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight text-white drop-shadow-md">
                    {section.title || "Trending Deals"}
                  </h3>

                  <p className="text-[11px] md:text-xs font-medium text-rose-100/90 mt-1.5 flex items-center gap-2">
                    <span className="inline-block px-2 py-0.5 rounded bg-rose-950/40 text-amber-300 font-semibold border border-rose-400/30">
                      {(sectionProducts.length + sectionSellers.length) > 0 ? `${sectionProducts.length + sectionSellers.length} Hot Items` : "Curated Selection"}
                    </span>
                    <span>•</span>
                    <span className="truncate">
                      {(section.categoryIds || [])
                        .map((c) => (typeof c === "object" && c?.name ? c.name : null))
                        .filter(Boolean)
                        .join(", ") || section.categoryId?.name || "Best Prices & Fresh Quality"}
                    </span>
                  </p>
                </div>

                {/* Right side item spotlight card */}
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex-shrink-0 shadow-[0_16px_30px_rgba(0,0,0,0.35)] border border-white/25 overflow-hidden relative bg-white/10 transition-transform hover:-translate-y-1 hover:rotate-[-3deg] hover:scale-105">
                  {(sectionProducts[0]?.image || sectionSellers[0]?.image) ? (
                    <>
                      <img
                        src={applyCloudinaryTransform(sectionProducts[0]?.image || sectionSellers[0]?.image, "f_auto,q_auto,w_150")}
                        alt={section.title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-rose-950/80 via-transparent to-transparent" />
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500 via-rose-600 to-rose-800" />
                  )}

                  {(sectionProducts.length > 0 || sectionSellers.length > 0) && (
                    <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-rose-950/80 text-[9px] font-bold text-rose-100 tracking-wide border border-rose-400/40 shadow-sm">
                      {sectionProducts.length + sectionSellers.length} items
                    </div>
                  )}

                  <div className="relative z-10 flex items-center justify-center h-full">
                    <Sparkles
                      className="text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.9)] animate-pulse"
                      size={28}
                    />
                  </div>
                </div>
              </div>
              <div className="px-4 pt-4 md:px-5 md:pt-5 pb-1">
                <div className="flex overflow-x-auto gap-3 md:gap-4 pb-0 no-scrollbar snap-x snap-mandatory">
                  {sectionProducts.length === 0 && sectionSellers.length === 0 ? (
                    <div className="w-full py-10 flex flex-col items-center justify-center text-center">
                      <div className="w-32 h-32 mb-3">
                        {noServiceData ? (
                          <Lottie animationData={noServiceData} loop={true} />
                        ) : (
                          <div className="w-32 h-32" />
                        )}
                      </div>
                      <p className="text-sm md:text-base text-slate-400 font-bold">
                        Looking for the best items in this category...
                      </p>
                    </div>
                  ) : (
                    <>
                      {sectionSellers.map((seller) => (
                        <div key={`seller-${seller.id}`} className="w-[110px] sm:w-[120px] md:w-[130px] flex-shrink-0 snap-start bg-white rounded-xl border border-slate-100 shadow-[0_10px_24px_rgba(15,23,42,0.08)] flex flex-col items-center justify-center p-3 text-center transition-transform hover:-translate-y-1">
                          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-slate-50 mb-2 overflow-hidden border border-slate-100 flex items-center justify-center shadow-sm">
                            {seller.image ? (
                              <img src={applyCloudinaryTransform(seller.image, "f_auto,q_auto,w_100")} alt={seller.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xl font-bold text-slate-300">{seller.name.charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                          <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight px-1">{seller.name}</h4>
                          <p className="text-[9px] text-brand-600 mt-1 font-semibold uppercase tracking-widest bg-brand-50 px-2 py-0.5 rounded-full">Store</p>
                        </div>
                      ))}
                      {sectionProducts.map((product) => (
                        <div key={`product-${product.id}`} className="w-[126px] sm:w-[136px] md:w-[148px] flex-shrink-0 snap-start">
                          <ProductCard
                            product={product}
                            className="bg-white border border-slate-100 shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
                            compact
                          />
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
    </div>
  );
};

export default React.memo(OfferSections);
