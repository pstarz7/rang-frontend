import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, ExternalLink, Copy, Check, Heart, 
  ArrowUpDown, ArrowUp, Eye, Hash, SquareArrowOutUpRight, ChevronDown
} from 'lucide-react';
import { premiumPalettes } from '../data/palettes'; 
import { useColor } from '../context/ColorContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
import Visualizer from '../components/Visualizer/Visualizer';
import { gsap } from 'gsap';

const Explore = () => {
  const { setColors } = useColor();
  const { user } = useAuth();
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const gridRef = useRef(null);

  const [communityPalettes, setCommunityPalettes] = useState([]);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStyle, setActiveStyle] = useState('All');
  const [copiedId, setCopiedId] = useState(null);
  const [viewMode, setViewMode] = useState('premium');
  const [sortBy, setSortBy] = useState('id-asc'); 
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  // PAGINATION: 50 units at a time
  const [visibleCount, setVisibleCount] = useState(50);

  const styles = ['All', 'Pastel', 'Minimal', 'Luxury', 'Retro', 'Nature', 'Vintage', 'Playful', 'Brutalist'];

  const fetchCommunity = async () => {
    try {
      const res = await fetch('https://rang-server.onrender.com/api/palettes/explore');
      const data = await res.json();
      if (res.ok) setCommunityPalettes(data);
    } catch (err) { console.error("Fetch error:", err); }
  };

  useEffect(() => { fetchCommunity(); }, []);

  // GSAP Entrance & Pagination Reset
  useEffect(() => {
    setVisibleCount(50);
    if (gridRef.current) {
      gsap.fromTo(".specimen-card", 
        { opacity: 0, y: 15, scale: 0.98 }, 
        { 
          opacity: 1, y: 0, scale: 1, 
          duration: 0.5, stagger: { amount: 0.3 }, 
          ease: "expo.out", clearProps: "all"
        }
      );
    }
  }, [searchQuery, activeStyle, sortBy, viewMode]);

  const handleScroll = (e) => { setShowBackToTop(e.target.scrollTop > 400); };
  const scrollToTop = () => { scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); };

  const allFilteredData = useMemo(() => {
    const rawData = viewMode === 'premium' ? [...premiumPalettes] : [...communityPalettes];
    const cleanData = rawData.map(p => ({ ...p, numericId: parseInt(p.id, 10) || 0 }));
    const query = searchQuery.toLowerCase().trim();

    let result = cleanData.filter(p => {
      const hexString = p.colors?.map(c => (typeof c === 'string' ? c : c.hex)).join(' ').toLowerCase();
      return (!query || (p.name?.toLowerCase().includes(query) || p.family?.toLowerCase().includes(query) || hexString.includes(query))) &&
             (activeStyle === 'All' || p.style?.toLowerCase() === activeStyle.toLowerCase());
    });

    result.sort((a, b) => {
      if (viewMode === 'premium') return sortBy === 'id-asc' ? a.numericId - b.numericId : b.numericId - a.numericId;
      return sortBy === 'popular' ? (b.likes?.length || 0) - (a.likes?.length || 0) : new Date(b.createdAt) - new Date(a.createdAt);
    });
    return result;
  }, [searchQuery, activeStyle, sortBy, viewMode, communityPalettes]);

  const displayedData = allFilteredData.slice(0, visibleCount);
  const handleLoadMore = () => setVisibleCount(prev => prev + 50);

  const handleOpenInGenerator = (colors) => {
    setColors(colors.map(c => ({ hex: typeof c === 'string' ? c : c.hex, locked: false })));
    navigate('/generate');
  };

  return (
    <div className="h-screen flex flex-col bg-[#FDFDFD] overflow-hidden selection:bg-black selection:text-white">
      <Navbar />
      
      <header className="bg-white/95 backdrop-blur-md pt-32 md:pt-36 pb-6 px-4 md:px-12 border-b border-slate-100 flex-shrink-0 z-50">
        <div className="max-w-[1800px] mx-auto space-y-6">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-4">
            <div className="space-y-0.5">
              <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none text-black">Explore.</h1>
              <p className="text-slate-400 text-[8px] font-black uppercase tracking-[0.5em] ml-1">Creative Color palettes</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <div className="flex bg-slate-50 border border-slate-200 p-1 rounded-xl shadow-sm">
                {['premium', 'community'].map(mode => (
                  <button key={mode} onClick={() => setViewMode(mode)} className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 ${viewMode === mode ? 'bg-white text-black shadow-md' : 'text-slate-400 hover:text-black'}`}>{mode}</button>
                ))}
              </div>
              <div className="relative lg:w-48">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full pl-4 pr-8 py-3 bg-white border border-slate-300 rounded-xl outline-none text-[9px] font-black uppercase tracking-widest cursor-pointer appearance-none hover:border-black transition-all shadow-sm active:scale-95">
                  {viewMode === 'premium' ? <><option value="id-asc">Top</option><option value="id-desc">Down</option></> : <><option value="newest">Recent</option><option value="popular">Popular</option></>}
                </select>
                <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-3">
             <div className="relative flex-1 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-black transition-colors" size={14} />
                <input 
                  type="text" 
                  placeholder="Search palettes, hex, styles..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="w-full pl-11 pr-4 py-4 bg-white border border-slate-300 rounded-xl outline-none text-xs font-bold focus:border-black transition-all shadow-sm placeholder:text-slate-300" 
                />
             </div>
             <div className="flex gap-1.5 overflow-x-auto pb-2 no-scrollbar">
                {styles.map(s => (
                  <button key={s} onClick={() => setActiveStyle(s)} className={`px-5 py-3 rounded-xl text-[8px] font-black uppercase tracking-widest border border-slate-200 transition-all whitespace-nowrap active:scale-90 ${activeStyle === s ? 'bg-black border-black text-white shadow-lg' : 'bg-white text-slate-400 hover:border-black hover:text-black'}`}>{s}</button>
                ))}
             </div>
          </div>
        </div>
      </header>

      <main ref={scrollContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-4 md:px-12 pt-8 pb-32 no-scrollbar scroll-smooth">
        <div className="max-w-[1800px] mx-auto" ref={gridRef}>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-8">
            {displayedData.map((p) => (
              <SpecimenCard 
                key={viewMode === 'premium' ? `premium-${p.id}` : `comm-${p._id}`} 
                palette={p} 
                isCommunity={viewMode === 'community'} 
                user={user} 
                onOpen={handleOpenInGenerator} 
                onPreview={(c) => { setColors(c.map(hex => ({hex, locked: false}))); setShowVisualizer(true); }} 
                onLike={fetchCommunity} 
                onCopy={(c, id) => { navigator.clipboard.writeText(c.join(', ')); setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); }} 
                copiedId={copiedId} 
              />
            ))}
          </div>

          {/* --- FIXED LOAD MORE SECTION --- */}
          {visibleCount < allFilteredData.length && (
            <div className="mt-20 flex flex-col items-center gap-6 pb-20 w-full">
               <div className="h-px w-32 bg-slate-200" />
               <button 
                 onClick={handleLoadMore}
                 className="group flex items-center gap-4 px-10 md:px-14 py-4 md:py-5 bg-white border border-slate-400 rounded-full hover:bg-black hover:border-black transition-all active:scale-95 shadow-md"
               >
                 <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-black group-hover:text-white transition-colors">Load More Colors</span>
                 <ChevronDown size={18} className="text-black group-hover:text-white group-hover:translate-y-1 transition-all" />
               </button>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                 Showing {displayedData.length} of {allFilteredData.length} palettes
               </p>
            </div>
          )}
        </div>
      </main>

      {showBackToTop && (
        <button onClick={scrollToTop} className="fixed bottom-8 right-8 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90 transition-all z-[100] border border-white/20"><ArrowUp size={18} /></button>
      )}

      {showVisualizer && <Visualizer onClose={() => setShowVisualizer(false)} />}
    </div>
  );
};

const SpecimenCard = ({ palette, isCommunity, onOpen, onPreview, onCopy, onLike, copiedId, user }) => {
  const colors = palette.colors || [];
  const paletteId = isCommunity ? palette._id : palette.id;
  const isLiked = isCommunity && user && palette.likes?.includes(user._id);

  return (
    <div className="specimen-card group bg-white rounded-[24px] overflow-hidden border border-slate-300 hover:border-slate-400 transition-all duration-500 hover:shadow-[0_25px_50px_rgba(0,0,0,0.1)] hover:-translate-y-1">
      {/* 5 Equal Color Strips with Visible Dividers */}
      <div onClick={() => onOpen(colors)} className="relative h-40 md:h-52 w-full cursor-pointer flex border-b border-slate-100">
        {colors.map((c, i) => (
          <div 
            key={i} 
            style={{ backgroundColor: typeof c === 'string' ? c : c.hex }} 
            className="h-full flex-1 transition-all duration-500 group-hover:flex-[1.4] border-r last:border-r-0 border-black/[0.08]" 
          />
        ))}
        
        {/* Swapped focus icon to SquareArrowOutUpRight */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-[2px]">
           <button onClick={(e) => { e.stopPropagation(); onPreview(colors); }} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-xl hover:scale-110 active:scale-90 transition-all text-black">
              <Eye size={18} />
           </button>
           <button onClick={(e) => { e.stopPropagation(); onOpen(colors); }} className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-xl hover:scale-110 active:scale-90 transition-all text-white">
              <SquareArrowOutUpRight size={18} />
           </button>
        </div>
      </div>

      <div className="p-4 md:p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1 max-w-[75%] overflow-hidden">
             <h4 className="text-[10px] md:text-[11px] font-black uppercase tracking-tight text-black truncate leading-none">{palette.name || "System Unit"}</h4>
             <p className="text-[7px] font-bold text-slate-400 uppercase tracking-[0.2em] truncate">
                {isCommunity ? `Author: ${palette.user?.name}` : `${palette.style} // ${palette.family}`}
             </p>
          </div>
          <button onClick={() => onCopy(colors, paletteId)} className="p-2 -mr-2 text-slate-300 hover:text-black transition-all active:scale-75">
             {copiedId === paletteId ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          </button>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-50">
           <div className="flex items-center gap-1.5 opacity-60">
              <Hash size={10} className="text-black" />
              <span className="text-[9px] font-black text-black uppercase tracking-widest">{palette.id}</span>
           </div>
           
           {isCommunity ? (
              <button onClick={() => onLike(paletteId)} className="flex items-center gap-1.5 group/heart transition-all active:scale-125">
                 <Heart size={14} fill={isLiked ? "#000" : "none"} className={isLiked ? "text-black" : "text-slate-300 group-hover/heart:text-black"} />
                 <span className="text-[9px] font-black text-slate-500">{palette.likes?.length || 0}</span>
              </button>
           ) : (
              <div className="px-2 py-0.5 bg-slate-50 rounded text-[6px] font-black uppercase text-slate-500 border border-slate-200 tracking-tighter">Ranglab</div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
