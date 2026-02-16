import React from 'react';
import { clsx } from 'clsx';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'text';
    size?: 'md' | 'sm';
    label: string;
    icon?: React.ReactNode;
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    label,
    variant = 'primary',
    className,
    size = 'md',
    icon,
    isLoading,
    ...props
}) => {
    return (
        <button
            className={clsx(
                'btn',
                `btn-${variant}`,
                size === 'sm' && 'btn-sm',
                className
            )}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <span className="spinner">↻</span>
            ) : icon}
            {label}
        </button>
    );
};
