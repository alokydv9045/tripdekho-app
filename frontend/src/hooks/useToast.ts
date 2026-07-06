import { useState, useEffect, useCallback } from 'react';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

// Simple event-based toast system to avoid complex state management for now
export const useToast = () => {
  const showToast = useCallback((message: string, variant: ToastVariant = 'info') => {
    const event = new CustomEvent('show-toast', { 
      detail: { message, variant, id: Math.random().toString(36).substr(2, 9) } 
    });
    window.dispatchEvent(event);
  }, []);

  return {
    success: (msg: string) => showToast(msg, 'success'),
    error: (msg: string) => showToast(msg, 'error'),
    info: (msg: string) => showToast(msg, 'info'),
    warning: (msg: string) => showToast(msg, 'warning'),
  };
};
