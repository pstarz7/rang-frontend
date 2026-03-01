import React, { useState, useEffect, useCallback } from 'react';
import { 
  Eye, Pipette, Lock, Unlock, RefreshCcw, Copy, 
  Check, Layers, Download, Save, X, Sparkles, 
  Smartphone, Layout, Palette, AlertCircle, LogIn, UserPlus
} from 'lucide-react';
import { useColor } from '../context/ColorContext';
import { useAuth } from '../context/AuthContext'; // Import Auth for the Gatekeeper
import { useNavigate } from 'react-router-dom';
import chroma from 'chroma-js';

// Tool Components
import Visualizer from '../components/Visualizer/Visualizer';
import ImagePicker from '../components/Tools/ImagePicker';
import ExportModal from '../components/Tools/ExportModal';
import SaveModal from '../components/Modals/SaveModal';
import LiveMockup from '../components/Visualizer/LiveMockup';

const Generatorpage = () => {
  const { user } = useAuth(); // Hook into Auth State
  const navigate = useNavigate();
  
  const { 
    colors, 
    setColors, 
    isVisualizerOpen: contextVisOpen, 
    setIsVisualizerOpen: setContextVisOpen,
    isPickerOpen: contextPickerOpen, 
    setIsPickerOpen: setContextPickerOpen 
  } = useColor();

  // --- LOCAL UI STATE ---
  const [localVisOpen, setLocalVisOpen] = useState(false);
  const [localPickerOpen, setLocalPickerOpen] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [isMockupOpen, setIsMockupOpen] = useState(false);
  const [activeShadeIndex, setActiveShadeIndex] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  
  // New State for Auth Alert Card
  const [showAuthAlert, setShowAuthAlert] = useState(false);

  // --- GATEKEEPER LOGIC ---
  const handleSaveAttempt = () => {
    if (!user) {
      setShowAuthAlert(true); // Show custom A11y Card if not logged in
    } else {
      setIsSaveOpen(true); // Open Save Modal if logged in
    }
  };

  // --- CORE GENERATION ENGINE ---
  const refreshPalette = useCallback(() => {
    const newColors = colors.map(col => {
      if (col.locked) return col;
      return { 
        id: `col-${Math.random().toString(36).substr(2, 9)}`, 
        hex: chroma.random().hex().toUpperCase(), 
        locked: false 
      };
    });
    setColors(newColors);
  }, [colors, setColors]);

  const getContrastColor = (hex) => {
    return chroma(hex).luminance() > 0.5 ? '#000000' : '#FFFFFF';
  };

  const getShades = (hex) => {
    return chroma.scale(['#fff', hex, '#000']).mode('lch').colors(12);
  };

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
    <div className="h-screen flex flex-col bg-white overflow-hidden font-sans selection:bg-black selection:text-white">
      
      {/* --- MAIN INTERFACE --- */}
      <main className="flex-1 flex flex-col md:flex-row w-full overflow-hidden" role="main">
        {colors.map((color, index) => {
          const textColor = getContrastColor(color.hex);
          const isShadeActive = activeShadeIndex === index;

          return (
            <div 
              key={index}
              className="flex-1 flex flex-row md:flex-col items-center justify-between md:justify-center p-6 md:p-0 transition-all duration-700 relative group"
              style={{ backgroundColor: color.hex }}
            >
              <div className="flex md:flex-col gap-1 md:gap-3 order-2 md:order-1 md:mb-12 z-20 md:opacity-0 group-hover:opacity-100 transition-all duration-300">
                <button 
                  onClick={() => {
                    const updated = [...colors];
                    updated[index].locked = !updated[index].locked;
                    setColors(updated);
                  }} 
                  aria-label={color.locked ? "Unlock Color" : "Lock Color"}
                  className="p-4 rounded-2xl hover:bg-black/10 transition-all" 
                  style={{ color: textColor }}
                >
                  {color.locked ? <Lock size={22} strokeWidth={2.5} /> : <Unlock size={22} strokeWidth={2.5} className="opacity-40" />}
                </button>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(color.hex);
                    setCopiedIndex(index);
                    setTimeout(() => setCopiedIndex(null), 1500);
                  }} 
                  aria-label="Copy Hex Code"
                  className="p-4 rounded-2xl hover:bg-black/10 transition-all" 
                  style={{ color: textColor }}
                >
                  {copiedIndex === index ? <Check size={22} /> : <Copy size={22} />}
                </button>
                <button 
                  onClick={() => setActiveShadeIndex(index)} 
                  aria-label="View Shades"
                  className="p-4 rounded-2xl hover:bg-black/10 transition-all" 
                  style={{ color: textColor }}
                >
                  <Layers size={22} />
                </button>
              </div>

              <div className="flex flex-col items-start md:items-center order-1 md:order-2 z-20">
                <h2 className="text-2xl md:text-5xl font-black uppercase italic tracking-tighter" style={{ color: textColor }}>
                  {color.hex.replace('#', '')}
                </h2>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mt-2 flex items-center gap-2" style={{ color: textColor }}>
                   <Palette size={10} /> {chroma(color.hex).name()}
                </span>
              </div>

              {isShadeActive && (
                <div className="absolute inset-0 z-50 flex flex-col bg-white animate-in slide-in-from-bottom duration-500">
                  <div className="flex items-center justify-between p-8 border-b border-slate-100 bg-white">
                    <span className="text-[10px] font-black uppercase tracking-widest">{color.hex} Tonal Intensity</span>
                    <button onClick={() => setActiveShadeIndex(null)} className="p-3 bg-slate-100 hover:bg-black hover:text-white rounded-full transition-all">
                      <X size={18}/>
                    </button>
                  </div>
                  <div className="flex-1 flex flex-col overflow-y-auto">
                    {getShades(color.hex).map((shadeHex, i) => (
                      <div 
                        key={i} 
                        className="flex-1 min-h-[45px] flex items-center justify-center cursor-pointer hover:flex-[3] transition-all group border-b border-white/5"
                        style={{ backgroundColor: shadeHex }}
                        onClick={() => selectNewShade(index, shadeHex)}
                      >
                         <span className="text-[10px] font-black opacity-0 group-hover:opacity-100 uppercase tracking-widest bg-white/20 backdrop-blur-md px-4 py-1 rounded-full" style={{ color: getContrastColor(shadeHex) }}>
                            {shadeHex}
                         </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </main>

      {/* --- UTILITY FOOTER --- */}
      <footer className="h-24 bg-white border-t border-slate-100 px-4 md:px-12 flex items-center justify-between z-[60] relative shadow-2xl">
        <div className="flex items-center gap-2 md:gap-3">
            <button onClick={() => setLocalPickerOpen(true)} className="flex items-center gap-3 px-4 md:px-6 py-4 bg-slate-50 hover:bg-black hover:text-white rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all">
              <Pipette size={18} /> <span className="hidden lg:inline">Image Picker</span>
            </button>
            <button onClick={() => setLocalVisOpen(true)} className="flex items-center gap-3 px-4 md:px-6 py-4 bg-slate-50 hover:bg-black hover:text-white rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all">
              <Eye size={18} /> <span className="hidden lg:inline">Visualizer</span>
            </button>
            <button onClick={() => setIsMockupOpen(true)} className="flex items-center gap-3 px-4 md:px-6 py-4 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all">
              <Smartphone size={18} /> <span className="hidden lg:inline">Mockup</span>
            </button>
        </div>

        <div className="flex items-center gap-1 md:gap-3">
            <button onClick={handleSaveAttempt} aria-label="Save to Library" className="p-4 text-slate-400 hover:text-black hover:bg-slate-50 rounded-2xl transition-all active:scale-90">
              <Save size={20} />
            </button>
            <button onClick={() => setShowExport(true)} aria-label="Export Palette" className="p-4 text-slate-400 hover:text-black hover:bg-slate-50 rounded-2xl transition-all active:scale-90">
              <Download size={20} />
            </button>
            <div className="w-[1px] h-8 bg-slate-100 mx-1" />
            <button 
              onClick={refreshPalette}
              className="flex items-center gap-3 md:gap-4 px-6 md:px-12 py-4 bg-black text-white rounded-[20px] text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              <RefreshCcw size={18} /> <span className="hidden sm:inline">Generate</span>
            </button>
        </div>
      </footer>

      {/* --- A11Y AUTH ALERT CARD --- */}
      {showAuthAlert && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-sm rounded-[40px] p-10 shadow-[0_50px_100px_rgba(0,0,0,0.3)] text-center animate-in zoom-in-95 duration-500">
              <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-3">Account Required</h3>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed mb-10 px-4">
                You need an account to use these features. Create an account to save your color palettes and organize your projects.
           </p>
              <div className="flex flex-col gap-3">
                 <button onClick={() => navigate('/login')} className="w-full py-5 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all">
                    <LogIn size={16} /> Sign Up
                 </button>
                 <button onClick={() => navigate('/signup')} className="w-full py-5 bg-slate-50 text-black border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-100 transition-all">
                    <UserPlus size={16} /> Log In
                 </button>
                 <button onClick={() => setShowAuthAlert(false)} className="mt-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 hover:text-black transition-colors">
                    Continue as Guest
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* --- MODALS --- */}
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
