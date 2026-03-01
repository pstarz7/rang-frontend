import React, { useState } from 'react';
import { 
  X, Download, Copy, Check, Zap, Code2, 
  Smartphone, FileJson, ShieldCheck, ChevronRight, 
  Palette, Terminal, Printer, Globe, RefreshCw
} from 'lucide-react';
import chroma from 'chroma-js';

const ExportModal = ({ onClose, colors = [] }) => {
  const [copiedType, setCopiedType] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  // --- NATIVE 4K ARTIST CARD EXPORT ---
  const downloadArtistCard = () => {
    if (!colors || colors.length === 0) return;
    setIsExporting(true);
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const w = 2000, h = 2800;
    canvas.width = w; canvas.height = h;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.font = '900 100px Inter, sans-serif';
    ctx.fillText('RANG.LAB', w / 2, 220);
    
    ctx.font = '600 28px Inter, sans-serif';
    ctx.letterSpacing = "12px";
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('COLOR PALETTE FOR ARTISTS', w / 2, 290);

    const pad = 120;
    const blockH = (h - 600) / colors.length;

    colors.forEach((col, i) => {
      const hex = col.hex.toUpperCase();
      const y = 400 + (i * blockH);
      const isDark = chroma(hex).luminance() < 0.5;

      ctx.fillStyle = hex;
      ctx.beginPath();
      ctx.roundRect(pad, y, w - (pad * 2), blockH - 40, 40);
      ctx.fill();

      ctx.fillStyle = isDark ? '#FFFFFF' : '#000000';
      ctx.textAlign = 'center';
      ctx.font = 'black 65px Inter, sans-serif';
      ctx.fillText(hex, w / 2, y + (blockH/2) + 20);
    });

    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.download = `Rang-Artist-Palette.png`;
    link.href = dataUrl;
    link.click();
    setIsExporting(false);
  };

  const handleCopy = (type, content) => {
    navigator.clipboard.writeText(content);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  // --- FORMAT LIBRARY (JSON ON TOP) ---
  const formats = [
    { 
      id: 'json', 
      title: 'JSON', 
      icon: <FileJson size={14} />, 
      data: JSON.stringify(colors.map((c, i) => ({ id: i+1, hex: c.hex })), null, 2) 
    },
    { 
      id: 'tailwind', 
      title: 'Tailwind', 
      icon: <Globe size={14} />, 
      data: `colors: { primary: { ${colors.map((c, i) => `${(i+1)*100}: '${c.hex}'`).join(', ')} } }` 
    },
    { 
      id: 'css', 
      title: 'CSS', 
      icon: <Palette size={14} />, 
      data: colors.map((c, i) => `--col-${i+1}: ${c.hex};`).join('\n') 
    },
    { 
      id: 'swift', 
      title: 'SwiftUI', 
      icon: <Smartphone size={14} />, 
      data: colors.map((c, i) => `let c${i+1} = Color(hex: "${c.hex}")`).join('\n') 
    },
    { 
      id: 'kotlin', 
      title: 'Kotlin', 
      icon: <Terminal size={14} />, 
      data: colors.map((c, i) => `val c${i+1} = Color(0xFF${c.hex.replace('#', '')})`).join('\n') 
    },
    { 
      id: 'cmyk', 
      title: 'CMYK', 
      icon: <Printer size={14} />, 
      data: colors.map((c, i) => {
        const cmyk = chroma(c.hex).cmyk().map(v => Math.round(v * 100));
        return `C:${cmyk[0]} M:${cmyk[1]} Y:${cmyk[2]} K:${cmyk[3]}`;
      }).join('\n') 
    }
  ];

  return (
    <div className="fixed inset-0 z-[5000] bg-white md:bg-black/80 md:backdrop-blur-2xl flex items-center justify-center overflow-y-auto">
      <div className="bg-white w-full h-full md:h-auto md:max-w-4xl md:rounded-[50px] overflow-hidden flex flex-col md:flex-row shadow-2xl">
        
        {/* TOP/LEFT: COMPACT PREVIEW */}
        <div className="bg-slate-50 p-6 md:p-12 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100">
          <button onClick={onClose} className="md:hidden absolute top-6 right-6 p-3 bg-white rounded-full shadow-sm"><X size={20}/></button>
          
          <div className="w-full max-w-[280px] md:max-w-sm space-y-2 md:space-y-4">
             <p className="md:hidden text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 text-center mb-4">Current Architecture</p>
            {colors.map((col, i) => (
              <div 
                key={i} 
                className="h-10 md:h-16 w-full rounded-xl md:rounded-2xl shadow-sm flex items-center justify-center group" 
                style={{ backgroundColor: col.hex }}
              >
                <span className="text-[9px] font-black uppercase tracking-widest mix-blend-difference text-white opacity-40 group-hover:opacity-100 transition-opacity">
                  {col.hex}
                </span>
              </div>
            ))}
            <div className="pt-6 text-center">
               <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-black">Rang.Lab</h2>
               <p className="text-[7px] md:text-[8px] font-bold text-slate-300 uppercase tracking-[0.4em] mt-1">Color Palette for Artists</p>
            </div>
          </div>
        </div>

        {/* BOTTOM/RIGHT: COMPACT ACTIONS */}
        <div className="flex-1 p-6 md:p-12 flex flex-col justify-between bg-white overflow-y-auto">
          <header className="hidden md:flex justify-between items-start mb-10">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white"><Zap size={18} fill="currentColor" /></div>
            <button onClick={onClose} className="p-3 hover:bg-slate-50 rounded-full transition-all border border-slate-50"><X size={20} /></button>
          </header>

          <div className="space-y-8 md:space-y-10">
            {/* PRIMARY DOWNLOAD */}
            <div className="space-y-3">
               <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">Studio Export</p>
               <button 
                 onClick={downloadArtistCard}
                 disabled={isExporting}
                 className="w-full py-5 md:py-7 bg-black text-white rounded-[24px] md:rounded-[32px] text-[10px] font-black uppercase tracking-[0.3em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 group"
               >
                 {isExporting ? <RefreshCw className="animate-spin" size={16} /> : <Download size={16} />}
                 Export Visual Card
               </button>
            </div>

            {/* GRID OF COMPACT FORMATS */}
            <div className="space-y-3">
               <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">Quick Copy</p>
               <div className="grid grid-cols-2 gap-2 md:gap-3">
                 {formats.map(f => (
                   <button 
                     key={f.id}
                     onClick={() => handleCopy(f.id, f.data)}
                     className="flex items-center justify-between p-3 md:p-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl hover:border-black transition-all group"
                   >
                     <div className="flex items-center gap-2 md:gap-3">
                        <span className="text-slate-400 group-hover:text-black">{f.icon}</span>
                        <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">{f.title}</span>
                     </div>
                     {copiedType === f.id ? <Check className="text-green-500" size={12} /> : <Copy size={12} className="text-slate-200" />}
                   </button>
                 ))}
               </div>
            </div>
          </div>

          <footer className="pt-8 md:pt-12 flex items-center justify-center gap-3 opacity-20">
             <ShieldCheck size={14} />
             <p className="text-[8px] font-black uppercase tracking-[0.4em]">Neural Artist Verified</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;