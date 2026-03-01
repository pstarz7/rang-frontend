import React, { useState, useEffect, useMemo } from 'react';
import { 
  Folder, Palette, Plus, Trash2, Search, ExternalLink, 
  ChevronRight, Menu, X, AlertCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useColor } from '../context/ColorContext';
import { useNavigate } from 'react-router-dom';
import ProjectModal from '../components/Modals/ProjectModal';

const Library = () => {
  const { user } = useAuth();
  const { setColors } = useColor();
  const navigate = useNavigate();

  const [palettes, setPalettes] = useState([]);
  const [projects, setProjects] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Custom Alert State
  const [deleteTarget, setDeleteTarget] = useState({ type: null, id: null, name: '' });

  const fetchData = async () => {
    try {
      setLoading(true);
      const headers = { 'Authorization': `Bearer ${user.token}` };
      const [resPalettes, resProjects] = await Promise.all([
        fetch('https://rang-server.onrender.com/api/palettes', { headers }),
        fetch('https://rang-server.onrender.com/api/projects', { headers })
      ]);

      const palettesData = await resPalettes.json();
      const projectsData = await resProjects.json();

      if (resPalettes.ok) setPalettes(palettesData);
      if (resProjects.ok) setProjects(projectsData);
    } catch (err) {
      console.error("Library sync failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user) fetchData(); }, [user]);

  const projectNav = useMemo(() => {
    const list = [{ _id: 'all', name: 'All Assets', colorCount: palettes.length }];
    const dbProjects = projects.map(proj => ({
      _id: proj._id,
      name: proj.name,
      colorCount: palettes.filter(p => p.project?._id === proj._id).length
    }));
    return [...list, ...dbProjects];
  }, [palettes, projects]);

  const filteredPalettes = useMemo(() => {
    return palettes.filter(p => {
      const matchesProject = selectedProjectId === 'all' || p.project?._id === selectedProjectId;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesProject && matchesSearch;
    });
  }, [palettes, selectedProjectId, searchQuery]);

  const executeDelete = async () => {
    const { type, id } = deleteTarget;
    const endpoint = type === 'palette' ? `palettes/${id}` : `projects/${id}`;
    try {
      const res = await fetch(`https://rang-server.onrender.com/api/${endpoint}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) {
        if (type === 'project' && selectedProjectId === id) setSelectedProjectId('all');
        fetchData();
        setDeleteTarget({ type: null, id: null, name: '' });
      }
    } catch (err) { console.error(err); }
  };

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-white" aria-busy="true">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-black rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Synchronizing Studio</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFF] flex flex-col lg:flex-row font-sans selection:bg-black selection:text-white relative">
      
      {/* 1. MODAL OVERLAYS (HIGHEST Z-INDEX) */}
      <ProjectModal 
        isOpen={isProjectModalOpen} 
        onClose={() => setIsProjectModalOpen(false)} 
        onProjectCreated={() => { fetchData(); setIsProjectModalOpen(false); }} 
      />

      {/* 2. MOBILE TOGGLE HUB (ADAPTED FOR NAVBAR) */}
      <div className="lg:hidden fixed bottom-6 left-6 z-[400] flex flex-col gap-3">
         <button 
           onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
           aria-label="Toggle Directory"
           className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-all"
         >
           {isSidebarOpen ? <X size={24}/> : <Menu size={24}/>}
         </button>
      </div>

      {/* 3. SIDEBAR: PROJECT EXPLORER */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-[350] lg:z-40
        h-screen w-[85vw] lg:w-80 bg-white border-r border-slate-100 p-8 pt-32
        transition-transform duration-500 ease-out
        ${isSidebarOpen ? 'translate-x-0 shadow-[0_0_100px_rgba(0,0,0,0.1)]' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between mb-12 px-2">
           <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 italic">Project Hierarchy</h2>
        </div>
        
        <nav className="space-y-2 overflow-y-auto h-[calc(100vh-250px)] no-scrollbar pb-20">
          {projectNav.map(proj => (
            <div key={proj._id} className="group relative">
                <button
                onClick={() => { setSelectedProjectId(proj._id); setIsSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-6 py-4 rounded-[25px] transition-all duration-500 ${
                    selectedProjectId === proj._id ? 'bg-black text-white shadow-xl scale-[1.02]' : 'hover:bg-slate-50 text-slate-400'
                }`}
                >
                <div className="flex items-center gap-4">
                    <Folder size={16} fill={selectedProjectId === proj._id ? "white" : "none"} />
                    <span className="text-[11px] font-black uppercase tracking-widest truncate max-w-[110px]">{proj.name}</span>
                </div>
                <ChevronRight size={14} className={`${selectedProjectId === proj._id ? 'rotate-90' : 'opacity-0 group-hover:opacity-100'}`} />
                </button>
                
                {proj._id !== 'all' && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); setDeleteTarget({ type: 'folder', id: proj._id, name: proj.name }); }}
                        aria-label={`Delete ${proj.name} folder`}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-red-500 opacity-0 group-hover:opacity-100 hover:scale-110 transition-all"
                    >
                        <Trash2 size={14} />
                    </button>
                )}
            </div>
          ))}
        </nav>

        {/* DESKTOP CREATE FOLDER TARGET FIX */}
        <div className="hidden lg:block absolute bottom-10 left-8 right-8">
            <button 
              onClick={() => setIsProjectModalOpen(true)}
              className="w-full py-5 bg-slate-50 hover:bg-black hover:text-white border border-slate-100 rounded-[25px] flex items-center justify-center gap-3 transition-all active:scale-95 group shadow-sm"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">New Folder</span>
            </button>
        </div>
      </aside>

      {/* 4. MAIN PRODUCTION AREA */}
      <main className="flex-1 p-6 md:p-12 lg:p-20 pt-32 lg:pt-32 space-y-16">
        <header className="flex flex-col md:flex-row gap-10 justify-between items-start md:items-center">
          <div className="space-y-4">
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-black rounded-full animate-ping" aria-hidden="true" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-300 italic">Production Scope</span>
             </div>
             <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none text-black">
               {projectNav.find(p => p._id === selectedProjectId)?.name}.
             </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text"
                aria-label="Search palettes"
                placeholder="Search pixels..."
                className="w-full sm:w-72 pl-16 pr-6 py-5 bg-white border border-slate-100 rounded-[28px] outline-none text-[11px] font-black uppercase tracking-widest focus:shadow-2xl transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button onClick={() => navigate('/generate')} className="px-10 py-5 bg-black text-white rounded-[28px] text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-2xl">
              <Plus size={18} /> <span className="hidden sm:inline">Create Asset</span>
            </button>
          </div>
        </header>

        {/* CONTENT GRID */}
        {filteredPalettes.length === 0 ? (
          <div className="py-40 flex flex-col items-center justify-center text-center opacity-20 border-2 border-dashed border-slate-100 rounded-[80px]">
            <Palette size={64} strokeWidth={1} className="mb-6" />
            <p className="text-[12px] font-black uppercase tracking-[0.6em]">Zero Architectures</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-12 pb-32">
            {filteredPalettes.map(palette => (
              <div key={palette._id} className="group bg-white p-6 rounded-[55px] border border-slate-100 hover:shadow-[0_60px_100px_rgba(0,0,0,0.06)] transition-all duration-700">
                <div className="h-56 flex rounded-[40px] overflow-hidden mb-8 relative shadow-inner">
                  {palette.colors.map((c, i) => (
                    <div key={i} className="flex-1 transition-all duration-700 group-hover:flex-[1.8]" style={{ backgroundColor: c }} />
                  ))}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
                    <button 
                      onClick={() => { setColors(palette.colors.map(hex => ({ hex, locked: false }))); navigate('/generate'); }}
                      aria-label={`Open ${palette.name} in generator`}
                      className="p-6 bg-white rounded-full shadow-2xl hover:scale-110 active:scale-90 transition-all text-black"
                    >
                      <ExternalLink size={24} />
                    </button>
                  </div>
                </div>
                <div className="px-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1 overflow-hidden">
                        <h4 className="text-xl font-black uppercase tracking-tight italic text-black truncate leading-none">{palette.name}</h4>
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{palette.colors.length} Color Spectrum</p>
                    </div>
                    <button 
                      onClick={() => setDeleteTarget({ type: 'palette', id: palette._id, name: palette.name })}
                      aria-label="Delete Palette"
                      className="p-3 bg-slate-50 text-slate-300 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 5. MOBILE FLOATING ACTION (Z-INDEX 400) */}
      <div className="lg:hidden fixed bottom-6 right-6 z-[400]">
          <button 
            onClick={() => setIsProjectModalOpen(true)}
            aria-label="Create New Folder"
            className="w-16 h-16 bg-black text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-all"
          >
              <Plus size={32} />
          </button>
      </div>

      {/* 6. A11Y DELETE MODAL (UPDATED) */}
      {deleteTarget.id && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6" role="alertdialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-500" onClick={() => setDeleteTarget({ type: null, id: null, name: '' })} />
            <div className="bg-white w-full max-w-md rounded-[50px] p-10 relative z-10 shadow-2xl animate-in zoom-in-95 duration-500 text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-[25px] flex items-center justify-center mb-8 mx-auto">
                    <AlertCircle size={32} />
                </div>
                <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4">Delete?</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-relaxed mb-10">
                    Confirm deletion of <span className="text-black">"{deleteTarget.name}"</span>. This action is final.
                </p>
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setDeleteTarget({ type: null, id: null, name: '' })} className="py-5 bg-slate-50 text-slate-500 rounded-[25px] text-[10px] font-black uppercase tracking-[0.3em] active:scale-95 transition-all">No</button>
                    <button onClick={executeDelete} className="py-5 bg-black text-white rounded-[25px] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-600 active:scale-95 transition-all shadow-lg">Confirm</button>
                </div>
            </div>
        </div>
      )}

      {/* MOBILE BACKDROP */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[250] lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  );
};

export default Library;