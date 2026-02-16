import React from 'react';

import { Clock } from 'lucide-react';

interface PagePlaceholderProps {
    title: string;
}

export const PagePlaceholder: React.FC<PagePlaceholderProps> = ({ title }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-in fade-in zoom-in duration-300">
            <div className="mb-6 p-4 rounded-full bg-gray-50 border border-gray-100">
                <Clock size={48} className="text-gray-300" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-3">{title}</h1>
            <p className="text-gray-500 text-base max-w-md">
                This section will be built in the next step.
            </p>
        </div>
    );
};
