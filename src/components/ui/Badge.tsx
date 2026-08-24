import React, { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'neutral';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2',
          {
            'bg-slate-900 text-slate-50 hover:bg-slate-900/80': variant === 'default',
            'bg-slate-100 text-slate-900 hover:bg-slate-100/80': variant === 'neutral',
            'bg-green-100 text-green-800 hover:bg-green-100/80': variant === 'success',
            'bg-amber-100 text-amber-800 hover:bg-amber-100/80': variant === 'warning',
            'bg-red-100 text-red-800 hover:bg-red-100/80': variant === 'danger',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';
