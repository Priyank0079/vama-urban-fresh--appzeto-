import React from 'react';
import { cn } from '@/lib/utils';

const PageHeader = ({ title, description, actions, badge, className }) => {
    return (
        <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8", className)}>
            <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                    <h1 className="admin-h1">{title}</h1>
                    {badge && badge}
                </div>
                {description && <p className="admin-description">{description}</p>}
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
    );
};

export default PageHeader;
