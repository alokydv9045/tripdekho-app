import React from "react";
import Link from "next/link";
import { VendorRole } from "@/types/vendorRole";

interface PartnerCardProps {
  role: any;
}

const IconKeys = () => (
  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 8C15 10.7614 12.7614 13 10 13C7.23858 13 5 10.7614 5 8C5 5.23858 7.23858 3 10 3C12.7614 3 15 5.23858 15 8Z" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.5 11.5L21 19" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 16L19.5 17.5" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 14L17.5 15.5" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconSuitcase = () => (
  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 7H16M8 7V5C8 4.46957 8.21071 3.96086 8.58579 3.58579C8.96086 3.21071 9.46957 3 10 3H14C14.5304 3 15.0391 3.21071 15.4142 3.58579C15.7893 3.96086 16 4.46957 16 5V7M8 7H5C4.46957 7 3.96086 7.21071 3.58579 7.58579C3.21071 7.96086 3 8.46957 3 9V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V9C21 8.46957 20.7893 7.96086 20.4142 7.58579C20.0391 7.21071 19.5304 7 19 7H16" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconCamera = () => (
  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="#9C27B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="13" r="4" stroke="#9C27B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconUsers = () => (
  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 21V19C17 17.9391 16.5786 16.8913 15.8284 16.1412C15.0783 15.3911 14.0304 15 13 15H5C3.96957 15 2.92172 15.3911 2.17157 16.1412C1.42143 16.8913 1 17.9391 1 19V21" stroke="#2196F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#2196F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2522 22.1614 16.5523C21.6184 15.8524 20.8581 15.3516 20 15.13" stroke="#2196F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25393 19.0078 6.11768 19.0078 7.005C19.0078 7.89232 18.7122 8.75607 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#2196F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconStar = () => (
  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconHeadphones = () => (
  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" stroke="#E91E63" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" stroke="#E91E63" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" stroke="#E91E63" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const getIcon = (type: string) => {
  switch (type?.toLowerCase()) {
    case "keys": return <IconKeys />;
    case "suitcase": return <IconSuitcase />;
    case "camera": return <IconCamera />;
    case "headphones": return <IconHeadphones />;
    case "users": return <IconUsers />;
    case "star": return <IconStar />;
    default: return null;
  }
};

const PartnerCard: React.FC<PartnerCardProps> = ({ role }) => {
  return (
    <article className="flex flex-col bg-[#F0F0F0] rounded-[24px] p-8 h-full transition-transform hover:-translate-y-1">
      {/* Icon Area */}
      <div className="flex justify-center items-center h-[160px] mb-6">
        {/* Placeholder for the 3D icons from design. Using colored SVGs for now until 3D assets are available */}
        <div className="drop-shadow-lg opacity-90 hover:scale-110 transition-transform duration-300">
          {getIcon(role.iconType)}
        </div>
      </div>

      {/* Text Content */}
      <div className="flex flex-col flex-grow">
        <h3 className="text-[17px] font-bold text-gray-900 leading-[1.3] whitespace-pre-line mb-8">
          {role.title}
        </h3>
      </div>

      {/* Action Button */}
      <div className="mt-auto">
        <Link
          href={role.actionUrl}
          className="inline-block bg-[#111111] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-black transition-colors shadow-sm"
        >
          Apply Now
        </Link>
      </div>
    </article>
  );
};

export default PartnerCard;
