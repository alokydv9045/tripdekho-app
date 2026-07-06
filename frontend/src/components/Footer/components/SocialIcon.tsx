import React from "react";

interface SocialIconProps {
  d: string;
  name: string;
  url: string;
}

export default function SocialIcon({ d, name, url }: SocialIconProps) {
  return (
    <a
      className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-gray-300 hover:bg-[#FFD100] hover:text-black hover:border-[#FFD100] transition-colors"
      href={url}
      aria-label={name}
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d={d} />
      </svg>
    </a>
  );
}
