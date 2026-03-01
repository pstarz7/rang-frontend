import React, { useState, useMemo, useEffect } from 'react';
import { Search, ExternalLink, Copy, Check, Eye, Heart, Globe, Star, TrendingUp, ArrowUpDown, Zap } from 'lucide-react';
import { premiumPalettes } from '../data/palettes'; 
import { useColor } from '../context/ColorContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
import Visualizer from '../components/Visualizer/Visualizer';

const Explore = () => {
  const { setColors } = useColor();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [communityPalettes, setCommunityPalettes] = useState([]);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStyle, setActiveStyle] = useState('All');
  const [copiedId, setCopiedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('premium');
  const [sortBy, setSortBy] = useState('newest');

  const styles = ['All', 'Minimal', 'Retro', 'Pastel', 'Vintage', 'Nature', 'Luxury'];

  const fetchCommunity = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://rang-server.onrender.com/api/palettes/explore');
      const data = await res.json();
      if (res.ok) setCommunityPalettes(data);
    } catch (err) {
      console.error("Community fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunity();
  }, []);

  const filteredPremium = useMemo(() => {
    return premiumPalettes.filter(palette => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || (
        palette.name?.toLowerCase().includes(query) ||
        palette.colors?.some(c => c.toLowerCase().includes(query))
      );
      const matchesStyle = activeStyle === 'All' || 
        palette.style?.toLowerCase() === activeStyle.toLowerCase();
      return matchesSearch && matchesStyle;
    });
  }, [searchQuery, activeStyle]);

  const processedCommunity = useMemo(() => {
    let result = communityPalettes.filter(p => {
      const query = searchQuery.toLowerCase().trim();
      return (p.name?.toLowerCase().includes(query)) || 
             (p.colors?.some(c => c.toLowerCase().includes(query)));
    });

    if (sortBy === 'popular') {
      result.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
    } else {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return result;
  }, [searchQuery, communityPalettes, sortBy]);

  const handleOpenInGenerator = (colors) => {
    const formatted = colors.map(c => ({ hex: typeof c === 'string' ? c : c.hex, locked: false }));
    setColors(formatted);
    navigate('/generate');
  };

  const handlePreview = (colors) => {
    const formatted = colors.map(c => ({ hex: typeof c === 'string' ? c : c.hex, locked: false }));
    setColors(formatted);
    setShowVisualizer(true);
  };

  const copyToClipboard = (colors, id) => {
    const colorString = colors.map(c => typeof c === 'string' ? c : c.hex).join(', ');
    navigator.clipboard.writeText(colorString);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLike = async (id) => {
    if (!user) return alert("Please login to like palettes!");
    try {
      const res = await fetch(`https://rang-server.onrender.com/api/palettes/${id}/like`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) fetchCommunity(); 
    } catch (err) {
      console.error("Like Error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] font-sans pb-20 pt-24 md:pt-32 selection:bg-black selection:text-white">
      <Navbar />
      <header className="bg-white py-12 md:py-16 px-8 border-b border-slate-100">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-2 text-center md:text-left">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase leading-none">Explore.</h1>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">Designer Intelligence & Community Systems</p>
            </div>
            <div className="flex bg-slate-100 p-1.5 rounded-2xl shadow-inner">
              <button onClick={() => setViewMode('premium')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'premium' ? 'bg-white text-black shadow-md' : 'text-slate-400'}`}>Premium</button>
              <button onClick={() => setViewMode('community')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'community' ? 'bg-white text-black shadow-md' : 'text-slate-400'}`}>Community</button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input type="text" placeholder="Search palettes by color or name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-16 pr-6 py-5 bg-white border border-slate-100 rounded-2xl outline-none text-sm font-bold shadow-sm focus:border-black transition-colors" />
            </div>
            
            {viewMode === 'premium' ? (
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar w-full lg:w-auto">
                {styles.map(s => (
                  <button key={s} onClick={() => setActiveStyle(s)} className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${activeStyle === s ? 'bg-black border-black text-white shadow-lg scale-105' : 'bg-white border-slate-100 text-slate-400 hover:border-black hover:text-black'}`}>{s}</button>
                ))}
              </div>
            ) : (
              <div className="relative w-full lg:w-auto">
                <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full lg:w-48 pl-12 pr-6 py-5 bg-white border border-slate-100 rounded-2xl outline-none text-[10px] font-black uppercase tracking-widest cursor-pointer appearance-none">
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8 pt-12">
        <div className="flex items-center gap-3 mb-10">
            <Zap size={18} className="text-amber-500 fill-amber-500" />
            <h2 className="text-2xl font-black tracking-tight text-slate-800 capitalize italic leading-none">{viewMode} Collections.</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {(viewMode === 'premium' ? filteredPremium : processedCommunity).map((p) => (
            <VisualCard 
              key={viewMode === 'premium' ? p.id : p._id} 
              palette={p} 
              isCommunity={viewMode === 'community'} 
              user={user} 
              onOpen={handleOpenInGenerator} 
              onPreview={handlePreview} 
              onLike={handleLike} 
              onCopy={copyToClipboard} 
              copiedId={copiedId} 
            />
          ))}
        </div>
      </main>
      {showVisualizer && <Visualizer onClose={() => setShowVisualizer(false)} />}
    </div>
  );
};

const VisualCard = ({ palette, isCommunity, onOpen, onPreview, onCopy, onLike, copiedId, user }) => {
  const colors = palette.colors || [];
  const paletteId = isCommunity ? palette._id : palette.id;
  
  //  Logic to detect if current logged-in user liked this specific palette
  const isLiked = isCommunity && user && palette.likes?.includes(user._id);

  return (
    <div className="group bg-white rounded-[40px] p-5 border border-slate-100 shadow-sm hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-500">
      
      {/* PALETTE CONTAINER: Mobile Smart-Click Integration */}
      <div 
        onClick={() => { if(window.innerWidth < 768) onOpen(colors); }}
        className="relative h-48 w-full rounded-[30px] overflow-hidden mb-6 cursor-pointer md:cursor-default"
      >
        <div className="h-full w-full flex">
          {colors.map((c, i) => (
            <div key={i} style={{ backgroundColor: typeof c === 'string' ? c : c.hex }} className="h-full flex-1" />
          ))}
        </div>
        
        {/* Desktop Overlay - Hidden on Mobile */}
        <div className="hidden md:flex absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-all duration-400 items-center justify-center gap-4 backdrop-blur-[6px]">
          <button onClick={(e) => { e.stopPropagation(); onPreview(colors); }} className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all text-black"><Eye size={18} /></button>
          <button onClick={(e) => { e.stopPropagation(); onOpen(colors); }} className="w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all text-white"><ExternalLink size={18} /></button>
        </div>
      </div>

      <div className="flex flex-col px-1">
        <div className="flex justify-between items-start">
          <div className="space-y-1.5 overflow-hidden">
            <div className="flex items-center gap-3">
              <h4 className="text-lg font-black tracking-tight text-slate-900 leading-tight truncate">{palette.name || "Untitled"}</h4>
              {isCommunity && (
                <button 
                    onClick={() => onLike(paletteId)} 
                    className="transition-all hover:scale-125 active:scale-75 shrink-0"
                >
                  <Heart 
                    size={18} 
                    fill={isLiked ? "#ef4444" : "none"} 
                    className={isLiked ? "text-red-500 animate-in zoom-in duration-300" : "text-slate-300"} 
                  />
                </button>
              )}
            </div>
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">{isCommunity ? `Author: ${palette.user?.name || 'Designer'}` : `${palette.style} // ${palette.family}`}</p>
          </div>
          <button onClick={() => onCopy(colors, paletteId)} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:bg-black hover:text-white transition-all shrink-0 ml-4">
            {copiedId === paletteId ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
          </button>
        </div>
        
        {isCommunity && (
          <div className="mt-5 flex items-center justify-between border-t border-slate-50 pt-4">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{palette.likes?.length || 0} Votes</span>
            </div>
            <span className="text-[8px] font-bold text-slate-200 uppercase">{new Date(palette.createdAt).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;