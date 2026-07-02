import { Link } from 'react-router-dom';
import { CATEGORIES } from '../lib/supabase';

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 mt-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 bg-red-700 dark:bg-red-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-base">N</span>
              </div>
              <h3 className="text-lg font-bold text-white">News Blitzz</h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Stay updated with the latest news from India and the world.
              Delivering truth and unbiased reporting is our mission.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Categories</h4>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                <Link key={cat.id} to={`/?category=${cat.id}`} className="text-sm text-gray-400 hover:text-white transition-colors no-underline">
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>New Delhi, India</p>
              <p>contact@newsblitzz.com</p>
              <p>+91 1700-000000</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} News Blitzz. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
