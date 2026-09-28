import React from 'react';
import { cn } from '@utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'inverse';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  text?: string;
  href?: string;
  target?: string;
  rel?: string;
  isLoading?: boolean;
}

const VARIANTS: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-[#472D82] text-white shadow-sm hover:bg-[#382367] active:scale-[0.98] focus-visible:ring-[#472D82]/50',
  secondary:
    'bg-gray-100 text-gray-900 hover:bg-gray-200 active:scale-[0.98] focus-visible:ring-gray-400',
  outline:
    'border-2 border-[#472D82] text-[#472D82] bg-transparent hover:bg-[#472D82]/10 active:scale-[0.98] focus-visible:ring-[#472D82]/50',
  ghost:
    'text-gray-700 bg-transparent hover:bg-gray-100 active:scale-[0.98] focus-visible:ring-gray-400',
  inverse:
    'text-white bg-white/10 border border-white/25 hover:bg-white/20 active:scale-[0.98] focus-visible:ring-white',
};

const SIZES: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-1.5 text-xs font-medium rounded-full',
  md: 'px-6 py-2.5 text-sm font-semibold rounded-full',
  lg: 'px-8 py-3 text-base font-semibold rounded-full',
  icon: 'size-10 p-2 rounded-full grid place-items-center shrink-0',
};

const BASE_STYLES =
  'inline-flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      text,
      isLoading = false,
      disabled,
      href,
      target,
      rel,
      children,
      ...props
    },
    ref,
  ) => {
    const combinedClasses = cn(BASE_STYLES, VARIANTS[variant], SIZES[size], className);

    if (href) {
      return (
        <a
          href={href}
          target={target}
          rel={rel}
          className={combinedClasses}
          aria-disabled={disabled || isLoading}
        >
          {isLoading && (
            <svg
              className="size-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeLinecap="round" />
            </svg>
          )}
          {text}
          {children}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={combinedClasses}
        {...props}
      >
        {isLoading && (
          <svg
            className="size-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeLinecap="round" />
          </svg>
        )}
        {text}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
export default Button;
