import React from 'react';
import Image, { StaticImageData } from 'next/image';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage: string | StaticImageData;
  altText?: string;
}

const PageHero: React.FC<PageHeroProps> = ({ 
  title, 
  subtitle, 
  backgroundImage, 
  altText = 'Hero Background' 
}) => {
  return (
    <div className="relative w-full h-[400px] md:h-[540px] rounded-[32px] overflow-hidden mb-12 mx-auto shadow-md max-w-[1440px]">
      {/* Background Image */}
      <Image
        src={backgroundImage}
        alt={altText}
        fill
        className="object-cover object-center"
        priority
      />
      
      {/* Overlay - subtle gradient */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
        {subtitle && (
          <h2 className="text-white text-4xl md:text-5xl lg:text-[56px] mb-[-15px] md:mb-[-25px] font-caveat drop-shadow-md z-10 animate-fade-in-up">
            {subtitle}
          </h2>
        )}
        <h1 className="text-white text-6xl md:text-8xl lg:text-[160px] leading-[1.1] font-permanent-marker drop-shadow-xl delay-100 animate-fade-in-up">
          {title}
        </h1>
      </div>
    </div>
  );
};

export default PageHero;
