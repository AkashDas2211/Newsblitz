import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { Article } from '../lib/supabase';
import { Zap } from 'lucide-react';

export default function BreakingNewsSlider({ articles }: { articles: Article[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const breakingArticles = articles.filter((a) => a.is_breaking);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || breakingArticles.length === 0) return;

    let animId: number;
    let speed = 1;

    function scroll() {
      if (!container) return;
      container.scrollLeft += speed;
      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft = 0;
      }
      animId = requestAnimationFrame(scroll);
    }

    animId = requestAnimationFrame(scroll);

    const pause = () => cancelAnimationFrame(animId);
    const resume = () => { animId = requestAnimationFrame(scroll); };

    container.addEventListener('mouseenter', pause);
    container.addEventListener('mouseleave', resume);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mouseenter', pause);
      container.removeEventListener('mouseleave', resume);
    };
  }, [breakingArticles.length]);

  if (breakingArticles.length === 0) return null;

  const items = [...breakingArticles, ...breakingArticles];

  return (
    <div className="bg-red-700 dark:bg-red-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center h-9">
        <div className="flex items-center gap-1.5 flex-shrink-0 px-4 border-r border-red-600 h-full">
          <Zap size={13} className="text-yellow-300 animate-pulse" />
          <span className="text-[11px] font-bold tracking-wider uppercase">BREAKING</span>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-hidden whitespace-nowrap">
          <div className="inline-flex items-center gap-8">
            {items.map((article, i) => (
              <Link
                key={`${article.id}-${i}`}
                to={`/article/${article.slug}`}
                className="text-sm font-medium text-white hover:text-yellow-200 transition-colors no-underline inline-block"
              >
                {article.title}
                <span className="mx-6 text-red-400">|</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
