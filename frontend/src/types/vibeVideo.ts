export interface VibeVideo {
  id: string;
  _id?: string; // For backward compatibility
  title?: string;
  instagramUrl?: string;
  videoUrl?: string;
  thumbnail?: string;
  location?: string;
  category?: string;
  description?: string;
  duration?: string;
  isFeatured: boolean;
  isActive: boolean;
  order: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}
