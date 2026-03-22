import React, { useState, useEffect } from 'react';
import { Formula } from '../types';
import { Search, Filter, History, Sparkles } from 'lucide-react';
import { FormulaCard } from '../components/FormulaCard';
import { CATEGORIES } from '../constants';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { token, isAuthenticated } = useAuth();

  const fetchFormulas = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/formulas?q=${query}&category=${category}`);
      const data = await res.json();
      setFormulas(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await fetch('/api/bookmarks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setBookmarks(data.map((f: Formula) => f.id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFormulas();
    fetchBookmarks();
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, [category, isAuthenticated]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFormulas();
    if (query && !history.includes(query)) {
      const newHistory = [query, ...history].slice(0, 5);
      setHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    }
  };

  const toggleBookmark = async (id: string) => {
    const isBookmarked = bookmarks.includes(id);
    try {
      const method = isBookmarked ? 'DELETE' : 'POST';
      await fetch(`/api/bookmarks/${id}`, {
        method,
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookmarks(prev => 
        isBookmarked ? prev.filter(bid => bid !== id) : [...prev, id]
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black tracking-tight mb-4"
        >
          Find Any <span className="text-indigo-600">Formula</span>
        </motion.h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Intelligent mathematical formula retrieval system. Search by keywords, categories, or expressions.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mb-12">
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
            <Search size={20} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search e.g., 'quadratic', 'integration', 'area'..."
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          />
          <button 
            type="submit"
            className="absolute right-2 top-2 bottom-2 px-6 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          <button
            onClick={() => setCategory('')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              category === '' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300'
            }`}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                category === cat 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {history.length > 0 && (
          <div className="mt-6 flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <History size={14} />
              Recent:
            </div>
            <div className="flex gap-2">
              {history.map((h, i) => (
                <button 
                  key={i} 
                  onClick={() => { setQuery(h); fetchFormulas(); }}
                  className="hover:text-indigo-600 underline underline-offset-2"
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {formulas.map((f) => (
              <FormulaCard 
                key={f.id} 
                formula={f} 
                isBookmarked={bookmarks.includes(f.id)}
                onToggleBookmark={toggleBookmark}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && formulas.length === 0 && (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
          <div className="inline-flex p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
            <Sparkles className="text-slate-400" size={32} />
          </div>
          <h3 className="text-lg font-bold">No formulas found</h3>
          <p className="text-slate-500">Try adjusting your search or category filter.</p>
        </div>
      )}
    </div>
  );
};
