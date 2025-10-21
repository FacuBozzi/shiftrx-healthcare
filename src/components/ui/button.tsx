'use client';

import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
type ButtonSize = 'md' | 'sm';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-blue-600 text-white shadow-sm hover:bg-blue-700 focus-visible:outline-blue-500 disabled:bg-blue-300',
  secondary:
    'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 focus-visible:outline-blue-500 disabled:text-blue-200 disabled:border-blue-100',
  ghost:
    'bg-transparent text-blue-600 hover:bg-blue-50 focus-visible:outline-blue-500 disabled:text-blue-200',
  outline:
    'border border-neutral-200 text-neutral-700 hover:bg-neutral-50 focus-visible:outline-blue-500 disabled:text-neutral-300 disabled:border-neutral-200',
};

const sizeStyles: Record<ButtonSize, string> = {
  md: 'h-10 px-4 text-sm font-medium rounded-lg',
  sm: 'h-8 px-3 text-xs font-medium rounded-md',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-70',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    />
  )
);

Button.displayName = 'Button';
