import React, { useState, useEffect, useCallback } from 'react';
import { 
  Eye, Pipette, Lock, Unlock, RefreshCcw, Copy, 
  Check, Layers, Download, Save, X, 
  Smartphone, Palette, AlertCircle, LogIn, UserPlus, ShieldCheck
} from 'lucide-react';
import { useColor } from '../context/ColorContext';
import { useAuth } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';
import { generateWCAGPalette, getContrastColor, getShades } from '../utils/ColorEngine';
import chroma from 'chroma-js';
import { gsap } from 'gsap';

// Tool Components
import Visualizer from '../components/Visualizer/Visualizer';
import ImagePicker from '../components/Tools/ImagePicker';
import ExportModal from '../components/Tools/ExportModal';
import SaveModal from '../components/Modals/SaveModal';
import LiveMockup from '../components/Visualizer/LiveMockup';

const Generatorpage = () => {
  const { user } = useAuth(); 
  const navigate = useNavigate();
  const { colors, setColors } = useColor();

  const [localVisOpen, setLocalVisOpen] = useState(false);
  const [localPickerOpen, setLocalPickerOpen] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [isMockupOpen, setIsMockupOpen] = useState(false);
  const [activeShadeIndex, setActiveShadeIndex] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showAuthAlert, setShowAuthAlert] = useState(false);

  const handleSaveAttempt = () => {
    if (!user) setShowAuthAlert(true);
    else setIsSaveOpen(true);
  };

  const refreshPalette = useCallback(() => {
    const newWCAGSet = generateWCAGPalette();
    const updatedColors = colors.map((col, index) => {
      if (col.locked) return col;
      return { ...col, hex: newWCAGSet[index].hex };
    });
    setColors(updatedColors);

    // Ultra-smooth GSAP scale-in transition
    gsap.fromTo(".color-card", 
      { opacity: 0, scale: 0.96 }, 
      { opacity: 1, scale: 1, duration: 0.5, stagger: 0.04, ease: "power2.out" }
    );
  }, [colors, setColors]);

  const selectNewShade = (index, newHex) => {
    const updated = [...colors];
    updated[index] = { ...updated[index], hex: newHex.toUpperCase() };
    setColors(updated);
    setActiveShadeIndex(null);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      const isModalActive = localVisOpen || localPickerOpen || showExport || isSaveOpen || activeShadeIndex !== null || isMockupOpen || showAuthAlert;
      if (e.code === 'Space' && !isModalActive) {
        e.preventDefault();
        refreshPalette();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [refreshPalette, localVisOpen, localPickerOpen, showExport, isSaveOpen, activeShadeIndex, isMockupOpen, showAuthAlert]);

  return (
    <div className="h-screen w-full flex flex-col bg-[#FDFDFD] overflow-hidden selection:bg-black selection:text-white">
      
      {/* --- RESPONSIVE COLOR CANVAS --- */}
      <main className="flex-1 w-full flex flex-col md:flex-row p-3 md:p-6 lg:p-10 gap-3 md:gap-4 overflow-y-auto md:overflow-hidden pt-24 md:pt-28">
        {colors.map((color, index) => {
          const textColor = getContrastColor(color.hex);
          const isShadeActive = activeShadeIndex === index;

          return (
            <div 
              key={index}
              className="color-card flex-1 min-w-0 flex flex-row md:flex-col items-center justify-between md:justify-center p-6 md:p-8 transition-all duration-500 relative group rounded-[32px] md:rounded-[48px] shadow-sm hover:shadow-xl border border-black/[0.03]"
              style={{ backgroundColor: color.hex }}
            >
              {/* CORE DATA: Hex and Name only */}
              <div className="flex flex-col items-start md:items-center z-20 pointer-events-none">
                <h2 
                  className="font-semibold uppercase tracking-widest leading-none text-[clamp(1.1rem,6vw,2.2rem)] md:text-[clamp(1.4rem,2.2vw,2.8rem)]"
                  style={{ color: textColor }}
                >
                  {color.hex.replace('#', '')}
                </h2>
                <span 
                  className="text-[9px] font-medium uppercase tracking-[0.3em] opacity-40 mt-2 md:mt-4"
                  style={{ color: textColor }}
                >
                   {chroma(color.hex).name()}
                </span>
              </div>

              {/* ACTION TOOLS */}
              <div className="flex md:flex-col gap-1.5 md:gap-2 order-2 md:order-1 md:mt-10 z-20 md:opacity-0 group-hover:opacity-100 transition-all duration-300">
                <button onClick={() => {
                  const updated = [...colors];
                  updated[index].locked = !updated[index].locked;
                  setColors(updated);
                }} className="p-3.5 md:p-4 rounded-2xl hover:bg-black/10 transition-all active:scale-90" style={{ color: textColor }}>
                  {color.locked ? <Lock size={20} /> : <Unlock size={20} className="opacity-30" />}
                </button>
                
                <button onClick={() => {
                  navigator.clipboard.writeText(color.hex);
                  setCopiedIndex(index);
                  setTimeout(() => setCopiedIndex(null), 1500);
                }} className="p-3.5 md:p-4 rounded-2xl hover:bg-black/10 transition-all active:scale-90" style={{ color: textColor }}>
                  {copiedIndex === index ? <Check size={20} /> : <Copy size={20} />}
                </button>

                <button onClick={() => setActiveShadeIndex(index)} className="p-3.5 md:p-4 rounded-2xl hover:bg-black/10 transition-all active:scale-90" style={{ color: textColor }}>
                  <Layers size={20} />
                </button>
              </div>

              {/* SHADES DRAWER */}
              {isShadeActive && (
                <div className="absolute inset-0 z-50 flex flex-col bg-white animate-in slide-in-from-bottom duration-500 rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl">
                  <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50 bg-white">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Scale // {color.hex}</span>
                    <button onClick={() => setActiveShadeIndex(null)} className="p-2 hover:bg-slate-100 rounded-full transition-all"><X size={16}/></button>
                  </div>
                  <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
                    {getShades(color.hex).map((shadeHex, i) => (
                      <div key={i} className="flex-1 min-h-[45px] flex items-center justify-center cursor-pointer hover:flex-[5] transition-all group border-b border-black/5"
                        style={{ backgroundColor: shadeHex }} onClick={() => selectNewShade(index, shadeHex)}>
                         <span className="text-[9px] font-bold opacity-0 group-hover:opacity-100 uppercase tracking-widest bg-white/20 backdrop-blur-md px-3 py-1 rounded" style={{ color: getContrastColor(shadeHex) }}>{shadeHex}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </main>

      {/* --- STUDIO UTILITY FOOTER --- */}
      <footer className="h-24 md:h-28 bg-white border-t border-slate-100 px-4 md:px-12 flex items-center justify-between z-[60] relative shadow-2xl shrink-0">
        <div className="flex items-center gap-2 md:gap-3 overflow-hidden">
            <button onClick={() => setLocalPickerOpen(true)} className="flex items-center gap-2 px-3.5 md:px-5 py-3.5 bg-slate-50 hover:bg-black hover:text-white rounded-xl md:rounded-2xl transition-all active:scale-95">
              <Pipette size={18} />
              <span className="text-[9px] font-bold uppercase tracking-widest hidden lg:block">Extractor</span>
            </button>
            <button onClick={() => setLocalVisOpen(true)} className="flex items-center gap-2 px-3.5 md:px-5 py-3.5 bg-slate-50 hover:bg-black hover:text-white rounded-xl md:rounded-2xl transition-all active:scale-95">
              <Eye size={18} />
              <span className="text-[9px] font-bold uppercase tracking-widest hidden lg:block">Visualize</span>
            </button>
            <button onClick={() => setIsMockupOpen(true)} className="flex items-center gap-2 px-3.5 md:px-5 py-3.5 bg-slate-50 hover:bg-black hover:text-white rounded-xl md:rounded-2xl transition-all active:scale-95">
              <Smartphone size={18} />
              <span className="text-[9px] font-bold uppercase tracking-widest hidden lg:block">Mockup</span>
            </button>
        </div>

        <div className="flex items-center gap-1 md:gap-4">
            <button onClick={handleSaveAttempt} className="p-3.5 md:p-4 text-slate-400 hover:text-black hover:bg-slate-50 rounded-xl transition-all active:scale-90">
              <Save size={20} />
            </button>
            <button onClick={() => setShowExport(true)} className="p-3.5 md:p-4 text-slate-400 hover:text-black hover:bg-slate-50 rounded-xl transition-all active:scale-90">
              <Download size={20} />
            </button>
            <div className="w-px h-6 bg-slate-100 mx-1 md:mx-2" />
            <button 
              onClick={refreshPalette}
              className="flex items-center gap-2 md:gap-3 px-7 md:px-12 py-3.5 md:py-4.5 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl group"
            >
              <RefreshCcw size={16} className="group-hover:rotate-180 transition-transform duration-700" /> 
              Generate
            </button>
        </div>
      </footer>

      {/* --- AUTH GATEKEEPER MODAL --- */}
      {showAuthAlert && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-sm rounded-[48px] p-10 text-center animate-in zoom-in-95 duration-500 shadow-2xl border border-slate-100">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-semibold uppercase tracking-tighter mb-3">Cloud Sync</h3>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest leading-relaxed mb-10 px-2">Sign in to save and organize your generated color systems.</p>
              <div className="flex flex-col gap-3">
                 <button onClick={() => navigate('/signup')} className="w-full py-5 bg-black text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest">Create Account</button>
                 <button onClick={() => navigate('/login')} className="w-full py-5 bg-slate-50 text-black border border-slate-100 rounded-2xl text-[10px] font-bold uppercase tracking-widest">Sign In</button>
                 <button onClick={() => setShowAuthAlert(false)} className="mt-4 text-[9px] font-bold uppercase tracking-[0.3em] text-slate-300 hover:text-black">Guest Mode</button>
              </div>
           </div>
        </div>
      )}

      {/* MODALS */}
      {localVisOpen && <Visualizer onClose={() => setLocalVisOpen(false)} />}
      {localPickerOpen && <ImagePicker onClose={() => setLocalPickerOpen(false)} />}
      {showExport && <ExportModal onClose={() => setShowExport(false)} colors={colors} />}
      {isMockupOpen && <LiveMockup colors={colors} onClose={() => setIsMockupOpen(false)} />}
      {isSaveOpen && (
        <SaveModal 
          isOpen={isSaveOpen} 
          onClose={() => setIsSaveOpen(false)} 
          paletteColors={colors.map(c => c.hex)}
          onSaveSuccess={() => setIsSaveOpen(false)}
        />
      )}
    </div>
  );
};

export default Generatorpage;
