import React from 'react';
import { Formula } from '../types';
import { InlineMath, BlockMath } from 'react-katex';
import { Bookmark, BookmarkCheck, Trash2, Edit, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

interface FormulaCardProps {
  formula: Formula;
  isBookmarked?: boolean;
  onToggleBookmark?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (formula: Formula) => void;
}

export const FormulaCard: React.FC<FormulaCardProps> = ({ 
  formula, 
  isBookmarked, 
  onToggleBookmark,
  onDelete,
  onEdit
}) => {
  const { isAdmin, isAuthenticated } = useAuth();

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6 rounded-2xl flex flex-col gap-4 group hover:shadow-lg transition-all duration-300"
    >
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-md">
            {formula.category}
          </span>
          <h3 className="text-xl font-bold mt-2 text-slate-800 dark:text-slate-100">{formula.name}</h3>
        </div>
        
        <div className="flex gap-2">
          {isAuthenticated && onToggleBookmark && (
            <button 
              onClick={() => onToggleBookmark(formula.id)}
              className={`p-2 rounded-full transition-colors ${
                isBookmarked 
                  ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' 
                  : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {isBookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
            </button>
          )}
          {isAdmin && (
            <>
              <button 
                onClick={() => onEdit?.(formula)}
                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full transition-colors"
              >
                <Edit size={18} />
              </button>
              <button 
                onClick={() => onDelete?.(formula.id)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
        {formula.description}
      </p>

      <div className="my-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-center overflow-x-auto">
        <BlockMath math={formula.latex} />
      </div>

      <div className="mt-auto">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-500 mb-2">
          <ExternalLink size={14} />
          Example Usage
        </div>
        <p className="text-xs italic text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-800/30 p-2 rounded-lg">
          {formula.example}
        </p>
      </div>
    </motion.div>
  );
};
