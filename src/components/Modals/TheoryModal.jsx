import React, { useEffect, useRef } from 'react';
import { X, BookOpen, Target, Zap, Droplets, Sun, Palette } from 'lucide-react';
import { gsap } from 'gsap';

const TheoryModal = ({ isOpen, onClose, topic }) => {
  const modalRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const ctx = gsap.context(() => {
        gsap.fromTo(modalRef.current, 
          { opacity: 0, backdropFilter: "blur(0px)" }, 
          { opacity: 1, backdropFilter: "blur(20px)", duration: 0.4 }
        );
        gsap.fromTo(contentRef.current, 
          { y: 100, opacity: 0, scale: 0.9, skewY: 2 }, 
          { y: 0, opacity: 1, scale: 1, skewY: 0, duration: 0.8, ease: "power4.out", delay: 0.1 }
        );
      });
      return () => ctx.revert();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const theoryData = {
    "Tints & Shades": {
      icon: <Droplets className="text-blue-500" />,
      title: "Tonal Architecture",
      desc: "Understanding how to scale a single hue into a full production system.",
      content: "A Tint is created by adding White to a pure hue, increasing its lightness. A Shade is created by adding Black, increasing its darkness. In UI design, Tints are used for backgrounds and hover states, while Shades provide depth and contrast for text.",
      example: ['#DBEAFE', '#60A5FA', '#1E40AF']
    },
    "Color Harmony": {
      icon: <Palette className="text-pink-500" />,
      title: "Harmonic Physics",
      desc: "The mathematical balance between different positions on the color wheel.",
      content: "Complementary colors sit opposite each other, creating maximum tension and energy. Analogous colors sit next to each other, creating a sense of calm and nature. Mastering these ratios is the key to professional branding.",
      example: ['#F43F5E', '#FB923C', '#FACC15']
    },
    "Luminance": {
      icon: <Sun className="text-amber-500" />,
      title: "Perceived Brightness",
      desc: "How the human eye calculates light independently of Hue or Saturation.",
      content: "Luminance (Y) is the most critical factor for accessibility. Two different colors might have the same saturation but different luminance. We use the WCAG 2.1 algorithm to ensure your text is always readable against your chosen background.",
      example: ['#FFFFFF', '#94A3B8', '#0F172A']
    }
  };

  const current = theoryData[topic] || theoryData["Tints & Shades"];

  return (
    <div ref={modalRef} className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/40">
      <div ref={contentRef} className="bg-white w-full max-w-4xl rounded-[60px] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.2)] border border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-12 h-full">
          
          {/* Left Panel: Visual Example */}
          <div className="md:col-span-5 bg-slate-50 p-12 flex flex-col justify-between border-r border-slate-100">
            <div className="space-y-6">
               <div className="w-16 h-16 bg-white rounded-[24px] flex items-center justify-center shadow-sm">
                  {current.icon}
               </div>
               <h3 className="text-4xl font-black uppercase italic tracking-tighter leading-none">{current.title}</h3>
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{current.desc}</p>
            </div>

            <div className="space-y-4">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">Live Scale Example</p>
              <div className="flex h-32 rounded-[24px] overflow-hidden">
                {current.example.map((col, i) => (
                  <div key={i} className="flex-1" style={{ backgroundColor: col }} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Detailed Info */}
          <div className="md:col-span-7 p-12 md:p-20 flex flex-col justify-center relative">
            <button onClick={onClose} className="absolute top-10 right-10 p-4 hover:bg-slate-50 rounded-full transition-colors">
              <X size={24} />
            </button>
            
            <div className="space-y-10">
              <div className="flex items-center gap-3">
                 <BookOpen size={16} className="text-blue-500" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Curated Manual</span>
              </div>
              <p className="text-xl font-bold leading-relaxed text-slate-600 italic">
                {current.content}
              </p>
              <button 
                onClick={onClose}
                className="px-10 py-5 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
              >
                Continue Architecting
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TheoryModal;