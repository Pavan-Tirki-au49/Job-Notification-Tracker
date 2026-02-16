import React from 'react';
import './Layout.css';

interface ContextHeaderProps {
    title: string;
    subtitle: string;
    purpose: string;
}

export const ContextHeader: React.FC<ContextHeaderProps> = ({ title, subtitle, purpose }) => {
    return (
        <header className="context-header">
            <h1 className="text-2xl font-serif text-gray-900 mb-2">{title}</h1>
            <div className="text-gray-600 text-sm md:text-base leading-relaxed max-w-2xl">
                {subtitle}
            </div>
            <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-accent border-l-2 pl-3 border-accent">
                Purpose: {purpose}
            </div>
        </header>
    );
};
