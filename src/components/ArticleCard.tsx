import { Link } from 'react-router-dom';
import type { Article } from '../lib/supabase';
import { Clock, Zap } from 'lucide-react';

function formatTimeAgo(dateStr: string) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hr ago`;
  return `${diffDays}d ago`;
}

function getCategoryLabel(category: string) {
  const catMap: Record<string, string> = {
    economics: 'Economy', sports: 'Sports', politics: 'Politics',
    technology: 'Technology', education: 'Education', environment: 'Environment',
    infrastructure: 'Infrastructure', travel: 'Travel', general: 'General',
  };
  return catMap[category] || category;
}

export default function ArticleCard({ article, variant = 'default' }: { article: Article; variant?: 'default' | 'featured' | 'compact' }) {
  if (variant === 'featured') {
    return (
      <Link to={`/article/${article.slug}`} className="group block relative rounded-xl overflow-hidden no-underline">
        <div className="aspect-[16/9] md:aspect-[21/9] overflow-hidden">
          <img src={article.image_url} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
          {article.is_breaking && (
            <span className="inline-flex items-center gap-1 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-md mb-2.5">
              <Zap size={11} /> BREAKING
            </span>
          )}
          <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-md mb-2.5 ml-2">
            {getCategoryLabel(article.category)}
          </span>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white leading-snug mb-2 group-hover:text-red-200 transition-colors">
            {article.title}
          </h2>
          <p className="text-gray-200 text-sm md:text-base line-clamp-2">{article.summary}</p>
          <div className="flex items-center gap-3 mt-3 text-gray-300 text-xs">
            <span>{article.author}</span>
            <span className="flex items-center gap-1"><Clock size={12} />{formatTimeAgo(article.published_at)}</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link to={`/article/${article.slug}`} className="group flex gap-3 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0 no-underline">
        <div className="w-24 h-20 flex-shrink-0 rounded-lg overflow-hidden">
          <img src={article.image_url} alt={article.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors">
            {article.title}
          </h3>
          <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
            <span>{getCategoryLabel(article.category)}</span>
            <span className="flex items-center gap-1"><Clock size={10} />{formatTimeAgo(article.published_at)}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/article/${article.slug}`} className="group block bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-300 no-underline">
      <div className="aspect-[16/10] overflow-hidden">
        <img src={article.image_url} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {article.is_breaking && (
            <span className="inline-flex items-center gap-1 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
              <Zap size={9} /> BREAKING
            </span>
          )}
          <span className="text-xs font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded">
            {getCategoryLabel(article.category)}
          </span>
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white leading-snug line-clamp-2 mb-2 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors">
          {article.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{article.summary}</p>
        <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
          <span>{article.author}</span>
          <span className="flex items-center gap-1"><Clock size={11} />{formatTimeAgo(article.published_at)}</span>
        </div>
      </div>
    </Link>
  );
}
