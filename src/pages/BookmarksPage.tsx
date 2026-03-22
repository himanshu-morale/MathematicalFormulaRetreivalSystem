import React, { useState, useEffect } from 'react';
import { Formula } from '../types';
import { useAuth } from '../context/AuthContext';
import { FormulaCard } from '../components/FormulaCard';
import { Bookmark, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const BookmarksPage: React.FC = () => {
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const fetchBookmarks = async () => {
    try {
      const res = await fetch('/api/bookmarks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setFormulas(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookmarks(); }, []);

  const removeBookmark = async (id: string) => {
    try {
      await fetch(`/api/bookmarks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormulas(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-2">My Bookmarks</h1>
        <p className="text-slate-500">Your personal collection of saved mathematical formulas.</p>
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
                isBookmarked={true}
                onToggleBookmark={removeBookmark}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && formulas.length === 0 && (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
          <div className="inline-flex p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
            <Bookmark className="text-slate-400" size={32} />
          </div>
          <h3 className="text-lg font-bold">No bookmarks yet</h3>
          <p className="text-slate-500">Start exploring and save formulas you use frequently.</p>
        </div>
      )}
    </div>
  );
};
