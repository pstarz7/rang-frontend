import React from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { generateShades, checkAccessibility } from '../../utils/colorEngine';

const ShadeDrawer = ({ selectedColor, onClose }) => {
  if (!selectedColor) return null;

  return (
    <div className="fixed inset-0 bg-white z-[70] p-8 md:p-16 flex flex-col overflow-y-auto animate-in slide-in-from-bottom duration-500">
      <div className="flex justify-between items-center mb-12 border-b border-slate-100 pb-8">
        <div>
           <h3 className="text-5xl font-black tracking-tighter mb-2 italic">Design System.</h3>
           <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Shade Analysis for {selectedColor}</p>
        </div>
        <button onClick={onClose} className="p-5 bg-black text-white rounded-full shadow-2xl hover:rotate-90 transition-all"><X size={28}/></button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-8">
        {generateShades(selectedColor).map((s, idx) => {
          const access = checkAccessibility(s.hex, "#FFFFFF");
          return (
            <div key={idx} className="flex flex-col gap-4 p-6 bg-slate-50 rounded-[32px] border border-slate-100 group hover:bg-white hover:shadow-2xl transition-all">
              <div style={{ backgroundColor: s.hex }} className="h-32 rounded-2xl shadow-inner cursor-pointer" onClick={() => navigator.clipboard.writeText(s.hex)} />
              <div className="flex justify-between font-black text-sm uppercase"><span>{s.weight}</span><span>{s.hex}</span></div>
              <div className={`text-[10px] font-black py-2 rounded-xl text-center uppercase tracking-widest ${access.status === 'Fail' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                WCAG {access.status}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShadeDrawer;