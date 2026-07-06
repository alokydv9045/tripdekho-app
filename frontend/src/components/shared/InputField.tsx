import React, { InputHTMLAttributes, ReactNode } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: any;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  error, 
  icon,
  leftIcon, 
  rightIcon, 
  className = '', 
  id,
  ...props 
}) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
  const finalLeftIcon = leftIcon || icon;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label 
        htmlFor={inputId}
        className="text-sm font-semibold text-gray-700 ml-1"
      >
        {label}
      </label>
      
      <div className="relative group">
        {finalLeftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors duration-200">
            {finalLeftIcon}
          </div>
        )}
        
        <input
          id={inputId}
          className={`
            w-full h-12 
            ${finalLeftIcon ? 'pl-11' : 'pl-4'} 
            ${rightIcon ? 'pr-11' : 'pr-4'} 
            bg-gray-50 border border-gray-200 
            text-gray-900 text-sm 
            rounded-xl outline-none 
            transition-all duration-200 
            focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-100/50 
            placeholder:text-gray-400
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''}
            ${className}
          `}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
            {rightIcon}
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs font-medium text-red-500 ml-1 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;
