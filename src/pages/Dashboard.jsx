import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Palette,
  Heart,
  Settings,
  Plus,
  Zap,
  User as UserIcon,
  ExternalLink,
  Eye,
  ArrowRight,
  Folder,
  Layout,
  Mail
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useColor } from '../context/ColorContext';
import Visualizer from '../components/Visualizer/Visualizer';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { setColors } = useColor();
  const navigate = useNavigate();

  const [myPalettes, setMyPalettes] = useState([]);
  const [likedPalettes, setLikedPalettes] = useState([]);
  const [projects, setProjects] = useState([]); 
  const [dataLoading, setDataLoading] = useState(true);
  const [showVisualizer, setShowVisualizer] = useState(false);

  // --- THE DATA ENGINE (RENDER URL) ---
  const fetchDashboardData = useCallback(async () => {
    if (!user?.token) return;

    try {
      const headers = {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json'
      };

      const [resMy, resLiked, resProj] = await Promise.all([
        fetch('https://rang-server.onrender.com/api/palettes', { headers }),
        fetch('https://rang-server.onrender.com/api/palettes/liked', { headers }),
        fetch('https://rang-server.onrender.com/api/projects', { headers })
      ]);

      const myData = await resMy.json();
      const likedData = await resLiked.json();
      const projData = await resProj.json();

      if (resMy.ok) setMyPalettes(myData);
      if (resLiked.ok) setLikedPalettes(likedData);
      if (resProj.ok) setProjects(projData);

      setDataLoading(false);
    } catch (err) {
      console.error("Dashboard Sync Fail:", err);
      setDataLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchDashboardData();
    }
  }, [authLoading, user, fetchDashboardData]);

  const handlePreview = (colors) => {
    const formatted = colors.map(c => ({ hex: typeof c === 'string' ? c : c.hex, locked: false }));
    setColors(formatted);
    setShowVisualizer(true);
  };

  if (authLoading) return (
    <div className="h-screen w-full flex items-center justify-center bg-white font-black italic uppercase tracking-widest animate-pulse" aria-live="polite">
      Rang. Lab Syncing...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-32 pb-20 px-4 md:px-10 font-sans selection:bg-black selection:text-white">
      <div className="max-w-7xl mx-auto mt-[5px]">

        {/* --- HEADER (EMAIL & GREETING) --- */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8" role="banner">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-black text-white rounded-full shadow-lg">
              <Mail size={12} className="text-blue-400" />
              <span className="text-[9px] font-black uppercase tracking-widest leading-none">
                {user?.email || "have a good day"}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none text-[#111]">
              Hey, {user?.name ? user.name.split(' ')[0] : 'Artist'}
            </h1>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.4em] ml-1">
              Workspace Overview: {user?.name || 'Studio Member'}
            </p>
          </div>

          <button
            onClick={() => navigate('/generate')}
            aria-label="Create new color system"
            className="flex items-center justify-center gap-3 px-10 py-5 bg-white border border-black/5 rounded-[30px] text-[11px] font-black uppercase tracking-widest shadow-xl hover:bg-black hover:text-white transition-all active:scale-95 group"
          >
            Create New <Plus size={18} className="group-hover:rotate-90 transition-transform" />
          </button>
        </header>

        {/* --- STATS BENTO (A11Y OPTIMIZED) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12" role="region" aria-label="Quick Statistics">
          <StatCard label="My Palettes" value={myPalettes.length} icon={<Palette />} color="text-blue-500" bg="bg-blue-50" />
          <StatCard label="Projects" value={projects.length} icon={<Folder />} color="text-amber-500" bg="bg-amber-50" />
          <StatCard label="Liked Assets" value={likedPalettes.length} icon={<Heart fill="currentColor" />} color="text-red-500" bg="bg-red-50" />
        </div>

        {/* --- CONTENT FEED --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Main Feed: Liked Palettes */}
          <section className="lg:col-span-8 space-y-8" aria-labelledby="collections-heading">
            <div className="flex items-center justify-between px-2">
              <h3 id="collections-heading" className="text-sm font-black uppercase tracking-widest italic text-[#111]">Community Collections.</h3>
              <button onClick={() => navigate('/explore')} className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:underline">View Feed</button>
            </div>

            {likedPalettes.length === 0 && !dataLoading ? (
              <div className="bg-white rounded-[40px] border border-black/5 p-24 flex flex-col items-center justify-center text-center opacity-40">
                <Heart size={48} className="mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">No liked collections yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {likedPalettes.map((p) => (
                  <div key={p._id} className="group bg-white p-6 rounded-[40px] border border-black/5 hover:shadow-2xl transition-all duration-500">
                    <div className="h-32 flex rounded-[24px] overflow-hidden mb-5 relative shadow-inner">
                      {p.colors.map((hex, i) => (
                        <div key={i} className="flex-1" style={{ backgroundColor: hex }} />
                      ))}
                      <div className="absolute inset-0 bg-black/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4">
                        <button onClick={() => handlePreview(p.colors)} aria-label="Preview palette" className="p-3 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"><Eye size={18} /></button>
                        <button onClick={() => { setColors(p.colors.map(c => ({ hex: c, locked: false }))); navigate('/generate'); }} aria-label="Open in generator" className="p-3 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"><ExternalLink size={18} /></button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center px-2">
                      <span className="text-[13px] font-black uppercase tracking-tight truncate max-w-[150px] italic text-[#111]">{p.name || 'Untitled'}</span>
                      <Heart size={16} fill="#ef4444" className="text-red-500" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Sidebar: Workspace & Profile */}
          <aside className="lg:col-span-4 space-y-8">
            <h3 className="text-sm font-black uppercase tracking-widest italic px-2">Workspace.</h3>

            {/* Quick Projects Access */}
            <div className="bg-white rounded-[40px] border border-black/5 p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recent Folders</p>
                <button onClick={() => navigate('/library')} aria-label="Go to library" className="p-2 bg-slate-50 rounded-xl hover:bg-black hover:text-white transition-all"><ArrowRight size={14} /></button>
              </div>
              <div className="space-y-2">
                {projects.slice(0, 3).map(proj => (
                  <button
                    key={proj._id}
                    onClick={() => navigate('/library')}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <Folder size={14} className="text-amber-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[100px]">{proj.name}</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 bg-white px-2 py-1 rounded-lg group-hover:bg-black group-hover:text-white transition-colors">{proj.colorCount || 0}</span>
                  </button>
                ))}
                {projects.length === 0 && <p className="text-[9px] font-bold text-slate-300 italic p-4 text-center">No folders created yet.</p>}
              </div>
            </div>

            {/* Profile Glance (UPDATED TO SHOW EMAIL) */}
            <div className="bg-white rounded-[40px] border border-black/5 p-8 space-y-8 shadow-sm">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-white font-black italic shadow-lg">
                   {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-black uppercase tracking-tighter truncate text-black">{user?.name || 'Artist'}</p>
                  <p className="text-[9px] font-bold text-slate-400 truncate uppercase tracking-widest mt-0.5">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-3">
                <button onClick={() => navigate('/library')} className="w-full flex items-center justify-between p-5 rounded-[22px] bg-black group transition-all active:scale-95 shadow-xl">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Access Library</span>
                  <ArrowRight size={16} className="text-white group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </aside>

        </div>
      </div>

      {showVisualizer && <Visualizer onClose={() => setShowVisualizer(false)} />}
    </div>
  );
};

// --- SUB-COMPONENTS (A11Y ENABLED) ---
const StatCard = ({ label, value, icon, color, bg }) => (
  <div className="bg-white p-8 rounded-[35px] border border-black/5 shadow-sm flex items-center justify-between hover:shadow-lg transition-all" role="article">
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{label}</p>
      <p className="text-4xl font-black tracking-tighter text-[#111] leading-none" aria-live="polite">{value}</p>
    </div>
    <div className={`w-14 h-14 ${bg} ${color} rounded-2xl flex items-center justify-center shadow-inner`} aria-hidden="true">
      {React.cloneElement(icon, { size: 24 })}
    </div>
  </div>
);

export default Dashboard;