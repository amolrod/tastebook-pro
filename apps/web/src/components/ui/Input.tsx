import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, helperText, className, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold mb-2 text-black dark:text-white font-inter"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full py-3 border rounded-lg bg-white dark:bg-[#1E1E1E] text-black dark:text-white font-inter',
              'focus:outline-none focus:ring-2 transition-all duration-200',
              error
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-[#E6E6E6] dark:border-[#333333] focus:ring-[#10b981] focus:border-[#10b981]',
              leftIcon && 'pl-11',
              rightIcon && 'pr-12',
              !leftIcon && !rightIcon && 'px-4',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-500 mt-1 font-inter">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-xs text-gray-500 mt-1 font-inter">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
