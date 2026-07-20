import React from 'react';
import { useSettings } from '@core/context/SettingsContext';

const MobileFooterMessage = () => {
    const { settings } = useSettings();
    const appName = settings?.appName || 'App';
    return (
        <div className="md:hidden w-full flex flex-col items-center pt-2 pb-24 px-6 bg-transparent">
            <div className="w-full flex flex-col items-center text-center gap-0.5">
                <h2 className="text-base leading-tight font-medium text-slate-300 tracking-tight text-center">
                    India's last minute app <span className="text-red-500">❤️</span>
                </h2>
                <div className="text-slate-300 font-semibold text-xs tracking-tight text-center">
                    {appName}
                </div>
            </div>
        </div>
    );
};

export default MobileFooterMessage;
