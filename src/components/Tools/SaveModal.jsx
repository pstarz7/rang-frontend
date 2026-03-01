import React, { useState } from 'react';
import { X, Check, Save, Zap, Palette } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SaveModal = ({ colors, onClose }) => {
  const { user } = useAuth();
  const [paletteName, setPaletteName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!paletteName.trim()) return;
    
    setIsSaving(true);
    try {
      const response = await fetch('https://rang-server.onrender.com/api/palettes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          name: paletteName,
          colors: colors.map(c => c.hex) // Extracting just hex strings
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => onClose(), 1500);
      }
    } catch (err) {
      console.error("Failed to save palette:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xl z-[1000] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* HEADER */}
        <header className="px-8 pt-8 pb-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center text-white">
              <Save size={16} />
            </div>
            <h3 className="text-xl font-black italic tracking-tighter uppercase">Save Collection.</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <X size={20} className="text-slate-300 hover:text-black" />
          </button>
        </header>

        <form onSubmit={handleSave} className="p-8 space-y-8">
          {/* PREVIEW STRIP */}
          <div className="flex h-16 rounded-2xl overflow-hidden border border-black/5">
            {colors.map((c, i) => (
              <div key={i} className="flex-1" style={{ backgroundColor: c.hex }} />
            ))}
          </div>

          {/* INPUT SECTION */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Palette Name</label>
            <input 
              autoFocus
              type="text" 
              required
              placeholder="e.g., Summer Arctic, Deep Ocean"
              className="w-full bg-slate-50 border border-black/5 rounded-2xl py-5 px-6 outline-none focus:border-black transition-all font-bold"
              value={paletteName}
              onChange={(e) => setPaletteName(e.target.value)}
            />
          </div>

          {/* ACTIONS */}
          <button 
            type="submit"
            disabled={isSaving || isSuccess}
            className={`w-full py-5 rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center gap-3 ${
              isSuccess 
              ? 'bg-green-500 text-white' 
              : 'bg-black text-white hover:scale-[1.02] active:scale-95'
            }`}
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : isSuccess ? (
              <>Saved Successfully <Check size={18} /></>
            ) : (
              <>Confirm & Save <Zap size={16} fill="currentColor" /></>
            )}
          </button>
        </form>

        <footer className="px-8 py-6 bg-slate-50 text-center">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
            Stored in your Rang. Cloud Library
          </p>
        </footer>
      </div>
    </div>
  );
};

export default SaveModal;