import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Article = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image_url: string;
  category: string;
  author: string;
  is_breaking: boolean;
  is_featured: boolean;
  published_at: string;
  created_at: string;
};

export const CATEGORIES = [
  { id: 'all', label: 'All News' },
  { id: 'economics', label: 'Economy' },
  { id: 'sports', label: 'Sports' },
  { id: 'politics', label: 'Politics' },
  { id: 'technology', label: 'Technology' },
  { id: 'education', label: 'Education' },
  { id: 'environment', label: 'Environment' },
  { id: 'infrastructure', label: 'Infrastructure' },
  { id: 'travel', label: 'Travel' },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]['id'];
