'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
    size?: 'small' | 'medium' | 'large';
    rounded?: boolean;
}

export default function Button({
    children,
    variant = 'primary',
    size = 'medium',
    rounded = false,
    className = '',
    ...props
}: ButtonProps) {
    const sizeStyles = {
        small: 'px-2 py-2 text-sm',
        medium: 'px-4 py-2 text-base font-semibold',
        large: 'px-6 py-3 text-lg font-semibold',
    };

    const baseStyles = `rounded focus:outline-none focus:shadow-outline ${rounded ? 'rounded-full' : ''}`;
    const variantStyles = {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
    };

    const buttonStyles = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

    return (
        <button className={buttonStyles} {...props}>
            {children}
        </button>
    );
}
