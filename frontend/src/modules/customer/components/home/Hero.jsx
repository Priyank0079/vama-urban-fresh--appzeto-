import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Tag, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LazyImage from '@/shared/components/LazyImage';

const banners = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1920",
        badge: "Fresh Arrival",
        badgeIcon: Sparkles,
        badgeColor: "bg-green-500 text-white",
        title: "Farm Fresh",
        highlight: "Vegetables",
        highlightColor: "text-green-400",
        subtitle: "Hand-picked daily for maximum freshness and taste. Delivered to your door.",
        cta: "Shop Now"
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&q=80&w=1920",
        badge: "Hot Deal",
        badgeIcon: Tag,
        badgeColor: "bg-red-500 text-white",
        title: "Summer",
        highlight: "Sale",
        highlightColor: "text-yellow-400",
        subtitle: "Get cool discounts on all refreshing summer drinks and essentials.",
        cta: "View Offers"
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=1920",
        badge: "New Stock",
        badgeIcon: Star,
        badgeColor: "bg-brand-500 text-white",
        title: "Healthy",
        highlight: "Choices",
        highlightColor: "text-brand-300",
        subtitle: "Everything you need for a balanced and healthy diet, available instantly.",
        cta: "Start Healthy"
    }
];

const Hero = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative w-full overflow-hidden bg-slate-50 py-4 md:py-8 lg:py-12">
            <div className="container mx-auto px-4 md:px-[50px] max-w-[1920px]">
                
                <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-[32px] overflow-hidden shadow-2xl border-2 border-slate-200/50 bg-slate-100">
                    {banners.map((banner, index) => (
                        <div
                            key={banner.id}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                        >
                            <LazyImage
                                src={banner.image}
                                alt={banner.title}
                                className={`w-full h-full object-cover transition-transform duration-[6000ms] ease-out ${index === current ? 'scale-105' : 'scale-100'}`}
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center">
                                <div className="px-8 md:px-16 lg:px-24 w-full max-w-2xl transform transition-all duration-700 delay-100">
                                    <div className={`transform transition-all duration-700 ${index === current ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                        <div className="inline-flex items-center gap-2 mb-4 md:mb-6">
                                            <span className={`${banner.badgeColor} font-semibold px-4 py-1.5 rounded-full text-xs uppercase tracking-widest shadow-md flex items-center gap-1.5`}>
                                                <banner.badgeIcon size={14} fill="currentColor" /> {banner.badge}
                                            </span>
                                        </div>
                                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-heading font-semibold mb-4 text-white leading-tight">
                                            {banner.title} <br /> 
                                            <span className={banner.highlightColor}>{banner.highlight}</span>
                                        </h1>
                                        <p className="font-medium text-base md:text-lg text-slate-200 mb-8 max-w-lg leading-relaxed">
                                            {banner.subtitle}
                                        </p>
                                        <Button className="bg-white text-slate-900 hover:bg-slate-100 font-semibold px-8 py-6 rounded-2xl text-base shadow-lg transition-transform hover:-translate-y-1 active:translate-y-0 flex items-center gap-2">
                                            {banner.cta} <ArrowRight className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Navigation Dots */}
                    <div className="absolute bottom-6 left-8 md:left-16 lg:left-24 z-20 flex gap-2">
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrent(index)}
                                className={`h-2 rounded-full transition-all duration-300 ${index === current ? 'bg-white w-8' : 'bg-white/40 hover:bg-white/60 w-2'}`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Hero;

