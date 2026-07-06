"use client";

import React from "react";
import { LucideIcon, Inbox } from "lucide-react";
import PrimaryButton from "./PrimaryButton";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionText?: string;
  actionLink?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description, 
  icon: Icon = Inbox, 
  actionText, 
  actionLink 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-dashed border-gray-200 rounded-[40px] shadow-sm animate-in fade-in zoom-in duration-500">
      <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 text-amber-500">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">
        {title}
      </h3>
      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest max-w-md mx-auto leading-relaxed mb-8">
        {description}
      </p>
      {actionText && actionLink && (
        <Link href={actionLink}>
          <PrimaryButton className="px-8 h-12 text-xs">
            {actionText}
          </PrimaryButton>
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
