import React, { ReactNode } from 'react';

interface SideContactCardProps {
  title: string;
  subtext?: string;
  value: string;
  icon: ReactNode;
}

const SideContactCard: React.FC<SideContactCardProps> = ({ title, subtext, value, icon }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-start gap-5 transition-transform hover:scale-[1.02] duration-300">
      <div className="flex-1">
        <h3 className="text-gray-500 font-medium text-sm mb-1">{title}</h3>
        <div className="w-10 h-0.5 bg-amber-400 mb-4" />
        {subtext && (
          <p className="text-gray-400 text-xs mb-1 font-medium italic">{subtext}</p>
        )}
        <p className="text-gray-800 text-lg font-bold tracking-tight">{value}</p>
      </div>
      <div className="shrink-0 w-16 h-16 flex items-center justify-center">
        {icon}
      </div>
    </div>
  );
};

export default SideContactCard;
