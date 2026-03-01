import React, { useState, useRef, useCallback } from 'react';
import { 
  X, Upload, RefreshCw, Zap, Palette, 
  ChevronRight, Check, Loader2, Image as ImageIcon, ShieldCheck 
} from 'lucide-react';
import { useColor } from '../../context/ColorContext';
import chroma from 'chroma-js';

const ImagePicker = ({ onClose }) => {
  const { setColors } = useColor();
  const [image, setImage] = useState(null);
  const [extractedColors, setExtractedColors] = useState([]);
  const [isExtracting, setIsExtracting] = useState(false);
  
  const imgRef = useRef(null);

  // --- THE MASTER NEURAL ENGINE  ---
  const extractElitePalette = useCallback(() => {
    if (!imgRef.current) return;
    setIsExtracting(true);

    setTimeout(() => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = 150;
        canvas.height = 150;
        ctx.drawImage(imgRef.current, 0, 0, 150, 150);

        const data = ctx.getImageData(0, 0, 150, 150).data;
        const colorMap = {};

        for (let i = 0; i < data.length; i += 16) {
          if (data[i + 3] < 128) continue; 
          
          const r = data[i];
          const g = data[i+1];
          const b = data[i+2];
          
          const key = `${Math.round(r/15)*15},${Math.round(g/15)*15},${Math.round(b/15)*15}`;
          
          if (!colorMap[key]) {
            colorMap[key] = { hex: chroma(r,g,b).hex(), count: 0, score: 0 };
          }
          colorMap[key].count++;
        }

        const clusters = Object.values(colorMap).map(c => {
          const color = chroma(c.hex);
          const sat = color.get('hsl.s');
          const lum = color.luminance();
          c.score = (c.count * 0.4) + (sat * 60) + (lum > 0.2 && lum < 0.8 ? 25 : 0);
          return c;
        });

        const finalSelection = clusters
          .sort((a, b) => b.score - a.score)
          .filter((c, i, a) => a.findIndex(t => chroma.distance(t.hex, c.hex) < 22) === i)
          .slice(0, 6) 
          .map(c => c.hex.toUpperCase());

        setExtractedColors(finalSelection.length >= 2 ? finalSelection : ['#0A0A0A', '#333333', '#666666', '#999999', '#CCCCCC']);
      } catch (e) {
        console.error("Neural Extraction Failed", e);
      } finally {
        setIsExtracting(false);
      }
    }, 800);
  }, []);

  const syncToWorkspace = () => {
    if (!extractedColors.length) return;
    const mapped = extractedColors.map(hex => ({
      id: `architect-${Math.random().toString(36).substr(2, 4)}`,
      hex: hex,
      locked: false
    }));
    setColors(mapped);
    onClose();
  };

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target.result);
        setExtractedColors([]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[5000] bg-[#0A0A0A]/95 backdrop-blur-2xl flex items-center justify-center p-0 md:p-12 transition-all selection:bg-white selection:text-black">
      <div className="bg-white w-full max-w-[1300px] h-full md:h-[85vh] rounded-none md:rounded-[60px] overflow-hidden flex flex-col md:flex-row shadow-[0_100px_200px_rgba(0,0,0,0.5)]">
        
        {/* --- LEFT: DYNAMIC ARTBOARD --- */}
        <div className="flex-[1.3] bg-[#F8F9FB] relative flex items-center justify-center p-6 md:p-20 overflow-hidden border-b md:border-b-0 md:border-r border-slate-100">
          <button onClick={onClose} className="md:hidden absolute top-6 right-6 z-50 p-3 bg-white rounded-full shadow-lg border border-slate-100">
            <X size={20} className="text-black" />
          </button>
          
          {!image ? (
            <label className="flex flex-col items-center justify-center cursor-pointer space-y-6 group">
              <div className="w-24 h-24 bg-white rounded-[45px] flex items-center justify-center shadow-2xl border border-slate-100 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                <Upload size={32} className="text-slate-300 group-hover:text-black transition-colors" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-[12px] font-black uppercase tracking-[0.5em] text-black">Import Architecture</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Select pixel data to extract</p>
              </div>
              <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
            </label>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center p-4">
               {isExtracting && (
                  <div className="absolute inset-0 z-50 bg-white/40 backdrop-blur-md flex flex-col items-center justify-center gap-4 rounded-[40px]">
                     <Loader2 className="animate-spin text-black" size={48} />
                     <p className="text-[10px] font-black uppercase tracking-[0.5em] animate-pulse text-black">Neural Mapping</p>
                  </div>
                )}
              <img 
                ref={imgRef} src={image} alt="Source" 
                className="max-w-full max-h-full rounded-[30px] md:rounded-[40px] shadow-[0_50px_100px_rgba(0,0,0,0.1)] object-contain transition-all duration-700"
                onLoad={extractElitePalette}
              />
              <button onClick={() => setImage(null)} className="absolute top-0 right-0 p-4 bg-white/90 backdrop-blur-md rounded-full hover:bg-black hover:text-white transition-all shadow-xl text-black border border-slate-100">
                <RefreshCw size={18}/>
              </button>
            </div>
          )}
        </div>

        {/* --- RIGHT: CONTROL SYSTEM --- */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-between bg-white overflow-y-auto">
          <header className="hidden md:flex justify-between items-start mb-14">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 italic">Spectrum Logic v7.0</span>
              </div>
              <h2 className="text-6xl font-black italic uppercase tracking-tighter leading-none text-black">Studio <br/> Picker.</h2>
            </div>
            <button onClick={onClose} className="p-4 hover:bg-black hover:text-white rounded-full transition-all border border-slate-100 text-black">
              <X size={28} />
            </button>
          </header>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 space-y-12">
            <div className="space-y-6">
               <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-300 italic border-l-2 border-black pl-4">Extracted Pixels</p>
               <div className="grid grid-cols-3 gap-3 md:gap-4">
                 {isExtracting ? (
                   [...Array(6)].map((_, i) => (
                     <div key={i} className="aspect-square bg-slate-50 animate-pulse rounded-[24px] md:rounded-[32px]" />
                   ))
                 ) : (
                   extractedColors.map((hex, i) => (
                     <div key={i} className="group relative">
                       <div 
                         className="aspect-square rounded-[24px] md:rounded-[32px] shadow-sm transition-all duration-500 hover:scale-105 active:scale-90 border border-black/5 cursor-pointer" 
                         style={{ backgroundColor: hex }} 
                       />
                       <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-white mix-blend-difference opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest pointer-events-none">
                         {hex}
                       </span>
                     </div>
                   ))
                 )}
               </div>
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="pt-10 space-y-6">
            <button 
              onClick={syncToWorkspace}
              disabled={!image || isExtracting || extractedColors.length === 0}
              className="w-full py-6 md:py-8 bg-[#0A0A0A] text-white rounded-[25px] md:rounded-[35px] text-[11px] font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:bg-blue-600 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-20 group flex items-center justify-center gap-4"
            >
              Transfer to Lab <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex items-center justify-center gap-3 opacity-20">
               <ShieldCheck size={16} className="text-black" />
               <p className="text-[9px] font-black uppercase tracking-widest text-black text-center leading-none">Rang.Lab Architecture Verified</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePicker;