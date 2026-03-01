import React, { useState } from 'react';
import { X, Copy, Check, Terminal, FileCode, Hash } from 'lucide-react';

const ProjectExportModal = ({ project, onClose }) => {
  const [exportFormat, setExportFormat] = useState('tailwind');
  const [copied, setCopied] = useState(false);

  // LOGIC TO GENERATE TAILWIND CONFIG
  const generateTailwind = () => {
    let config = `// Tailwind Config for ${project.name}\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n`;
    project.palettes.forEach(p => {
      const slug = p.name.toLowerCase().replace(/\s+/g, '-');
      config += `        '${slug}': {\n`;
      p.colors.forEach((c, i) => {
        config += `          ${(i + 1) * 100}: '${c}',\n`;
      });
      config += `        },\n`;
    });
    config += `      }\n    }\n  }\n}`;
    return config;
  };

  // LOGIC TO GENERATE CSS VARIABLES
  const generateCSS = () => {
    let css = `/* CSS Variables for ${project.name} */\n:root {\n`;
    project.palettes.forEach(p => {
      const slug = p.name.toLowerCase().replace(/\s+/g, '-');
      p.colors.forEach((c, i) => {
        css += `  --${slug}-${(i + 1) * 100}: ${c};\n`;
      });
    });
    css += `}`;
    return css;
  };

  const code = exportFormat === 'tailwind' ? generateTailwind() : generateCSS();

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[400] flex items-center justify-center p-4">
      <div className="bg-[#0A0A0A] w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden border border-white/5 animate-in zoom-in duration-300">
        <div className="p-8">
          <header className="flex justify-between items-center mb-8">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Project Export.</h3>
              <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">{project.name}</p>
            </div>
            <button onClick={onClose} className="p-2 text-white/20 hover:text-white transition-colors"><X /></button>
          </header>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <button 
              onClick={() => setExportFormat('tailwind')}
              className={`flex items-center justify-center gap-3 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${exportFormat === 'tailwind' ? 'bg-white text-black' : 'bg-white/5 text-white/40 border border-white/5'}`}
            >
              <FileCode size={14} /> Tailwind Config
            </button>
            <button 
              onClick={() => setExportFormat('css')}
              className={`flex items-center justify-center gap-3 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${exportFormat === 'css' ? 'bg-white text-black' : 'bg-white/5 text-white/40 border border-white/5'}`}
            >
              <Hash size={14} /> CSS Variables
            </button>
          </div>

          <div className="relative group">
            <pre className="bg-black border border-white/5 rounded-3xl p-8 text-xs font-mono text-blue-400 overflow-x-auto h-[350px] custom-scrollbar leading-relaxed">
              <code>{code}</code>
            </pre>
            <button 
              onClick={handleCopy}
              className="absolute top-4 right-4 bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 hover:bg-white hover:text-black transition-all flex items-center gap-2"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied!" : "Copy Code"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectExportModal; 