import React from 'react';
import { clsx } from 'clsx';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    className?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    className,
    ...props
}) => {
    return (
        <div className={clsx('input-group', className)}>
            <label className="label">
                {label}
                {props.required && <span className="text-accent ml-1">*</span>}
            </label>
            <input
                className={clsx('input-field', error && 'input-error')}
                {...props}
            />
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};
