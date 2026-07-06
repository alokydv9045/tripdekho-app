export interface Blog {
  _id?: string;
  id?: string;
  thumbnail: string; // Backend field
  image?: string; // Legacy support
  title: string;
  publishedAt: string; // Backend field
  date?: string; // Legacy support
  readTime: string;
  slug: string; // Backend field
  url?: string; // Legacy support
  category: string;
  content: string;
}
