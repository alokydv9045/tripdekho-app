'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
          <div className="max-w-xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-red-100 rounded-[32px] flex items-center justify-center mx-auto shadow-xl shadow-red-100/50 border border-red-200">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-black tracking-tighter uppercase text-gray-900 leading-none">
                System <span className="text-red-600">Interruption</span>
              </h1>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                The elite ecosystem encountered an unexpected state
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6 text-left overflow-hidden relative group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <AlertCircle className="w-24 h-24 text-gray-900" />
               </div>
               <p className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-2">Technical Details</p>
               <code className="text-[11px] font-bold text-gray-600 leading-relaxed block overflow-x-auto whitespace-pre-wrap">
                 {this.state.error?.message || 'Undefined runtime exception detected.'}
               </code>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => window.location.reload()}
                className="h-16 px-10 bg-black text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-red-600 transition-all shadow-xl shadow-gray-200 flex items-center gap-3 w-full sm:w-auto justify-center"
              >
                <RefreshCcw className="w-4 h-4" /> Reset Environment
              </button>
              <Link
                href="/"
                className="h-16 px-10 bg-white border border-gray-100 text-gray-900 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-gray-50 transition-all shadow-sm flex items-center gap-3 w-full sm:w-auto justify-center"
              >
                <Home className="w-4 h-4" /> Return Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
