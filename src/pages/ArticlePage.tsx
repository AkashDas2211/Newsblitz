import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase, type Article } from '../lib/supabase';
import ShareButtons from '../components/ShareButtons';
import ArticleCard from '../components/ArticleCard';
import { Clock, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

function formatTimeAgo(dateStr: string) {
  const diffMins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function updateMetaTag(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!el) { el = document.createElement('meta'); el.setAttribute('property', property); document.head.appendChild(el); }
  el.setAttribute('content', content);
}

function updateMetaName(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); document.head.appendChild(el); }
  el.setAttribute('content', content);
}

function updateOGTags(article: Article) {
  document.title = `${article.title} - News Blitzz`;
  updateMetaTag('og:title', article.title);
  updateMetaTag('og:description', article.summary);
  updateMetaTag('og:image', article.image_url);
  updateMetaTag('og:url', `${window.location.origin}/article/${article.slug}`);
  updateMetaTag('og:type', 'article');
  updateMetaTag('og:site_name', 'News Blitzz');
  updateMetaName('twitter:card', 'summary_large_image');
  updateMetaName('twitter:title', article.title);
  updateMetaName('twitter:description', article.summary);
  updateMetaName('twitter:image', article.image_url);
}

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticle() {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase.from('articles').select('*').eq('slug', slug || '').maybeSingle();
      if (fetchError) { setError(fetchError.message); }
      else if (!data) { setError('Article not found'); }
      else {
        setArticle(data);
        updateOGTags(data);
        const { data: relatedData } = await supabase.from('articles').select('*').eq('category', data.category).neq('id', data.id).order('published_at', { ascending: false }).limit(4);
        setRelated(relatedData || []);
      }
      setLoading(false);
    }
    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-red-700" />
        <span className="ml-3 text-gray-500 dark:text-gray-400">Loading article...</span>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <AlertCircle size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">{error || 'Article not found'}</h2>
        <Link to="/" className="inline-flex items-center gap-2 text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 mt-4 no-underline font-medium">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
        <Link to="/" className="hover:text-red-700 dark:hover:text-red-400 no-underline text-gray-500 dark:text-gray-400">Home</Link>
        <span>/</span>
        <Link to={`/?category=${article.category}`} className="hover:text-red-700 dark:hover:text-red-400 no-underline text-gray-500 dark:text-gray-400">{getCategoryLabel(article.category)}</Link>
        <span>/</span>
        <span className="text-gray-400 dark:text-gray-500 truncate max-w-[200px]">{article.title}</span>
      </nav>

      <header className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2.5 py-1 rounded">{getCategoryLabel(article.category)}</span>
          {article.is_breaking && <span className="text-xs font-bold text-white bg-red-600 px-2.5 py-1 rounded">BREAKING</span>}
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-3">{article.title}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{article.summary}</p>
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium text-gray-700 dark:text-gray-200">{article.author}</span>
            <span className="flex items-center gap-1"><Clock size={14} />{formatDate(article.published_at)}</span>
            <span>{formatTimeAgo(article.published_at)}</span>
          </div>
          <ShareButtons title={article.title} summary={article.summary} slug={article.slug} imageUrl={article.image_url} />
        </div>
      </header>

      <figure className="mb-8">
        <img src={article.image_url} alt={article.title} className="w-full rounded-xl object-cover max-h-[500px]" />
      </figure>

      <div
        className="prose prose-lg max-w-none mb-8 prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:font-semibold prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-red-700 dark:prose-a:text-red-400 prose-a:no-underline hover:prose-a:underline"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-8">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">Share this article:</p>
        <ShareButtons title={article.title} summary={article.summary} slug={article.slug} imageUrl={article.image_url} />
      </div>

      {related.length > 0 && (
        <section className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b-2 border-red-700">Related News</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {related.map((a) => <ArticleCard key={a.id} article={a} />)}
          </div>
        </section>
      )}
    </article>
  );
}
