import React, { useState } from 'react';
import './Layout.css';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';

interface CheckItemProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

const CheckItem: React.FC<CheckItemProps> = ({ label, checked, onChange }) => (
    <div
        className="proof-item cursor-pointer hover:bg-gray-50 p-2 rounded"
        onClick={() => onChange(!checked)}
    >
        <div className={clsx("w-5 h-5 flex items-center justify-center border rounded",
            checked ? "bg-accent border-accent text-white" : "border-gray-300 bg-white"
        )}>
            {checked && <Check size={14} />}
        </div>
        <span className={checked ? "text-gray-900 font-medium" : "text-gray-500"}>{label}</span>
    </div>
);

export const Footer: React.FC = () => {
    const [checks, setChecks] = useState({
        ui: false,
        logic: false,
        test: false,
        deployed: false
    });

    const toggle = (key: keyof typeof checks) => (val: boolean) => setChecks({ ...checks, [key]: val });

    return (
        <footer className="proof-footer">
            <div className="text-gray-500 text-sm font-medium">Build Integrity Check</div>
            <div className="proof-checklist">
                <CheckItem label="UI Built" checked={checks.ui} onChange={toggle('ui')} />
                <CheckItem label="Logic Working" checked={checks.logic} onChange={toggle('logic')} />
                <CheckItem label="Test Passed" checked={checks.test} onChange={toggle('test')} />
                <CheckItem label="Deployed" checked={checks.deployed} onChange={toggle('deployed')} />
            </div>
            <div className={clsx("text-sm transition-colors duration-300",
                Object.values(checks).every(Boolean) ? "text-accent font-bold" : "text-gray-400"
            )}>
                {Object.values(checks).every(Boolean) ? "Ready to Ship" : "Pending Verification"}
            </div>
        </footer>
    );
};
