import React from 'react';
import './Layout.css';
import { Home } from 'lucide-react';

interface TopBarProps {
    projectName?: string;
    stepCurrent: number;
    stepTotal: number;
    status?: 'Not Started' | 'In Progress' | 'Shipped';
}

export const TopBar: React.FC<TopBarProps> = ({
    projectName = "New Project",
    stepCurrent,
    stepTotal,
    status = 'Not Started'
}) => {
    return (
        <div className="top-bar">
            <div className="flex items-center gap-2 font-serif font-bold text-lg">
                <Home size={18} className="text-gray-400" />
                <span className="text-gray-900">{projectName}</span>
            </div>

            <div className="progress-indicator">
                Step <span className="step-active">{stepCurrent}</span> / {stepTotal}
            </div>

            <div className="flex items-center gap-4">
                <span className="badge-status">
                    {status}
                </span>
            </div>
        </div>
    );
};
