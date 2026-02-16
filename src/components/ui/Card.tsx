import React, { type ReactNode } from 'react';
import { clsx } from 'clsx';
import './Card.css';

interface CardProps {
    children: ReactNode;
    className?: string;
    title?: string;
    footer?: ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className, title, footer }) => {
    return (
        <div className={clsx('card', className)}>
            {title && <div className="card-header">{title}</div>}
            <div className="card-body">{children}</div>
            {footer && <div className="card-footer">{footer}</div>}
        </div>
    );
};
