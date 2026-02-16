import React, { type ReactNode } from 'react';
import './Layout.css';
import { TopBar } from './TopBar';
import { ContextHeader } from './ContextHeader';
import { Workspace } from './Workspace';
import { Footer } from './Footer';

interface ShellProps {
    children: ReactNode;
    panel: ReactNode;
    title: string;
    subtitle: string;
    purpose: string;
    stepCurrent: number;
    stepTotal: number;
    status: 'Not Started' | 'In Progress' | 'Shipped';
}

export const Shell: React.FC<ShellProps> = ({
    children,
    panel,
    title,
    subtitle,
    purpose,
    stepCurrent,
    stepTotal,
    status
}) => {
    return (
        <div className="layout bg-bg text-text min-h-screen font-sans">
            <TopBar
                projectName="KodNest Premium Build"
                stepCurrent={stepCurrent}
                stepTotal={stepTotal}
                status={status}
            />

            <ContextHeader
                title={title}
                subtitle={subtitle}
                purpose={purpose}
            />

            <main className="flex-1 flex flex-col h-full overflow-hidden">
                <Workspace panel={panel}>
                    {children}
                </Workspace>
            </main>

            <Footer />
        </div>
    );
};
