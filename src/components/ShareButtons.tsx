import { useState } from 'react';
import { Share2, MessageCircle, Copy, Check, Facebook, Twitter } from 'lucide-react';

type ShareButtonsProps = { title: string; summary: string; slug: string; imageUrl: string };
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export default function ShareButtons({ title, summary, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const baseUrl = window.location.origin;
  const articleUrl = `${baseUrl}/article/${slug}`;
  const ogProxyUrl = `${SUPABASE_URL}/functions/v1/og-proxy?slug=${encodeURIComponent(slug)}&site_url=${encodeURIComponent(baseUrl)}`;

  const encodedArticleUrl = encodeURIComponent(articleUrl);
  const encodedOgProxyUrl = encodeURIComponent(ogProxyUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedSummary = encodeURIComponent(summary);

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedTitle}%0A%0A${encodedSummary}%0A%0A${encodedOgProxyUrl}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedOgProxyUrl}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedArticleUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = articleUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title, text: summary, url: articleUrl }); } catch { /* cancelled */ }
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors no-underline">
          <MessageCircle size={16} /><span className="hidden sm:inline">WhatsApp</span>
        </a>
        <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors" title="Share on Facebook">
          <Facebook size={16} />
        </a>
        <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-10 h-10 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors" title="Share on X">
          <Twitter size={16} />
        </a>
        <button onClick={handleCopy} className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg transition-colors" title="Copy link">
          {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
        </button>
        <button onClick={handleShare} className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg transition-colors" title="Share">
          <Share2 size={16} />
        </button>
      </div>
      {copied && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap">
          Link copied!
        </div>
      )}
    </div>
  );
}
