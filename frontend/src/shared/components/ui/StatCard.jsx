import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ 
    label, 
    value, 
    icon: Icon, 
    trend, 
    trendDirection = 'up',
    description,
    color = 'text-brand-600',
    bg = 'bg-brand-50',
    onClick,
    className 
}) => {
    return (
        <div 
            onClick={onClick}
            className={cn(
                "enterprise-card group",
                onClick && "cursor-pointer",
                className
            )}
        >
            <div className="flex flex-col space-y-3">
                <div className="flex justify-between items-start">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", bg)}>
                        {Icon && <Icon className={cn("w-6 h-6", color)} strokeWidth={2} />}
                    </div>
                    {trend && (
                        <div className={cn(
                            "flex items-center px-2 py-1 rounded-md text-[11px] font-bold tracking-tight",
                            trendDirection === 'up' ? 'text-[#0EA5A4] bg-[#E6FFFB]' : 'text-[#EF4444] bg-[#FEF2F2]'
                        )}>
                            {trendDirection === 'up' ? (
                                <TrendingUp className="w-3 h-3 mr-1" />
                            ) : (
                                <TrendingDown className="w-3 h-3 mr-1" />
                            )}
                            {trend}
                        </div>
                    )}
                </div>
                <div>
                    <p className="admin-label mb-1.5">{label}</p>
                    <p className="admin-stat-value">{value}</p>
                    {description && <p className="admin-description mt-1">{description}</p>}
                </div>
            </div>
        </div>
    );
};

export default StatCard;
