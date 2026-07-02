import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, type Article, CATEGORIES } from '../lib/supabase';
import { ArrowLeft, Plus, Trash2, CreditCard as Edit3, Loader2, AlertCircle, Save, X, LogOut } from 'lucide-react';

type FormData = {
  title: string; slug: string; summary: string; content: string;
  image_url: string; category: string; author: string;
  is_breaking: boolean; is_featured: boolean;
};

const emptyForm: FormData = {
  title: '', slug: '', summary: '', content: '',
  image_url: '', category: 'general', author: 'News Blitzz',
  is_breaking: false, is_featured: false,
};

export default function AdminPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/admin/login'); return; }
      setAuthChecked(true);
      fetchArticles();
    }
    checkAuth();
  }, [navigate]);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/admin/login');
  }

  async function fetchArticles() {
    setLoading(true);
    const { data, error } = await supabase.from('articles').select('*').order('published_at', { ascending: false });
    if (!error) setArticles(data || []);
    setLoading(false);
  }

  function generateSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || `article-${Date.now()}`;
  }

  function handleTitleChange(title: string) {
    setForm((prev) => ({ ...prev, title, slug: generateSlug(title) }));
  }

  async function handleSave() {
    setSaving(true); setError(null); setSuccess(null);
    if (!form.title || !form.slug) { setError('Title and slug are required'); setSaving(false); return; }
    try {
      if (editingId) {
        const { error: updateError } = await supabase.from('articles').update(form).eq('id', editingId);
        if (updateError) throw updateError;
        setSuccess('Article updated successfully');
      } else {
        const { error: insertError } = await supabase.from('articles').insert([form]);
        if (insertError) throw insertError;
        setSuccess('New article added successfully');
      }
      setForm(emptyForm); setEditingId(null); setShowForm(false); fetchArticles();
    } catch (err: any) { setError(err.message || 'Failed to save article'); }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this article?')) return;
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (!error) fetchArticles();
  }

  function handleEdit(article: Article) {
    setEditingId(article.id);
    setForm({
      title: article.title, slug: article.slug, summary: article.summary,
      content: article.content, image_url: article.image_url, category: article.category,
      author: article.author, is_breaking: article.is_breaking, is_featured: article.is_featured,
    });
    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false); setEditingId(null); setForm(emptyForm); setError(null); setSuccess(null);
  }

  if (!authChecked) {
    return <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-red-700" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors no-underline">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}
            className="inline-flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
            <Plus size={16} /> New Article
          </button>
          <button onClick={handleLogout}
            className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
            title="Logout">
            <LogOut size={16} /><span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">
          <AlertCircle size={16} />{error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg mb-4 text-sm">{success}</div>
      )}

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{editingId ? 'Edit Article' : 'Add New Article'}</h2>
            <button onClick={handleCancel} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"><X size={18} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
              <input type="text" value={form.title} onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm"
                placeholder="Article title" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug *</label>
              <input type="text" value={form.slug} onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm"
                placeholder="article-slug" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm">
                {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                <option value="general">General</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Summary</label>
              <textarea value={form.summary} onChange={(e) => setForm((prev) => ({ ...prev, summary: e.target.value }))} rows={2}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm resize-none"
                placeholder="Brief description" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content (HTML)</label>
              <textarea value={form.content} onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))} rows={6}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm resize-none font-mono"
                placeholder="<p>Article content here</p>" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
              <input type="text" value={form.image_url} onChange={(e) => setForm((prev) => ({ ...prev, image_url: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm"
                placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Author</label>
              <input type="text" value={form.author} onChange={(e) => setForm((prev) => ({ ...prev, author: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm"
                placeholder="Author name" />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_breaking} onChange={(e) => setForm((prev) => ({ ...prev, is_breaking: e.target.checked }))}
                  className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Breaking News</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm((prev) => ({ ...prev, is_featured: e.target.checked }))}
                  className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Featured</span>
              </label>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-5">
            <button onClick={handleSave} disabled={saving}
              className="inline-flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {editingId ? 'Update' : 'Save'}
            </button>
            <button onClick={handleCancel} className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 size={24} className="animate-spin text-red-700" /></div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Title</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-300 hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-300 hidden sm:table-cell">Author</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Status</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 dark:text-white line-clamp-1">{article.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5">/{article.slug}</div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-600 dark:text-gray-300">{article.category}</td>
                    <td className="px-4 py-3 hidden sm:table-cell text-gray-600 dark:text-gray-300">{article.author}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {article.is_breaking && <span className="text-[10px] font-bold bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 px-1.5 py-0.5 rounded">BREAKING</span>}
                        {article.is_featured && <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded">FEATURED</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => handleEdit(article)} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors" title="Edit"><Edit3 size={14} /></button>
                        <button onClick={() => handleDelete(article.id)} className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors" title="Delete"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {articles.length === 0 && <div className="text-center py-8 text-gray-400 dark:text-gray-500">No articles found</div>}
        </div>
      )}
    </div>
  );
}
