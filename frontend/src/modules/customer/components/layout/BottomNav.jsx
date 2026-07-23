import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, ShoppingBag, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const navItems = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Category', icon: LayoutGrid, path: '/categories' },
    { label: 'Orders', icon: ShoppingBag, path: '/orders' },
    { label: 'Profile', icon: User, path: '/profile' },
];

const BottomNav = () => {
    const location = useLocation();

    return (
        <div className="fixed bottom-4 left-4 right-4 z-[500] bg-white/95 backdrop-blur-md border border-slate-100 flex items-center justify-around h-[66px] md:hidden shadow-[0_12px_30px_rgba(0,0,0,0.08)] rounded-[24px] px-2">
            {navItems.map((item) => {
                const isActive = location.pathname === item.path ||
                    (item.path !== '/' && location.pathname.startsWith(item.path));

                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        className="flex-1 flex items-center justify-center h-full relative"
                    >
                        <motion.div
                            whileTap={{ scale: 0.92 }}
                            className="flex flex-col items-center justify-center w-full h-full py-2 relative z-10"
                        >
                            <div className="relative flex flex-col items-center justify-center px-4 py-1.5 rounded-full">
                                {isActive && (
                                    <motion.div
                                        layoutId="active-pill"
                                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                        className="absolute inset-0 bg-primary/10 rounded-full -z-10"
                                    />
                                )}
                                <item.icon
                                    size={21}
                                    strokeWidth={isActive ? 2.5 : 2}
                                    className={cn(
                                        "transition-colors duration-300",
                                        isActive ? "text-primary" : "text-slate-500"
                                    )}
                                />
                                <span
                                    className={cn(
                                        "text-[10px] font-bold tracking-tight mt-0.5 transition-colors duration-300",
                                        isActive ? "text-primary" : "text-slate-400"
                                    )}
                                >
                                    {item.label}
                                </span>
                            </div>
                        </motion.div>
                    </Link>
                );
            })}
        </div>
    );
};

export default BottomNav;

