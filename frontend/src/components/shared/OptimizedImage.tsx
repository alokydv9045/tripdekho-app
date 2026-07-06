'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { fixImageUrl } from '@/lib/utils/formatters';

interface OptimizedImageProps extends Omit<ImageProps, 'onError'> {
  fallback?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  src, 
  alt, 
  fallback = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80', 
  className,
  ...props 
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [error, setError] = useState(false);

  const currentSrc = error ? fallback : imgSrc;
  const finalSrc = typeof currentSrc === 'string' ? fixImageUrl(currentSrc) : currentSrc;

  return (
    <Image
      {...props}
      src={finalSrc || fallback}
      alt={alt}
      className={`${className} ${error ? 'opacity-50 grayscale' : ''}`}
      onError={() => {
        setError(true);
      }}
    />
  );
};

export default OptimizedImage;
