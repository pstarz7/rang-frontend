import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Zap, Palette, Layers, Smartphone, MoveRight,
  Maximize2, ShieldCheck, Sparkles, RefreshCw,
  Layout, Copy, Eye, PenTool, Brackets, Camera, 
  Fingerprint, ArrowDown, Globe2, Command
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// --- STABLE IMPORT ---
import Navbar from './Navbar'; 

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const navigate = useNavigate();
  const [studioColor, setStudioColor] = useState('#6366F1');
  const [miniPalette, setMiniPalette] = useState(['#FF5F6D', '#FFC371', '#2193B0', '#6DD5ED', '#EE9CA7']);
  
  const heroRef = useRef(null);
  const titleRef = useRef(null);

  // --- NEURAL MINI GENERATOR LOGIC ---
  const generateMiniPalette = () => {
    const chars = '0123456789ABCDEF';
    const newPalette = miniPalette.map(() => {
      let color = '#';
      for (let i = 0; i < 6; i++) color += chars[Math.floor(Math.random() * 16)];
      return color;
    });
    setMiniPalette(newPalette);
    gsap.fromTo(".palette-strip", 
      { scaleY: 0, opacity: 0 }, 
      { scaleY: 1, opacity: 1, duration: 0.8, stagger: 0.1, ease: "expo.out" }
    );
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 100, opacity: 0, duration: 1.5, ease: "power4.out", skewY: 5
      });
      gsap.from(".hero-element", {
        y: 40, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out", delay: 0.5
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-black font-sans selection:bg-black selection:text-white overflow-x-hidden">
      <Navbar />

      {/* --- SECTION 1: HERO --- */}
      <section ref={heroRef} className="relative pt-44 pb-32 px-6 md:px-20 bg-[#6366F1] text-white rounded-b-[60px] md:rounded-b-[100px] shadow-2xl transition-colors duration-1000" style={{ backgroundColor: studioColor }}>
        <div className="max-w-[1600px] mx-auto">
          <div className="hero-element inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-12">
             <Sparkles size={14} className="text-white" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em]">Beta v1.0 Architectural Release</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-8 text-center md:text-left">
              <h1 ref={titleRef} className="text-[15vw] lg:text-[12vw] font-black leading-[0.75] tracking-tighter uppercase italic">
                Rang <br/> 
                <span className="opacity-40">Studio.</span>
              </h1>
              <p className="hero-element mt-12 text-xl md:text-3xl font-medium max-w-2xl leading-tight text-white/80">
RangLab is your creative playground to generate, explore, organize, and visualize color — built for artists, designers, developers, and visual thinkers.              </p>
              <div className="hero-element flex flex-wrap gap-6 pt-12 justify-center md:justify-start">
                <button onClick={() => navigate('/generate')} className="px-12 py-8 bg-white text-black rounded-[35px] font-black uppercase text-[12px] tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-2xl">
                  Launch Lab
                </button>
                <div className="flex flex-col items-center md:items-start justify-center">
                   <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Atmosphere</p>
                   <div className="flex gap-2 mt-2">
                      {['#6366F1', '#000000', '#EC4899', '#F59E0B', '#10B981'].map(c => (
                        <button key={c} onClick={() => setStudioColor(c)} className="w-6 h-6 rounded-full border-2 border-white/20 hover:scale-125 transition-transform" style={{ backgroundColor: c }} />
                      ))}
                   </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 hidden lg:block">
               <div className="w-full aspect-square bg-white/5 rounded-[60px] border border-white/10 flex items-center justify-center animate-pulse">
                  <Fingerprint size={200} className="text-white/10" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: THE SUITE (FIXED RESPONSIVE ALIGNMENT) --- */}
      <section className="py-44 px-6 md:px-20">
        <div className="max-w-[1400px] mx-auto space-y-20 text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
             <h2 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-none">The <br className="hidden md:block"/> Toolkit.</h2>
             <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-300 md:max-w-xs md:text-right">Beta Access: All Features Unlocked</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureBox title="Generator" icon={<Zap/>} bg="bg-[#E0E7FF]" color="text-[#4338CA]" desc="LCH-Weighted engine for mathematically perfect harmonies." />
            <FeatureBox title="Explore" icon={<Globe2/>} bg="bg-[#FFEDD5]" color="text-[#C2410C]" desc="Community-curated library with over 10M+ design schemes." />
            <FeatureBox title="Extractor" icon={<Maximize2/>} bg="bg-[#D1FAE5]" color="text-[#047857]" desc="Deep-pixel cluster analysis from architectural source images." />
            <FeatureBox title="Collage" icon={<Camera/>} bg="bg-[#FFE4E6]" color="text-[#BE123C]" desc="Studio-grade mood boards and presentation asset generator." />
            <FeatureBox title="Visualizer" icon={<Layout/>} bg="bg-[#DBEAFE]" color="text-[#1D4ED8]" desc="See your colors in demo UI and mood boards." />
            <FeatureBox title="A11y Audit" icon={<ShieldCheck/>} bg="bg-[#F3F4F6]" color="text-[#374151]" desc="Automated WCAG contrast checking for professional accessibility." />
          </div>
        </div>
      </section>

      {/* --- SECTION 3: WORKFLOW MANUAL --- */}
      <section className="py-44 px-6 md:px-20 bg-black text-white rounded-[60px] md:rounded-[100px] mx-4 md:mx-10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <header className="mb-28 space-y-6 text-center md:text-left">
             <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center mb-10 shadow-2xl shadow-blue-500/40 mx-auto md:mx-0">
                <Command size={24} />
             </div>
             <h2 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">Workflow <br className="hidden md:block"/> Manual.</h2>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-24 text-center md:text-left">
             <Step num="01" title="Generate" desc="Instantly create beautiful, balanced color palettes. From soft pastels to bold brand systems. discover combinations that just feel right." />
             <Step num="02" title="Extract" desc="Upload any image and pull out the colors hidden inside it. Turn inspiration from the real world into usable design systems." />
             <Step num="03" title="Visualize" desc="See your colors in action before you use them. Preview palettes on UI screens, posters, branding mockups, and more." />
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
      </section>

      {/* --- SECTION 4: NEURAL SANDBOX (BUTTON REPOSITIONED) --- */}
      <section className="py-44 px-6 md:px-20">
         <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 space-y-10 text-center md:text-left">
               <h3 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.85]">Neural <br className="hidden md:block"/> Sandbox.</h3>
               <p className="text-lg font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Visual hierarchy through mathematics.</p>
               <button onClick={generateMiniPalette} className="hidden lg:flex px-12 py-6 bg-black text-white rounded-3xl text-[11px] font-black uppercase tracking-[0.3em] items-center gap-4 hover:bg-blue-600 transition-all shadow-2xl active:scale-95">
                  <RefreshCw size={18}/> Refresh Sandbox
               </button>
            </div>
            
            <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="h-[450px] md:h-[550px] flex gap-3 md:gap-4">
                    {miniPalette.map((c, i) => (
                    <div key={i} className="palette-strip flex-1 h-full rounded-[30px] md:rounded-[40px] shadow-2xl relative group overflow-hidden cursor-crosshair transition-all duration-700 hover:flex-[4]" style={{ backgroundColor: c }}>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                            <span className="text-xs font-black mix-blend-difference text-white uppercase tracking-widest rotate-90">{c}</span>
                        </div>
                    </div>
                    ))}
                </div>
                {/* Mobile/Tablet Refresh Button - Centered below palette */}
                <button onClick={generateMiniPalette} className="lg:hidden w-full py-7 bg-black text-white rounded-[30px] text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 active:scale-95 transition-all">
                    <RefreshCw size={18}/> Refresh Sandbox
                </button>
            </div>
         </div>
      </section>

      {/* --- SECTION 5: FINAL CTA --- */}
      <section className="py-60 px-6 text-center">
        <div className="space-y-12">
          <h2 className="text-7xl md:text-[11vw] font-black uppercase italic leading-[0.75] tracking-tighter">
          Start with Color. go<br/>Anywhere.
          </h2>
          <Link to="/signup" className="inline-block px-16 py-8 bg-black text-white rounded-full text-[12px] font-black uppercase tracking-[0.5em] shadow-[0_40px_80px_rgba(0,0,0,0.3)] hover:scale-110 active:scale-95 transition-all">
             Studio Access
          </Link>
          <p className="text-slate-300 text-[9px] font-black uppercase tracking-[0.4em]">Limited Beta Capacity • Version 1.0.4</p>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-24 px-6 md:px-20 border-t border-slate-100 bg-[#F8F9FB]">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-14 text-center md:text-left">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center text-white shadow-lg"><Palette size={20} /></div>
             <span className="text-3xl font-black italic tracking-tighter uppercase">Rang.Lab</span>
          </div>
          <div className="flex gap-10 text-[11px] font-black uppercase tracking-widest text-slate-400">
            <Link to="/generate" className="hover:text-black transition-colors">Generator</Link>
            <Link to="/explore" className="hover:text-black transition-colors">Explore</Link>
            <Link to="/collage" className="hover:text-black transition-colors">Studio</Link>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 italic">© 2026 Built in Pstarz Lab</p>
        </div>
      </footer>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const FeatureBox = ({ title, icon, bg, color, desc }) => (
  <div className={`p-10 md:p-12 rounded-[50px] ${bg} border border-black/5 flex flex-col gap-10 transition-all duration-500 hover:scale-[1.03] group hover:shadow-xl text-center md:text-left`}>
    <div className={`w-14 h-14 bg-white rounded-2xl flex items-center justify-center ${color} shadow-sm group-hover:rotate-12 transition-all duration-500 mx-auto md:mx-0`}>
       {React.cloneElement(icon, { size: 28 })}
    </div>
    <div className="space-y-4">
      <h4 className="text-3xl font-black uppercase italic tracking-tighter text-black">{title}</h4>
      <p className="text-[11px] font-bold text-black/40 uppercase leading-relaxed tracking-widest">{desc}</p>
    </div>
  </div>
);

const Step = ({ num, title, desc }) => (
  <div className="space-y-8 group">
     <div className="flex items-center gap-4">
        <span className="text-6xl font-black italic text-white/5 transition-colors group-hover:text-blue-500">{num}</span>
        <div className="h-px flex-1 bg-white/10 group-hover:bg-blue-500 transition-all" />
     </div>
     <h4 className="text-4xl font-black uppercase italic tracking-tighter">{title}.</h4>
     <p className="text-[11px] font-bold text-white/30 uppercase tracking-[0.3em] leading-relaxed max-w-xs mx-auto md:mx-0">{desc}</p>
  </div>
);

export default LandingPage;