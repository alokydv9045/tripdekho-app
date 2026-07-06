export interface VlogVideo {
  _id: string;
  id?: string; // Legacy support
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  category: 'Adventure' | 'Culture' | 'Relaxation' | 'Food' | 'Wildlife' | 'Luxury' | string;
  location: string;
  views: string;
  isFeatured?: boolean;
  isActive?: boolean;
  sortOrder?: number;
}

export const vlogCategories = [
  { id: 'all', name: 'All Explore' },
  { id: 'adventure', name: 'Thrill & Adventure' },
  { id: 'culture', name: 'Hidden Cultures' },
  { id: 'relaxation', name: 'Peace & Serenity' },
  { id: 'food', name: 'Taste the World' },
];

