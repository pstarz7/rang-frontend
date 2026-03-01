import React, { useState, useMemo } from 'react';
import { Search, X, ExternalLink, SlidersHorizontal, Check, Eye } from 'lucide-react';
import { premiumPalettes } from '../../data/palettes';
import { useColor } from '../../context/ColorContext';
import { useNavigate } from 'react-router-dom';
// IMPORT THE VISUALIZER
import Visualizer from '../Visualizer/Visualizer'; 

const ExploreGallery = () => {
  const { setColors } = useColor();
  const navigate = useNavigate();
  
  // NEW STATES FOR VISUALIZER
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStyle, setActiveStyle] = useState('All');
  const [copiedId, setCopiedId] = useState(null);

  const styles = ['All', 'Minimal', 'Retro', 'Pastel', 'Vintage', 'Nature', 'Luxury'];

  const filteredPalettes = useMemo(() => {
    return premiumPalettes.filter(palette => {
      const query = searchQuery.toLowerCase();
      const textMatch = palette.name.toLowerCase().includes(query) ||
                        palette.style.toLowerCase().includes(query) ||
                        palette.family.toLowerCase().includes(query);
      const hexMatch = palette.colors.some(color => color.toLowerCase().includes(query));
      const styleMatch = activeStyle === 'All' || palette.style.toLowerCase() === activeStyle.toLowerCase();
      return (textMatch || hexMatch) && styleMatch;
    });
  }, [searchQuery, activeStyle]);

  // HANDLERS
  const handleOpenInGenerator = (colors) => {
    setColors(colors.map(hex => ({ hex, locked: false })));
    navigate('/generate'); // Take user to the generator with these colors
  };

  const handlePreview = (colors) => {
    // Set the global colors so the Visualizer can see them
    setColors(colors.map(hex => ({ hex, locked: false })));
    setShowVisualizer(true); // Open the visualizer
  };

  const copyToClipboard = (colors, id) => {
    navigator.clipboard.writeText(colors.join(', '));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 bg-white z-[200] overflow-y-auto font-sans">
      
      {/* HEADER */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-2xl border-b border-slate-100 p-6 z-50">
        <div className="max-w-[1400px] mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
               <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-black text-lg shadow-xl">R</div>
               <h2 className="text-3xl font-black tracking-tighter uppercase italic">Library.</h2>
            </div>
            <button onClick={() => navigate('/generate')} className="p-3 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-black">
              <X size={24}/>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Search palettes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[20px] outline-none"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-2 no-scrollbar">
              {styles.map(s => (
                <button key={s} onClick={() => setActiveStyle(s)} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${activeStyle === s ? 'bg-black border-black text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}>{s}</button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* GRID */}
      <main className="max-w-[1400px] mx-auto p-6 md:p-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {filteredPalettes.map((palette) => (
            <div key={palette.id} className="group flex flex-col gap-4">
              <div className="relative h-32 w-full rounded-xl overflow-hidden shadow-sm group-hover:shadow-2xl transition-all duration-500 border border-slate-100">
                <div className="h-full w-full flex">
                  {palette.colors.map((c, i) => (
                    <div key={i} style={{ backgroundColor: c }} className="h-full flex-1 group-hover:flex-[1.3] transition-all" />
                  ))}
                </div>

                {/* UPDATED ACTION BUTTONS */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 backdrop-blur-[2px]">
                  <button 
                    onClick={() => handleOpenInGenerator(palette.colors)}
                    className="p-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform"
                    title="Open in Generator"
                  >
                    <ExternalLink size={18} />
                  </button>
                  <button 
                    onClick={() => handlePreview(palette.colors)}
                    className="p-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform"
                    title="Visualize"
                  >
                    <Eye size={18} />
                  </button>
                  <button 
                    onClick={() => copyToClipboard(palette.colors, palette.id)}
                    className="p-3 bg-white/20 text-white rounded-xl backdrop-blur-md hover:bg-white/40 transition-all border border-white/20"
                  >
                    {copiedId === palette.id ? <Check size={18}/> : <SlidersHorizontal size={18}/>}
                  </button>
                </div>
              </div>
              <div className="px-1">
                <h4 className="text-sm font-black text-slate-900 leading-none mb-1">{palette.name}</h4>
                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{palette.style} • {palette.family}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 2. RENDER THE VISUALIZER MODAL HERE */}
      {showVisualizer && (
        <Visualizer onClose={() => setShowVisualizer(false)} />
      )}
    </div>
  );
};

export default ExploreGallery;