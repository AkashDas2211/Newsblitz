import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase, type Article } from '../lib/supabase';
import ArticleCard from '../components/ArticleCard';
import BreakingNewsSlider from '../components/BreakingNewsSlider';
import { Loader2, AlertCircle } from 'lucide-react';

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || 'all';
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      setError(null);
      let query = supabase.from('articles').select('*').order('published_at', { ascending: false });
      if (category !== 'all') query = query.eq('category', category);
      const { data, error: fetchError } = await query;
      if (fetchError) { setError(fetchError.message); } else { setArticles(data || []); }
      setLoading(false);
    }
    fetchArticles();
  }, [category]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-red-700" />
        <span className="ml-3 text-gray-500 dark:text-gray-400">Loading news...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20 text-red-600 dark:text-red-400">
        <AlertCircle size={24} className="mr-2" />
        <span>Failed to load news. Please try again later.</span>
      </div>
    );
  }

  const featured = articles.filter((a) => a.is_featured);
  const breaking = articles.find((a) => a.is_breaking);
  const mainFeatured = featured[0] || breaking || articles[0];
  const sideFeatured = featured.slice(1, 3);
  const rest = articles.filter(
    (a) => a.id !== mainFeatured?.id && !sideFeatured.some((sf) => sf.id === a.id)
  );

  return (
    <>
      <BreakingNewsSlider articles={articles} />
      <div className="max-w-7xl mx-auto px-4 py-6">
        {mainFeatured && (
          <section className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <ArticleCard article={mainFeatured} variant="featured" />
              </div>
              <div className="flex flex-col gap-4">
                {sideFeatured.length > 0
                  ? sideFeatured.map((a) => <ArticleCard key={a.id} article={a} variant="compact" />)
                  : articles.slice(1, 4).map((a) => <ArticleCard key={a.id} article={a} variant="compact" />)
                }
              </div>
            </div>
          </section>
        )}
        {rest.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b-2 border-red-700">Latest News</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((a) => <ArticleCard key={a.id} article={a} />)}
            </div>
          </section>
        )}
        {articles.length === 0 && (
          <div className="text-center py-16 text-gray-400 dark:text-gray-500">
            <p className="text-lg">No news found</p>
          </div>
        )}
      </div>
    </>
  );
}
