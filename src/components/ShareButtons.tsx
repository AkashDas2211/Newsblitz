import { useState } from 'react';
import { Share2, MessageCircle, Copy, Check, Facebook, Twitter } from 'lucide-react';

type ShareButtonsProps = { title: string; summary: string; slug: string; imageUrl: string };

export default function ShareButtons({ title, summary, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const articleUrl = `${baseUrl}/article/${slug}`;

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

  const handleWhatsApp = () => {
    const text = `${title}\n\n${summary}\n\n${articleUrl}`;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = `whatsapp://send?text=${encodeURIComponent(text)}`;
    } else {
      window.open(`https://web.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const handleFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`, '_blank', 'width=600,height=400');
  };

  const handleTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(articleUrl)}`, '_blank', 'width=600,height=400');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: summary,
          url: articleUrl,
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') console.error(err);
      }
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={handleWhatsApp}
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors no-underline"
          title="Share on WhatsApp"
        >
          <MessageCircle size={16} />
          <span className="hidden sm:inline">WhatsApp</span>
        </button>
        <button
          onClick={handleFacebook}
          className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          title="Share on Facebook"
        >
          <Facebook size={16} />
        </button>
        <button
          onClick={handleTwitter}
          className="inline-flex items-center justify-center w-10 h-10 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
          title="Share on X"
        >
          <Twitter size={16} />
        </button>
        <button
          onClick={handleCopy}
          className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg transition-colors"
          title="Copy link"
        >
          {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
        </button>
        <button
          onClick={handleShare}
          className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg transition-colors"
          title="Share"
        >
          <Share2 size={16} />
        </button>
      </div>
      {copied && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap z-10">
          Link copied!
        </div>
      )}
    </div>
  );
}
