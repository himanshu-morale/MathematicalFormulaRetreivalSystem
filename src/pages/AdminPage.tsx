import React, { useState, useEffect } from 'react';
import { Formula } from '../types';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../constants';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminPage: React.FC = () => {
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFormula, setEditingFormula] = useState<Formula | null>(null);
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    category: CATEGORIES[0],
    description: '',
    latex: '',
    example: ''
  });

  const fetchAll = async () => {
    const res = await fetch('/api/formulas');
    const data = await res.json();
    setFormulas(data);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingFormula ? 'PUT' : 'POST';
    const url = editingFormula ? `/api/formulas/${editingFormula.id}` : '/api/formulas';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingFormula(null);
        setFormData({ name: '', category: CATEGORIES[0], description: '', latex: '', example: '' });
        fetchAll();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this formula?')) return;
    await fetch(`/api/formulas/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchAll();
  };

  const openEdit = (f: Formula) => {
    setEditingFormula(f);
    setFormData({
      name: f.name,
      category: f.category,
      description: f.description,
      latex: f.latex,
      example: f.example
    });
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Formula Management</h1>
          <p className="text-slate-500">Add, edit or remove mathematical formulas from the system.</p>
        </div>
        <button 
          onClick={() => { setEditingFormula(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all"
        >
          <Plus size={20} />
          Add Formula
        </button>
      </div>

      <div className="glass rounded-3xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
              <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500">Name</th>
              <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500">Category</th>
              <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500">LaTeX</th>
              <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {formulas.map(f => (
              <tr key={f.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="p-4 font-medium">{f.name}</td>
                <td className="p-4">
                  <span className="text-[10px] font-bold uppercase px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md">
                    {f.category}
                  </span>
                </td>
                <td className="p-4 font-mono text-xs text-slate-500 truncate max-w-[200px]">{f.latex}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(f)} className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(f.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative glass w-full max-w-2xl p-8 rounded-3xl shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{editingFormula ? 'Edit Formula' : 'Add New Formula'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1 ml-1">Name</label>
                    <input 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1 ml-1">Category</label>
                    <select 
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1 ml-1">Description</label>
                  <textarea 
                    required
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 h-24"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1 ml-1">LaTeX Representation</label>
                  <input 
                    required
                    value={formData.latex}
                    onChange={e => setFormData({...formData, latex: e.target.value})}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    placeholder="e.g. a^2 + b^2 = c^2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1 ml-1">Example Usage</label>
                  <input 
                    required
                    value={formData.example}
                    onChange={e => setFormData({...formData, example: e.target.value})}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 border border-slate-200 dark:border-slate-800 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Check size={20} />
                    {editingFormula ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
