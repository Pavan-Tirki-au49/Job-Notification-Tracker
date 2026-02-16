import React, { type ReactNode } from 'react';
import './Layout.css';

interface WorkspaceProps {
    children: ReactNode; // Primary content
    panel: ReactNode;    // Secondary panel content
}

export const Workspace: React.FC<WorkspaceProps> = ({ children, panel }) => {
    return (
        <div className="workspace-container">
            <div className="panel-primary">
                {children}
            </div>
            <div className="panel-secondary">
                {panel}
            </div>
        </div>
    );
};
