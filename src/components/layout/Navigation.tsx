import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import { Menu, X, Home, Save, Newspaper, CheckCircle, Settings, LayoutDashboard } from 'lucide-react';
import './Navigation.css';

interface NavigationProps {
    // Mobile only props?
}

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/saved', label: 'Saved', icon: <Save size={18} /> },
    { path: '/digest', label: 'Digest', icon: <Newspaper size={18} /> },
    { path: '/settings', label: 'Settings', icon: <Settings size={18} /> },
    { path: '/proof', label: 'Proof', icon: <CheckCircle size={18} /> },
];

export const Navigation: React.FC<NavigationProps> = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <>
            <nav className="nav-container">
                {/* Logo / Brand */}
                <NavLink to="/" className="nav-logo" onClick={() => setIsMobileMenuOpen(false)}>
                    <Home className="text-accent" />
                    <span>JobTracker</span>
                </NavLink>

                {/* Desktop Links */}
                <div className="hidden md:flex gap-6 items-center">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => clsx("nav-link flex items-center gap-2", isActive && "active")}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </div>

                {/* Mobile Menu Button */}
                <button className="mobile-menu-btn md:hidden p-2" onClick={toggleMobileMenu}>
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {/* Mobile Overlay & Content */}
            <div className={clsx("mobile-nav-overlay md:hidden", isMobileMenuOpen ? "block" : "hidden")} onClick={() => setIsMobileMenuOpen(false)}>
                <div className="mobile-nav-content bg-bg border-b border-gray-200 p-4 absolute w-full top-0 left-0" onClick={e => e.stopPropagation()}>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => clsx("block py-3 px-4 rounded text-base font-medium flex items-center gap-3 hover:bg-gray-100 transition-colors", isActive ? "text-accent bg-red-50" : "text-gray-700")}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {({ isActive }) => (
                                <>
                                    <span className={clsx(isActive ? "text-accent" : "text-gray-400")}>{item.icon}</span>
                                    {item.label}
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </div>
        </>
    );
};
