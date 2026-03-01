import React from 'react';
import { Lock, Unlock, Copy, Layers, Check } from 'lucide-react';
import { useColor } from '../../context/ColorContext';

const ColorBar = ({ index, color, onOpenShades }) => {
  const { setColors } = useColor();
  const [copied, setCopied] = React.useState(false);

  // --- LOGIC: CALCULATE ACCESSIBLE TEXT COLOR ---
  const getContrastColor = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? 'text-black' : 'text-white';
  };

  const textColor = getContrastColor(color.hex);

  const toggleLock = () => {
    setColors(prev => prev.map((c, i) => i === index ? { ...c, locked: !c.locked } : c));
  };

  const copyHex = () => {
    navigator.clipboard.writeText(color.hex.toUpperCase());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div 
      className="color-bar flex-1 h-full flex flex-col items-center justify-between py-12 transition-all duration-700 relative group"
      style={{ backgroundColor: color.hex }}
    >
      {/* 1. TOP SECTION: THE DYNAMIC TEXT */}
      <div className={`flex flex-col items-center gap-4 transition-all duration-300 ${textColor}`}>
        <button 
          onClick={copyHex}
          className="flex flex-col items-center group/text active:scale-95 transition-transform"
        >
          <span className="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-1">
            {color.hex.replace('#', '')}
          </span>
          <div className="flex items-center gap-2 opacity-0 group-hover/text:opacity-100 transition-opacity">
            {copied ? <Check size={14} className="text-green-500"/> : <Copy size={12} />}
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {copied ? 'Copied!' : 'Copy'}
            </span>
          </div>
        </button>
      </div>

      {/* 2. MIDDLE SECTION: TOOLBAR */}
      <div className={`flex flex-col gap-6 items-center transition-all duration-500 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 ${textColor}`}>
        <button 
          onClick={() => onOpenShades(color.hex)}
          className="p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all border border-white/10 shadow-xl"
          title="View Shades"
        >
          <Layers size={22} />
        </button>
        
        <button 
          onClick={toggleLock}
          className={`p-5 rounded-[24px] transition-all border-2 shadow-2xl ${
            color.locked 
            ? 'bg-black text-white border-black scale-110' 
            : 'bg-white/10 border-white/20 hover:bg-white/20 backdrop-blur-md'
          }`}
        >
          {color.locked ? <Lock size={24} fill="white" /> : <Unlock size={24} />}
        </button>
      </div>

      {/* 3. BOTTOM SECTION: INDEX LABEL */}
      <div className={`text-[10px] font-black uppercase tracking-[0.3em] opacity-30 ${textColor}`}>
        Color {index + 1}
      </div>
    </div>
  );
};

export default ColorBar;