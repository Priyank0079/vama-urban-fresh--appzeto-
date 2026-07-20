import React from 'react';
import {
    Card as ShadcnCard,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cn } from '@/lib/utils';

const Card = ({ children, title, subtitle, className, headerAction, footer, contentClassName, ...props }) => {
    return (
        <ShadcnCard className={cn("enterprise-card !p-0 overflow-hidden", className)} {...props}>
            {(title || subtitle || headerAction) && (
                <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-[#E8EDF5] bg-white px-6 py-5">
                    <div className="space-y-1">
                        {title && <CardTitle className="admin-h3">{title}</CardTitle>}
                        {subtitle && <CardDescription className="admin-description">{subtitle}</CardDescription>}
                    </div>
                    {headerAction && <div>{headerAction}</div>}
                </CardHeader>
            )}
            <CardContent className={cn("p-6", !title && !subtitle && !headerAction && "pt-6", contentClassName)}>
                {children}
            </CardContent>
            {footer && (
                <CardFooter className="bg-[#F7F9FC] border-t border-[#E8EDF5] px-6 py-4">
                    {footer}
                </CardFooter>
            )}
        </ShadcnCard>
    );
};

export default Card;

