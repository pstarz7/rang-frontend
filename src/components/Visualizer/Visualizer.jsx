import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { 
  X, RefreshCcw, Smartphone, Type, 
  Download, Copy, ChevronRight, CheckCircle2, 
  AlertCircle, Zap, Monitor, LayoutGrid, Menu, Braces, 
  ShoppingBag, CreditCard, Activity, Globe, Send,
  ShieldCheck, Accessibility, Info, MousePointer2,
  TrendingUp, Users, Wallet, Box, Fingerprint, Star,
  Layers, Palette, Command, Eye
} from 'lucide-react';
import { useColor } from '../../context/ColorContext';
import { generateFormat } from '../../utils/exportUtils';
import { colorBlindFilters } from '../../utils/colorBlindFilters';
import { getContrastRatio, getWCAGStatus } from '../../utils/a11yUtils';
import chroma from 'chroma-js';

const Visualizer = ({ onClose }) => {
  // --- CORE CONTEXT ACCESS ---
  const context = useColor();
  

  const [localColors, setLocalColors] = useState(context?.colors || []);

  useEffect(() => {
    if (context?.colors) {
      setLocalColors(context.colors);
    }
  }, [context?.colors]);

  const triggerShuffle = useCallback(() => {
    const shuffleFunc = context?.refreshPalette || 
                        context?.generatePalette || 
                        context?.handleRefresh || 
                        context?.shuffle;
    
    if (shuffleFunc) {
      shuffleFunc();
    } else if (context?.setColors) {
      // Manual Generator Fallback if context function is hidden
      const newPalette = Array.from({ length: 5 }, () => ({ hex: chroma.random().hex() }));
      context.setColors(newPalette);
    }
  }, [context]);

  // --- UI STATES ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeVision, setActiveVision] = useState('normal');
  const [showExport, setShowExport] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('hex');
  const [copied, setCopied] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  // --- NEURAL MAPPING ENGINE ---
  const mapping = useMemo(() => {
    if (!localColors?.length) return { text: '#000', accent: '#333', primary: '#666', surface: '#f5f5f5', bg: '#fff' };
    const sorted = [...localColors].sort((a, b) => chroma(a.hex).luminance() - chroma(b.hex).luminance());
    return {
      text: sorted[0].hex, accent: sorted[1].hex, primary: sorted[2].hex, surface: sorted[3].hex, bg: sorted[4].hex,
    };
  }, [localColors]);

  const a11y = useMemo(() => {
    if (!mapping.bg) return { main: { ratio: 0, status: { label: '...', color: 'bg-slate-400' } } };
    const ratio = getContrastRatio(mapping.bg, mapping.text);
    return { main: { ratio: ratio.toFixed(2), status: getWCAGStatus(ratio) } };
  }, [mapping]);

  const isLight = (hex) => chroma(hex).luminance() > 0.5;

  // --- REACTION HANDLERS ---
  const handleShuffle = () => {
    setIsShuffling(true);
    triggerShuffle();
    setTimeout(() => setIsShuffling(false), 600);
  };

  const handleCopy = () => {
    try {
      const code = generateFormat(localColors, selectedFormat);
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) { console.error("Export utility failure", e); }
  };

  return (
    <div className="fixed inset-0 bg-[#0C0C0E] z-[9999] flex flex-col lg:flex-row overflow-hidden font-sans selection:bg-white selection:text-black animate-in fade-in duration-700">
      
      {/* VISION FILTERS */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        {Object.keys(colorBlindFilters).map(key => (
          <filter key={key} id={key}><feColorMatrix type="matrix" values={colorBlindFilters[key].matrix} /></filter>
        ))}
      </svg>

      {/* --- SIDEBAR: STUDIO CONTROLS (RESPONSIVE) --- */}
      <aside className={`hidden lg:flex flex-col bg-white/5 backdrop-blur-3xl border-r border-white/5 transition-all duration-500 ${isSidebarOpen ? 'w-80' : 'w-24'}`}>
        <div className="p-8 flex items-center gap-4 border-b border-white/5">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-black shadow-2xl rotate-3 shrink-0">
             <Fingerprint size={24} className={isShuffling ? 'animate-pulse' : ''} />
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-xl font-black italic tracking-tighter uppercase leading-none text-white truncate">Rang.Lab</span>
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-500 mt-1 truncate">Visualizer Pro V6</span>
            </div>
          )}
        </div>

        <div className="flex-1 p-6 space-y-8 overflow-y-auto no-scrollbar">
           {isSidebarOpen && (
             <div className="space-y-4 animate-in slide-in-from-left duration-500">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Contrast Audit</p>
                <div className="p-5 bg-white/5 rounded-3xl border border-white/5">
                   <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-black uppercase text-white/50">WCAG</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black text-white ${a11y.main.status.color}`}>{a11y.main.status.label}</span>
                   </div>
                   <p className="text-3xl font-black text-white tracking-tighter">{a11y.main.ratio}:1</p>
                </div>
             </div>
           )}

           <div className="space-y-4">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 px-1">{isSidebarOpen ? 'Vision Simulation' : <Eye size={14}/>}</p>
              <select onChange={(e) => setActiveVision(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-[10px] font-black uppercase tracking-widest outline-none focus:border-white transition-all cursor-pointer">
                  <option value="normal" className="bg-zinc-900">Normal</option>
                  {Object.keys(colorBlindFilters).map(k => <option key={k} value={k} className="bg-zinc-900">{colorBlindFilters[k].name}</option>)}
              </select>
           </div>
        </div>

        <div className="p-8 border-t border-white/5 space-y-4">
           <button onClick={() => setShowExport(true)} className="w-full flex items-center justify-center gap-3 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
             <Braces size={16} /> {isSidebarOpen && "Export Assets"}
           </button>
           <button onClick={onClose} className="w-full flex items-center justify-center gap-3 py-4 border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all">
             <X size={16} /> {isSidebarOpen && "Exit Studio"}
           </button>
        </div>
      </aside>

      {/* --- MAIN MOOD BOARD --- */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-br from-[#0C0C0E] to-[#161618]">
        
        {/* MOBILE TOP BAR */}
        <header className="h-16 lg:h-20 bg-black/20 backdrop-blur-md px-4 md:px-12 flex items-center justify-between border-b border-white/5 z-50">
           <div className="flex items-center gap-2">
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden lg:block p-2 text-white/50 hover:text-white transition-all">
               <Menu size={20} />
             </button>
             <div className="lg:hidden flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-black italic">R</div>
                <span className={`px-2 py-0.5 rounded text-[8px] font-black text-white ${a11y.main.status.color}`}>{a11y.main.ratio}:1</span>
             </div>
           </div>

           <div className="flex items-center gap-2 md:gap-3">
              <button 
                onClick={handleShuffle} 
                disabled={isShuffling}
                className="flex items-center gap-2 px-4 md:px-8 py-2 md:py-4 bg-white text-black rounded-full md:rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all"
              >
                <RefreshCcw size={14} className={isShuffling ? 'animate-spin' : ''} /> 
                <span className="hidden md:inline">{isShuffling ? 'MAPPING...' : 'SHUFFLE'}</span>
              </button>
              
              <button 
                onClick={() => setShowExport(true)}
                className="lg:hidden p-2.5 bg-white/10 text-white rounded-full border border-white/10"
              >
                <Braces size={18}/>
              </button>

              <button onClick={onClose} className="p-2.5 bg-red-500/20 text-red-400 rounded-full border border-red-500/20 transition-all active:scale-90">
                <X size={20}/>
              </button>
           </div>
        </header>

        {/* --- CREATIVE CANVAS --- */}
        <main 
          className="flex-1 overflow-y-auto p-4 md:p-12 lg:p-20 transition-all duration-700 no-scrollbar"
          style={{ filter: activeVision !== 'normal' ? `url(#${activeVision})` : 'none' }}
        >
          <div className="max-w-[1400px] mx-auto space-y-12 md:space-y-20 pb-32 lg:pb-0">
            
            {/* --- HERO SECTION --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
               <div className="lg:col-span-8 bg-white rounded-[40px] md:rounded-[60px] p-8 md:p-20 shadow-2xl relative overflow-hidden group" style={{ backgroundColor: mapping.bg }}>
                  <div className="absolute top-0 right-0 p-8 md:p-12 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                    <Palette size={300} md:size={400} style={{ color: mapping.primary }} />
                  </div>
                  <div className="relative z-10 space-y-8 md:space-y-12">
                     <div className="space-y-4">
                        <p className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.8em] opacity-40" style={{ color: mapping.text }}>Creative Studio V6.0</p>
                        <h2 className="text-5xl md:text-[120px] font-black italic tracking-tighter leading-[0.8]" style={{ color: mapping.text }}>Visual <br/> Architecture.</h2>
                     </div>
                     <p className="max-w-xl text-lg md:text-2xl font-medium leading-relaxed opacity-70" style={{ color: mapping.text }}>
                        Seamlessly analyzing <b>{mapping.primary}</b> contrast and semantic flow within high-fidelity product environments.
                     </p>
                     <div className="flex flex-wrap gap-3 md:gap-4">
                        <button className="flex-1 md:flex-none px-8 py-4 md:px-10 md:py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:scale-105 transition-all" style={{ backgroundColor: mapping.primary, color: isLight(mapping.primary) ? '#000' : '#fff' }}>Initialize</button>
                        <button className="flex-1 md:flex-none px-8 py-4 md:px-10 md:py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-black/10 transition-all" style={{ color: mapping.text }}>Portfolio</button>
                     </div>
                  </div>
               </div>

               <div className="lg:col-span-4 flex flex-row lg:flex-col gap-3 md:gap-6 h-32 md:h-auto overflow-x-auto no-scrollbar">
                  {localColors?.map((c, i) => (
                    <div key={i} className="min-w-[120px] lg:min-w-0 flex-1 rounded-3xl md:rounded-[40px] p-6 md:p-8 flex flex-col lg:flex-row items-end justify-between transition-all hover:scale-[1.02] shadow-xl group overflow-hidden relative" style={{ backgroundColor: c.hex }}>
                       <span className="text-2xl md:text-4xl font-black italic mix-blend-difference text-white">0{i+1}</span>
                       <span className="text-[10px] md:text-xl font-black mix-blend-difference text-white uppercase tracking-tighter">{c.hex}</span>
                    </div>
                  ))}
               </div>
            </div>

            {/* --- DASHBOARD & MOBILE MOCKUPS --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
               <div className="lg:col-span-7 bg-[#1A1A1E] rounded-[40px] md:rounded-[60px] p-6 md:p-10 border border-white/5 shadow-2xl flex flex-col md:h-[550px] overflow-hidden">
                  <div className="flex-1 flex flex-col md:flex-row rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl" style={{ backgroundColor: mapping.bg }}>
                     <aside className="w-full md:w-16 border-b md:border-b-0 md:border-r border-black/5 flex md:flex-col items-center justify-between md:justify-start p-4 md:py-8 md:gap-8" style={{ backgroundColor: mapping.text }}>
                        <div className="w-8 h-8 rounded-xl shadow-lg" style={{ backgroundColor: mapping.primary }} />
                        <div className="flex md:flex-col gap-4">
                           {[1,2,3].map(i => <div key={i} className="w-5 h-5 rounded-lg bg-white/10" />)}
                        </div>
                     </aside>
                     <main className="flex-1 p-6 md:p-10 space-y-6 md:space-y-8" style={{ backgroundColor: mapping.bg }}>
                        <h3 className="text-xl md:text-2xl font-black italic tracking-tight" style={{ color: mapping.text }}>Sales Node.</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                           <div className="h-32 md:h-40 rounded-[24px] md:rounded-[30px] p-6 md:p-8 flex flex-col justify-between" style={{ backgroundColor: mapping.surface }}>
                              <div className="flex items-end gap-1 h-12">
                                 {[40,80,60,90,50].map((h, i) => <div key={i} className="flex-1 rounded-t-md transition-all duration-500" style={{ height: `${h}%`, backgroundColor: mapping.primary }} />)}
                              </div>
                           </div>
                           <div className="h-32 md:h-40 rounded-[24px] md:rounded-[30px] p-6 md:p-8 flex flex-col justify-between relative overflow-hidden" style={{ backgroundColor: mapping.accent }}>
                              <CreditCard size={24} color={isLight(mapping.accent) ? '#000' : '#fff'} />
                              <div className="w-full h-1 bg-white/10 rounded-full" />
                           </div>
                        </div>
                     </main>
                  </div>
               </div>

               <div className="lg:col-span-5 bg-white rounded-[40px] md:rounded-[60px] p-8 md:p-10 shadow-2xl flex flex-col items-center justify-center gap-6 md:gap-10" style={{ backgroundColor: mapping.bg }}>
                  <div className="w-full md:w-[280px] h-[450px] md:h-[550px] bg-[#0A0A0A] rounded-[40px] md:rounded-[50px] p-3 shadow-[0_50px_100px_rgba(0,0,0,0.3)] border border-white/10 relative">
                     <div className="w-full h-full bg-white rounded-[32px] md:rounded-[40px] overflow-hidden flex flex-col" style={{ backgroundColor: mapping.bg }}>
                        <div className="h-[35%] p-6 md:p-8 flex flex-col justify-end gap-2" style={{ backgroundColor: mapping.primary }}>
                           <Wallet size={24} color={isLight(mapping.primary) ? '#000' : '#fff'} />
                           <h4 className="text-2xl md:text-3xl font-black italic tracking-tighter" style={{ color: isLight(mapping.primary) ? '#000' : '#fff' }}>Asset Hub.</h4>
                        </div>
                        <div className="p-6 md:p-8 space-y-6">
                           <div className="p-4 rounded-2xl border border-black/5" style={{ backgroundColor: mapping.surface }}>
                              <div className="flex gap-2 items-center"><div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: mapping.primary }} /></div>
                           </div>
                           <button className="w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl" style={{ backgroundColor: mapping.text, color: isLight(mapping.text) ? '#000' : '#fff' }}>Sync Vault</button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* --- IDENTITY & TYPOGRAPHY SECTION --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 pb-20">
               <div className="bg-white/5 rounded-[40px] md:rounded-[60px] p-10 md:p-16 border border-white/5 flex flex-col items-center justify-center gap-8 md:gap-12 group">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-[32px] md:rounded-[40px] flex items-center justify-center shadow-2xl group-hover:rotate-[360deg] transition-all duration-[2000ms]">
                     <Zap size={40} md:size={64} fill={mapping.primary} color={mapping.primary} />
                  </div>
                  <div className="text-center space-y-2">
                     <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter text-white uppercase truncate">Rang.Lab</h2>
                     <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.6em] text-white/30 italic">Identity Ecosystem</p>
                  </div>
               </div>

               <div className="bg-white rounded-[40px] md:rounded-[60px] p-8 md:p-16 shadow-2xl flex flex-col justify-between" style={{ backgroundColor: mapping.bg }}>
                  <div className="space-y-6">
                     <h3 className="text-2xl md:text-3xl font-black italic tracking-tighter text-black">Typographic Grid.</h3>
                     <div className="space-y-3">
                        <p className="text-4xl md:text-6xl font-black tracking-tighter" style={{ color: mapping.text }}>Display Black</p>
                        <p className="text-xl md:text-3xl font-bold opacity-60" style={{ color: mapping.text }}>Semibold Secondary</p>
                        <p className="text-xs md:text-sm font-medium leading-relaxed opacity-40 italic" style={{ color: mapping.text }}>Semantic typography layers testing readability and luminance contrast.</p>
                     </div>
                  </div>
                  <div className="flex gap-2 h-2 mt-8 md:mt-10">
                     {localColors?.map((c, i) => <div key={i} className="flex-1 rounded-full shadow-sm" style={{ backgroundColor: c.hex }} />)}
                  </div>
               </div>
            </div>

          </div>
        </main>
      </div>

      {/* --- EXPORT MODAL --- */}
      {showExport && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-3xl z-[9999] flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-xl rounded-[40px] overflow-hidden animate-in zoom-in duration-500 shadow-2xl">
              <div className="p-8 md:p-14 space-y-8 md:space-y-10">
                <header className="flex justify-between items-center">
                  <h3 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter">Handoff.</h3>
                  <button onClick={() => setShowExport(false)} className="p-2 bg-slate-100 rounded-full hover:bg-black hover:text-white transition-all"><X size={20}/></button>
                </header>
                <div className="grid grid-cols-2 gap-3">
                  {['hex', 'tailwind', 'css', 'json'].map(f => (
                    <button key={f} onClick={() => setSelectedFormat(f)} className={`p-4 md:p-5 rounded-2xl md:rounded-3xl text-[9px] md:text-[10px] font-black uppercase tracking-widest border transition-all ${selectedFormat === f ? 'bg-black border-black text-white shadow-xl' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-black'}`}>{f}</button>
                  ))}
                </div>
                <button onClick={handleCopy} className="w-full py-6 bg-black text-white rounded-2xl md:rounded-3xl text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                   {copied ? <CheckCircle2 size={18} className="text-emerald-400" /> : <Copy size={18} />}
                   {copied ? 'COPIED' : 'GENERATE'}
                </button>
              </div>
           </div>
        </div>
      )}

      {/* --- CONTACT HUB (PERSISTENT) --- */}
      <footer className="fixed bottom-0 right-0 p-8 hidden lg:block z-50 pointer-events-none">
          <div className="flex flex-col items-end gap-2 opacity-30 pointer-events-auto hover:opacity-100 transition-all cursor-crosshair">
            <p className="text-[9px] font-black uppercase tracking-[0.6em] italic text-white">Rang.Lab Architect</p>
            <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">studio@ranglab.net</p>
          </div>
      </footer>
    </div>
  );
};

export default Visualizer;