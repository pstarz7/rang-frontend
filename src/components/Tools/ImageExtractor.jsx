import React, { useState, useRef } from 'react';
import { Upload, Download, RefreshCw, Zap, Image as ImageIcon, Palette, Check, Loader2 } from 'lucide-react';
import chroma from 'chroma-js';

const ImageExtractor = () => {
  const [image, setImage] = useState(null);
  const [palette, setPalette] = useState([]);
  const [layout, setLayout] = useState('horizontal');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  
  const imgRef = useRef(null);

  // --- THE NEURAL EXTRACTION ENGINE (K-MEANS LOGIC) ---
  const extractElitePalette = () => {
    if (!imgRef.current) return;
    setIsProcessing(true);

    // Artificial delay for UI "Neural Analysis" feel
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
          
          // This prevents getting 5 versions of the same blue
          const key = `${Math.round(r/15)*15},${Math.round(g/15)*15},${Math.round(b/15)*15}`;
          
          if (!colorMap[key]) colorMap[key] = { hex: chroma(r,g,b).hex(), count: 0, score: 0 };
          colorMap[key].count++;
        }

        const clusters = Object.values(colorMap).map(c => {
          const color = chroma(c.hex);
          // Scoring system: Favor saturation and medium-high luminance
          const sat = color.get('hsl.s');
          const lum = color.luminance();
          c.score = (c.count * 0.3) + (sat * 50) + (lum > 0.2 && lum < 0.8 ? 30 : 0);
          return c;
        });

        const finalPalette = clusters
          .sort((a, b) => b.score - a.score)
          .filter((c, i, a) => a.findIndex(t => chroma.distance(t.hex, c.hex) < 20) === i)
          .slice(0, 5)
          .map(c => c.hex.toUpperCase());

        setPalette(finalPalette.length >= 2 ? finalPalette : ['#0A0A0A', '#333333', '#666666', '#999999', '#CCCCCC']);
      } catch (e) {
        console.error("Extraction Failed");
      } finally {
        setIsProcessing(false);
      }
    }, 800);
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target.result);
        setPalette([]);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- THE MASTER EXPORT ENGINE  ---
  const downloadCollage = () => {
    if (!imgRef.current || palette.length === 0) return;
    setIsProcessing(true);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const exportWidth = 2400;
    const exportHeight = layout === 'horizontal' ? 3200 : 1600;
    canvas.width = exportWidth;
    canvas.height = exportHeight;

    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, exportWidth, exportHeight);

    // Padding & Area
    const pad = 100;
    const imgAreaWidth = exportWidth - (pad * 2);
    const imgAreaHeight = (exportHeight * 0.75) - (pad * 2);

    const img = imgRef.current;
    const ratio = Math.min(imgAreaWidth / img.naturalWidth, imgAreaHeight / img.naturalHeight);
    
    const finalW = img.naturalWidth * ratio;
    const finalH = img.naturalHeight * ratio;
    const startX = (exportWidth - finalW) / 2;
    const startY = 250; // Space for Logo at top

    // Draw Image
    ctx.drawImage(img, startX, startY, finalW, finalH);

    // Palette Section
    const paletteY = startY + finalH + 120;
    const blockSize = (exportWidth - (pad * 2) - (40 * 4)) / 5;

    palette.forEach((color, i) => {
      ctx.fillStyle = color;
      const x = pad + (i * (blockSize + 40));
      ctx.beginPath();
      ctx.roundRect(x, paletteY, blockSize, blockSize * 1.3, 30);
      ctx.fill();

      // Hex Labels
      ctx.fillStyle = chroma(color).luminance() > 0.5 ? '#000000' : '#FFFFFF';
      ctx.font = 'bold 36px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(color, x + (blockSize/2), paletteY + (blockSize * 1.1));
    });

    // --- REFINED LOGO BRANDING ---
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.font = '900 80px Inter, sans-serif';
    ctx.fillText('RANG.LAB', exportWidth / 2, 130);
    ctx.font = '500 24px Inter, sans-serif';
    ctx.letterSpacing = "10px";
    ctx.fillText('Color Palette for Artists', exportWidth / 2, 180);

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `Rang-Lab-Studio-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
    
    setIsDownloaded(true);
    setIsProcessing(false);
    setTimeout(() => setIsDownloaded(false), 3000);
  };

  return (
    <div className="pt-32 pb-20 px-6 md:px-20 min-h-screen bg-[#FDFDFF] font-sans selection:bg-black selection:text-white">
      <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        
        {/* --- CONTROL PANEL --- */}
        <div className="lg:col-span-4 space-y-12">
          <header className="space-y-4">
            <div className="flex items-center gap-3 text-black">
              <Zap size={14} fill="currentColor" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Collage System v8.0</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.9]">Visual <br/> Architect.</h1>
          </header>

          <div className="space-y-6">
            <label className="block w-full p-12 bg-white border-2 border-dashed border-slate-200 rounded-[50px] text-center cursor-pointer hover:border-black transition-all group relative overflow-hidden">
              <Upload className="mx-auto mb-4 text-slate-300 group-hover:text-black transition-all" size={40} />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Upload Source</p>
              <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
            </label>

            <button 
              onClick={downloadCollage}
              disabled={!image || isProcessing}
              className={`w-full py-8 rounded-[32px] text-[11px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 shadow-2xl ${
                isDownloaded ? 'bg-green-600 text-white shadow-green-200' : 'bg-black text-white hover:bg-indigo-600'
              } disabled:opacity-20`}
            >
              {isProcessing ? <Loader2 className="animate-spin" size={20} /> : isDownloaded ? <Check size={20} /> : <Download size={20} />}
              {isProcessing ? "Analyzing Pixels..." : isDownloaded ? "Studio Exported" : "Download PNG Asset"}
            </button>
          </div>
        </div>

        {/* --- PREVIEW CANVAS --- */}
        <div className="lg:col-span-8">
          {image ? (
            <div className="relative">
              <div className="bg-white p-10 rounded-[60px] shadow-[0_80px_150px_rgba(0,0,0,0.08)] flex flex-col gap-8 relative overflow-hidden">
                
                {/* LOADER OVERLAY */}
                {isProcessing && (
                  <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center gap-4">
                     <Loader2 className="animate-spin text-black" size={48} />
                     <p className="text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Running Neural Analysis</p>
                  </div>
                )}

                <div className="aspect-video rounded-[40px] overflow-hidden relative shadow-inner bg-slate-50">
                  <img 
                    ref={imgRef} src={image} alt="Source" 
                    className="w-full h-full object-cover"
                    onLoad={extractElitePalette}
                    crossOrigin="anonymous" 
                  />
                  <div className="absolute top-8 left-8 flex items-center gap-4 px-6 py-3 bg-white/95 backdrop-blur-xl rounded-full shadow-2xl border border-black/5">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Rang.Lab Preview</span>
                  </div>
                </div>

                <div className="flex flex-row gap-4 h-32 md:h-48">
                  {palette.map((hex, i) => (
                    <div 
                      key={i} 
                      className="flex-1 rounded-[30px] flex items-center justify-center transition-all hover:flex-[1.5] cursor-pointer shadow-sm" 
                      style={{ backgroundColor: hex }}
                    >
                      <span className="text-[10px] font-black text-white mix-blend-difference uppercase tracking-widest opacity-0 hover:opacity-100 transition-opacity">
                        {hex}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[700px] border-2 border-dashed border-slate-100 rounded-[80px] flex flex-col items-center justify-center bg-white">
              <ImageIcon size={40} className="text-slate-200 mb-6" />
              <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-300">Awaiting Architectural Source</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageExtractor;