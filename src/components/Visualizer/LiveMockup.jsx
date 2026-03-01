import React from 'react';
import { X, Layout, Smartphone, MousePointer2, Bell, Search, User, Globe, Activity } from 'lucide-react';

const LiveMockup = ({ colors, onClose }) => {

  const c = colors && colors.length > 0 ? colors.map(col => typeof col === 'string' ? col : col.hex) : ['#FFFFFF', '#F3F4F6', '#000000', '#6B7280', '#3B82F6'];
  
  // High-fidelity UI Role Mapping
  const bg = c[0] || '#FFFFFF';
  const surface = c[1] || '#F9FAFB';
  const primary = c[2] || '#000000';
  const secondary = c[3] || '#4B5563';
  const accent = c[4] || '#3B82F6';

  return (
    <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-[#F3F4F6] w-full max-w-6xl h-full max-h-[85vh] rounded-[40px] shadow-[0_30px_100px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col relative border border-white/20">
        
        {/* MODAL HEADER */}
        <div className="px-8 py-5 bg-white border-b border-slate-100 flex justify-between items-center z-20">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-black text-white rounded-xl shadow-lg"><Activity size={18}/></div>
            <div>
              <h3 className="text-sm font-black uppercase italic tracking-tighter">Live Preview.</h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Real-world system skinning</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-100 hover:bg-black hover:text-white rounded-full transition-all group">
            <X size={20} className="group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 no-scrollbar bg-slate-50">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* WEB MOCKUP (Left Side - 7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 px-4">Browser Interface</span>
              <div className="w-full bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-200/50">
                <div className="h-8 bg-slate-100 flex items-center gap-1.5 px-5 border-b border-slate-200">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/50"/>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/50"/>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/50"/>
                </div>
                <div className="p-0 overflow-hidden" style={{ backgroundColor: bg }}>
                  <nav className="px-8 py-6 flex justify-between items-center border-b border-black/5">
                    <div className="text-xl font-black italic tracking-tighter" style={{ color: primary }}>RANG.</div>
                    <div className="flex gap-6">
                      <div className="w-10 h-1 rounded-full" style={{ backgroundColor: secondary + '40' }} />
                      <div className="w-10 h-1 rounded-full" style={{ backgroundColor: secondary + '40' }} />
                    </div>
                  </nav>
                  <div className="p-12 text-center space-y-6">
                    <h4 className="text-4xl md:text-5xl font-black tracking-tighter leading-[0.9]" style={{ color: primary }}>Visualize your <br/> next system.</h4>
                    <p className="text-[11px] font-medium leading-relaxed mx-auto max-w-[320px]" style={{ color: secondary }}>Bridging the gap between conceptual color palettes and production-ready frontend architecture.</p>
                    <div className="flex justify-center gap-4 pt-4">
                      <button className="px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl" style={{ backgroundColor: primary }}>Deploy Project</button>
                      <button className="px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2" style={{ borderColor: primary, color: primary }}>Documentation</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-6 p-10 mt-4 bg-black/5">
                    {[1,2,3].map(i => (
                      <div key={i} className="h-28 rounded-3xl shadow-sm" style={{ backgroundColor: surface }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* MOBILE MOCKUP (Right Side - 5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 mb-4">Mobile OS</span>
              <div className="w-72 bg-black rounded-[60px] p-3.5 shadow-2xl border-[8px] border-slate-900">
                <div className="bg-white h-[500px] rounded-[48px] overflow-hidden flex flex-col relative" style={{ backgroundColor: bg }}>
                  <div className="p-8 flex justify-between items-center">
                     <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: primary, color: 'white' }}><Globe size={18}/></div>
                     <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"><User size={14} className="text-slate-400" /></div>
                  </div>
                  <div className="px-8 space-y-8">
                     <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Revenue Status</p>
                        <p className="text-3xl font-black" style={{ color: primary }}>$24,000</p>
                     </div>
                     <div className="h-36 rounded-[32px] p-6 flex flex-col justify-between" style={{ backgroundColor: primary }}>
                        <div className="flex justify-between items-start">
                           <div className="w-10 h-10 bg-white/20 rounded-xl" />
                           <div className="text-[8px] font-black text-white/60 uppercase">Cloud Sync</div>
                        </div>
                        <div className="space-y-2">
                           <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                             <div className="h-full w-3/4 bg-white" />
                           </div>
                           <p className="text-[9px] font-black text-white uppercase tracking-widest">Server Growth 75%</p>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="h-24 rounded-3xl" style={{ backgroundColor: secondary + '20' }} />
                        <div className="h-24 rounded-3xl" style={{ backgroundColor: accent + '20' }} />
                     </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-lg border-t border-black/5 flex items-center justify-around px-8">
                     <MousePointer2 size={18} style={{ color: primary }} />
                     <div className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl" style={{ backgroundColor: primary }}><Search size={18}/></div>
                     <Bell size={18} className="text-slate-300" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMockup;