import React, { useState, useEffect } from 'react';
import { X, Folder, Globe, Lock, ChevronDown, Plus, Check, FolderPlus, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SaveModal = ({ isOpen, onClose, paletteColors, onSaveSuccess }) => {
  const { user } = useAuth();
  
  const [name, setName] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // Quick Project States
  const [showQuickProject, setShowQuickProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [creatingProject, setCreatingProject] = useState(false);

  // Fetch Projects when modal opens
  const fetchProjects = async () => {
    if (!user?.token) return;
    try {
      const res = await fetch('https://rang-server.onrender.com/api/projects', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (res.ok) setProjects(data);
    } catch (err) {
      console.error("Failed to load projects", err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProjects();
      setName(''); // Reset on open
    }
  }, [isOpen, user]);

  // ---  QUICK CREATE & SELECT ---
  const handleQuickProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    
    try {
      setCreatingProject(true);
      const res = await fetch('https://rang-server.onrender.com/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ name: newProjectName })
      });
      const data = await res.json();
      
      if (res.ok) {
        // Update local list
        setProjects(prev => [data, ...prev]);
        // CRITICAL FIX: Set the newly created Project ID as selected
        setSelectedProject(data._id);
        setNewProjectName('');
        setShowQuickProject(false);
      }
    } catch (err) {
      console.error("Quick project creation failed", err);
    } finally {
      setCreatingProject(false);
    }
  };

  // --- FINAL SAVE PALETTE ---
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('https://rang-server.onrender.com/api/palettes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          name: name || "Untitled Palette",
          colors: paletteColors,
          project: selectedProject || null, // Uses the newly created ID here
          isPublic
        })
      });

      if (res.ok) {
        onSaveSuccess();
        onClose();
      }
    } catch (err) {
      console.error("Save process failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 md:p-6 bg-black/20 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[45px] p-8 md:p-12 shadow-2xl border border-black/5 relative overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar">
        
        <header className="flex justify-between items-center mb-8 relative z-10">
          <div className="space-y-1">
            <h3 className="text-xl font-black uppercase italic tracking-tighter">Commit Asset.</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Finalize architecture to library</p>
          </div>
          <button onClick={onClose} type="button" className="p-2 hover:bg-slate-50 rounded-full transition-all"><X size={20}/></button>
        </header>

        <form onSubmit={handleSave} className="space-y-6 relative z-10">
          {/* Palette Visualization */}
          <div className="flex h-20 w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white mb-8">
            {paletteColors.map((hex, i) => (
              <div key={i} className="flex-1" style={{ backgroundColor: hex }} />
            ))}
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-4">System Identity</label>
            <input 
              type="text" 
              placeholder="Enter palette name..."
              className="w-full bg-slate-50 border border-transparent rounded-[24px] py-4 px-6 text-sm font-bold outline-none focus:bg-white focus:border-black transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Project Management Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-4">
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Folder</label>
               <button 
                type="button"
                onClick={() => setShowQuickProject(!showQuickProject)}
                className="text-[9px] font-black uppercase text-blue-500 hover:underline"
               >
                 {showQuickProject ? 'Cancel' : 'New Project?'}
               </button>
            </div>
            
            {!showQuickProject ? (
              <div className="relative">
                <Folder className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <select 
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full bg-slate-50 border border-transparent rounded-[24px] py-4 pl-14 pr-10 text-xs font-bold appearance-none outline-none focus:bg-white focus:border-black transition-all cursor-pointer"
                >
                  <option value="">Uncategorized</option>
                  {projects.map(p => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
              </div>
            ) : (
              <div className="flex gap-2 animate-in zoom-in-95 duration-200">
                <input 
                  type="text" 
                  placeholder="Create folder..."
                  className="flex-1 bg-blue-50/50 border border-blue-100 rounded-[20px] py-4 px-6 text-xs font-bold outline-none focus:border-blue-500"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  autoFocus
                />
                <button 
                  type="button"
                  onClick={handleQuickProject}
                  disabled={creatingProject}
                  className="px-6 bg-blue-500 text-white rounded-[20px] hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center"
                >
                  {creatingProject ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={18} />}
                </button>
              </div>
            )}
          </div>

          {/* Privacy Suite */}
          <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px] border border-black/5">
            <div className="flex items-center gap-4">
               <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isPublic ? 'bg-blue-50 text-blue-500' : 'bg-slate-200 text-slate-500'}`}>
                  {isPublic ? <Globe size={20} /> : <Lock size={20} />}
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest">Visibility</p>
                  <p className="text-[9px] font-bold text-slate-400 italic leading-none mt-1">{isPublic ? 'Community Feed' : 'Private Storage'}</p>
               </div>
            </div>
            <button 
              type="button"
              onClick={() => setIsPublic(!isPublic)}
              className={`w-12 h-6 rounded-full transition-all relative ${isPublic ? 'bg-black' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${isPublic ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 bg-black text-white rounded-[28px] text-[11px] font-black uppercase tracking-widest shadow-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all group mt-4 disabled:opacity-50"
          >
            {loading ? "Synchronizing..." : "Sync to Library"} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SaveModal;