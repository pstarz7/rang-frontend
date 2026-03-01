import React, { useState } from 'react';
import { X, FolderPlus, Zap, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ProjectModal = ({ isOpen, onClose, onProjectCreated }) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;

    try {
      setLoading(true);
      const res = await fetch('https://rang-server.onrender.com/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ name, description })
      });

      if (res.ok) {
        const newProject = await res.json();
        onProjectCreated(newProject);
        setName('');
        setDescription('');
        onClose();
      }
    } catch (err) {
      console.error("Project creation failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/20 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl border border-black/5 relative overflow-hidden">
        
        {/* Subtle Brand Background */}
        <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
            <FolderPlus size={120} />
        </div>

        <header className="flex justify-between items-center mb-10 relative z-10">
          <div className="space-y-1">
             <h3 className="text-xl font-black uppercase italic tracking-tighter">New Project.</h3>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Organize your system architecture</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-all"><X size={20} /></button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Folder Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g. School Dashboard"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-transparent rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:bg-white focus:border-black transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Brief Description</label>
            <textarea 
              placeholder="What is this project for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-transparent rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:bg-white focus:border-black transition-all h-24 resize-none"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 bg-black text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? "Syncing..." : "Initialize Project"} <ChevronRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;