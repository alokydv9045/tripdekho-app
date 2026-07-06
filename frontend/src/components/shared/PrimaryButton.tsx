import React, { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ 
  children, 
  className = '', 
  fullWidth = false,
  ...props 
}) => {
  return (
    <button 
      className={cn(
        "px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-black font-extrabold text-sm rounded-full transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap",
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;

