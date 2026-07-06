import React, { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, containerClassName = "", ...props }, ref) => {
    const textareaId = props.id || props.name;

    return (
      <div className={`w-full ${containerClassName}`}>
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
        <textarea
          {...props}
          ref={ref}
          id={textareaId}
          className={`
            block w-full rounded-lg border px-4 py-2.5 text-gray-900 
            transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-primary/20 
            disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500
            min-h-[120px] resize-y
            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-200 hover:border-gray-300 focus:border-primary"
            }
            ${props.className || ""}
          `}
        />
        {error && (
          <p className="mt-1.5 text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
