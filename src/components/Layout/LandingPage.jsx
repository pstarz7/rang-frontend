import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Zap, Palette, Layers, Smartphone, MoveRight,
  Maximize2, ShieldCheck, Sparkles, RefreshCw,
  Layout, Copy, Eye, PenTool, Brackets, Camera, 
  Fingerprint, ArrowDown, Globe2, Command, Lock, Unlock,
  Heart, Github, Hexagon, Binary, Radio, MousePointer2,
  CheckCircle2, MessageCircle, Instagram, Code
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './Navbar'; 

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const navigate = useNavigate();
  const [studioColor, setStudioColor] = useState('#6366F1');
  const [miniPalette, setMiniPalette] = useState(['#FF5F6D', '#FFC371', '#2193B0', '#6DD5ED', '#EE9CA7']);
  
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const shadeRef = useRef(null);

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
      { scaleY: 0, opacity: 0, filter: "blur(10px)" }, 
      { scaleY: 1, opacity: 1, filter: "blur(0px)", duration: 0.8, stagger: 0.05, ease: "expo.out" }
    );
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, { y: 80, opacity: 0, duration: 1.2, ease: "power4.out" });
      gsap.from(".hero-element", { y: 30, opacity: 0, duration: 1, stagger: 0.15, ease: "power3.out", delay: 0.4 });
      
      // Scroll Reveal for Shade Section
      gsap.from(".shade-box", {
        scrollTrigger: { trigger: shadeRef.current, start: "top 80%" },
        opacity: 0,
        y: 50,
        stagger: 0.1,
        duration: 1,
        ease: "power2.out"
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-black font-sans selection:bg-black selection:text-white overflow-x-hidden">
      <Navbar />

      {/* --- SECTION 1: HERO --- */}
      <section ref={heroRef} className="relative pt-44 pb-32 px-6 md:px-20 text-white rounded-b-[60px] md:rounded-b-[100px] shadow-2xl transition-colors duration-1000" style={{ backgroundColor: studioColor }}>
        <div className="max-w-[1600px] mx-auto relative z-10 text-center md:text-left">
          <div className="hero-element inline-flex items-center gap-3 px-5 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-12 cursor-default hover:bg-white/20 transition-all">
             <Sparkles size={14} className="text-white animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em]">Artist Edition • Free Beta v1.0</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-8">
              <h1 ref={titleRef} className="text-[16vw] lg:text-[12vw] font-black leading-[0.8] tracking-tighter uppercase italic">
                Rang <br/> <span className="opacity-40">Studio.</span>
              </h1>
              <p className="hero-element mt-12 text-xl md:text-3xl font-medium max-w-2xl leading-snug text-white/90 mx-auto md:mx-0">
                A playground for artists to find, feel, and save the perfect colors. Built to turn your visual ideas into reality.
              </p>
              
              <div className="hero-element flex flex-wrap gap-4 pt-12 justify-center md:justify-start">
                <button onClick={() => navigate('/generate')} className="px-12 py-7 bg-white text-black rounded-[30px] font-black uppercase text-[11px] tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-3">
                  Open Studio <Zap size={16} fill="currentColor" />
                </button>
                <button onClick={() => navigate('/explore')} className="px-12 py-7 bg-black/20 border border-white/20 rounded-[30px] font-black uppercase text-[11px] tracking-[0.3em] hover:bg-white hover:text-black transition-all active:scale-95">
                  See Collections
                </button>
              </div>
            </div>
            <div className="lg:col-span-4 hidden lg:block hero-element">
               <div className="w-full aspect-square bg-white/5 rounded-[60px] border border-white/10 flex items-center justify-center group overflow-hidden">
                  <Palette size={200} className="text-white/10 rotate-[25deg] group-hover:rotate-[45deg] transition-transform duration-1000" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: ACCESS PRIVILEGES --- */}
      <section className="py-32 px-6 md:px-20">
        <div className="max-w-7xl mx-auto">
          <header className="mb-20 text-center md:text-left">
             <h2 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter text-black">Access.</h2>
             <p className="text-slate-400 mt-4 font-bold uppercase text-[10px] tracking-[0.4em]">One Lab, two ways to create</p>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="p-10 rounded-[50px] bg-slate-50 border border-slate-100 group hover:border-black transition-all duration-500">
                <Unlock size={32} className="text-slate-300 mb-8" />
                <h4 className="text-3xl font-black uppercase italic tracking-tighter">Guest Artist</h4>
                <p className="text-slate-500 text-sm font-medium mt-4 mb-8">Jump in instantly. Use the generator, extract shades from images, and preview designs with zero sign-up.</p>
                <button onClick={() => navigate('/generate')} className="text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-2 group-hover:translate-x-2 transition-transform">Start Playing <MoveRight size={14}/></button>
             </div>
             <div className="p-10 rounded-[50px] bg-black text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700"><ShieldCheck size={80} /></div>
                <Lock size={32} className="text-blue-500 mb-8" />
                <h4 className="text-3xl font-black uppercase italic tracking-tighter">Pro Creator</h4>
                <p className="text-white/60 text-sm font-medium mt-4 mb-8">For serious work. Save every find, build unlimited folders, and keep your colors synced across all devices.</p>
                <Link to="/signup" className="inline-block px-8 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">Join Free Lab</Link>
             </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: INTERACTIVE SHADE ENGINE (NEW) --- */}
      <section ref={shadeRef} className="py-32 px-6 md:px-20 bg-white" aria-labelledby="shades-heading">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8 text-center md:text-left">
                <h3 id="shades-heading" className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">Shade <br/> Physics.</h3>
                <p className="text-slate-500 text-lg font-medium leading-relaxed">
                    Artists need depth. RangLab generates 12 levels of tonal intensity for every color, ensuring your palette works from the darkest shadows to the brightest highlights.
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                   {['Tonal Balance', 'High Contrast', 'Soft Gradients'].map(tag => (
                     <span key={tag} className="px-4 py-2 bg-slate-50 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400 border border-slate-100">{tag}</span>
                   ))}
                </div>
            </div>
            <div className="grid grid-cols-6 gap-2 md:gap-3">
                {[...Array(12)].map((_, i) => (
                    <div 
                      key={i} 
                      className="shade-box h-32 md:h-48 rounded-2xl md:rounded-3xl hover:scale-110 active:scale-90 transition-all duration-300 shadow-lg cursor-pointer"
                      style={{ backgroundColor: `hsl(230, 80%, ${95 - (i * 7)}%)` }}
                      role="img"
                      aria-label={`Color shade ${i + 1} of 12`}
                    />
                ))}
            </div>
        </div>
      </section>

      {/* --- SECTION 4: THE TOOLKIT GRID --- */}
      <section className="py-32 px-6 md:px-20 bg-[#F9FAFB] rounded-[60px] mx-4 md:mx-10 border border-slate-100">
        <div className="max-w-[1400px] mx-auto">
          <header className="mb-20 flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
             <h2 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-none">Toolkit.</h2>
             <p className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-600 italic">Micro-Interaction Driven</p>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureBox title="Generator" icon={<Zap/>} bg="bg-[#EEF2FF]" color="text-[#4338CA]" desc="High-speed mixing engine for clean, modern palettes." />
            <FeatureBox title="Explore" icon={<Globe2/>} bg="bg-[#FFF7ED]" color="text-[#C2410C]" desc="Discover trending colors from other artists worldwide." />
            <FeatureBox title="Image Picker" icon={<Maximize2/>} bg="bg-[#ECFDF5]" color="text-[#047857]" desc="Source beautiful colors directly from your favorite photos." />
            <FeatureBox title="Collage" icon={<Camera/>} bg="bg-[#FFF1F2]" color="text-[#BE123C]" desc="Create studio mood boards to showcase your vision." />
            <FeatureBox title="Visualizer" icon={<Layout/>} bg="bg-[#EFF6FF]" color="text-[#1D4ED8]" desc="See your colors on real web and mobile mockups." />
            <FeatureBox title="Safe Design" icon={<ShieldCheck/>} bg="bg-[#F9FAFB]" color="text-[#374151]" desc="Contrast checks to ensure your work is readable by all." />
          </div>
        </div>
      </section>

      {/* --- SECTION 5: SANDBOX PLAYGROUND --- */}
      <section className="py-32 px-6 md:px-20 bg-white">
         <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 space-y-8 text-center md:text-left">
                <h3 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter">color box.</h3>
                <p className="text-lg font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Touch the colors. Find your vibe.</p>
                <button onClick={generateMiniPalette} className="hidden lg:flex px-10 py-5 bg-black text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] items-center gap-4 hover:bg-blue-600 transition-all shadow-xl active:scale-95 group">
                  <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-700" /> Refresh box
                </button>
            </div>
            <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="h-[400px] md:h-[500px] flex gap-3 md:gap-4">
                    {miniPalette.map((c, i) => (
                    <div key={i} className="palette-strip flex-1 h-full rounded-[30px] md:rounded-[45px] shadow-xl relative group overflow-hidden transition-all duration-700 hover:flex-[3] hover:shadow-2xl" style={{ backgroundColor: c }}>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/10 backdrop-blur-[2px]">
                            <span className="text-[10px] font-black mix-blend-difference text-white uppercase tracking-widest rotate-90">{c}</span>
                        </div>
                    </div>
                    ))}
                </div>
                <button onClick={generateMiniPalette} className="lg:hidden w-full py-6 bg-black text-white rounded-[30px] text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 active:scale-95 transition-all">
                    <RefreshCw size={18}/> Refresh Sandbox
                </button>
            </div>
         </div>
      </section>

      {/* --- SECTION 6: FEEDBACK & COMMUNITY --- */}
      <section className="py-32 px-6 md:px-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-4xl mx-auto text-center space-y-10">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-sm text-blue-600 group hover:rotate-[360deg] transition-transform duration-1000"><MessageCircle size={32} /></div>
            <h3 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">Join the Lab.</h3>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">RangLab is built by artists, for artists. If you have an idea or found a bug, we want to hear from you. Help us shape the future of color tools.</p>
            <a href="https://www.instagram.com/ranglab_/" className="inline-block text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 border-b-2 border-blue-600 pb-1 hover:text-black hover:border-black transition-all active:scale-90">Get in touch with us</a>
        </div>
      </section>

      {/* --- SECTION 7: FINAL CALL TO ACTION --- */}
      <section className="py-60 px-6 text-center bg-white">
        <div className="space-y-12">
          <h2 className="text-7xl md:text-[10vw] font-black uppercase italic leading-[0.8] tracking-tighter">
          Start Your <br/>Palette.
          </h2>
          <div className="flex flex-col items-center gap-6">
            <Link to="/signup" className="inline-block px-16 py-8 bg-black text-white rounded-full text-[12px] font-black uppercase tracking-[0.5em] shadow-2xl hover:scale-110 active:scale-95 transition-all">
                Create Free Account
            </Link>
            <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.4em] italic">Open Beta • No payment required</p>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 px-6 md:px-20 bg-white border-t border-slate-50">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-black rounded-[18px] flex items-center justify-center text-white shadow-lg"><Palette size={24} /></div>
             <div className="flex flex-col text-left">
                <span className="text-2xl font-black italic tracking-tighter uppercase leading-none text-black">Rang.Lab</span>
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-600 mt-1">Color Studio • beta version</span>
             </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-14">
              <div className="flex gap-8">
                  <a href="https://www.instagram.com/ranglab_/" aria-label="Follow us on Instagram" className="text-slate-300 hover:text-pink-500 transition-all hover:scale-125"><Instagram size={22} /></a>
                  <a href="https://github.com/pstarz7" aria-label="Contribute on Github" className="text-slate-300 hover:text-black transition-all hover:scale-125"><Github size={22} /></a>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">© 2026 Pstarz Creative Studio</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const FeatureBox = ({ title, icon, bg, color, desc }) => (
  <div className={`p-10 md:p-14 rounded-[55px] ${bg} border border-black/5 flex flex-col gap-8 transition-all duration-700 hover:-translate-y-4 group hover:shadow-2xl text-center md:text-left cursor-default`}>
    <div className={`w-14 h-14 bg-white rounded-2xl flex items-center justify-center ${color} shadow-sm group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 mx-auto md:mx-0`}>
       {React.cloneElement(icon, { size: 28 })}
    </div>
    <div className="space-y-3">
      <h4 className="text-2xl font-black uppercase italic tracking-tighter text-black leading-none">{title}</h4>
      <p className="text-[10px] font-bold text-black/30 uppercase leading-relaxed tracking-widest">{desc}</p>
    </div>
  </div>
);

const Step = ({ num, title, desc }) => (
  <div className="space-y-6 text-center md:text-left group cursor-default">
     <div className="flex items-center gap-4">
        <span className="text-5xl font-black italic text-slate-100 transition-colors group-hover:text-blue-500">{num}</span>
        <div className="h-px flex-1 bg-slate-100 group-hover:bg-blue-500 transition-all duration-700" />
     </div>
     <h4 className="text-3xl font-black uppercase italic tracking-tighter text-black transition-transform group-hover:translate-x-2 duration-500">{title}.</h4>
     <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-relaxed max-w-xs mx-auto md:mx-0">{desc}</p>
  </div>
);

export default LandingPage;
