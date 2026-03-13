import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Palette, 
  LayoutDashboard, 
  Compass, 
  LogOut, 
  X, 
  Zap,
  FolderOpen,
  ChevronDown,
  Camera,
  Command,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle Scroll Effect for Human UI depth
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Generate', path: '/generate', icon: <Zap size={14} />, protected: false },
    { name: 'Explore', path: '/explore', icon: <Compass size={14} />, protected: false },
    { name: 'Collage', path: '/collage', icon: <Camera size={14} />, protected: true },
    { name: 'Library', path: '/library', icon: <FolderOpen size={14} />, protected: true },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // --- GATEKEEPER NAVIGATION LOGIC ---
  const handleNavClick = (e, link) => {
    if (link.protected && !user) {
      e.preventDefault();
      closeMobileMenu();
      navigate('/signup'); 
    } else {
      closeMobileMenu();
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-[1000] px-3 md:px-10 transition-all duration-700 ease-in-out ${isScrolled ? 'py-4' : 'py-6 md:py-10'}`}
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className={`max-w-[1600px] mx-auto flex items-center justify-between transition-all duration-500 bg-white/80 backdrop-blur-3xl border border-white/20 px-4 md:px-6 py-3 rounded-[35px] md:rounded-[45px] shadow-[0_20px_70px_rgba(0,0,0,0.05)] ${isScrolled ? 'shadow-[0_40px_100px_rgba(0,0,0,0.1)] border-black/10' : ''}`}>
        
        {/* --- LOGO --- */}
        <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-2 md:gap-4 group shrink-0 relative z-[1001]">
          <div className="w-9 h-9 md:w-12 md:h-12 bg-black rounded-[15px] md:rounded-[18px] flex items-center justify-center text-white shadow-2xl group-hover:rotate-[15deg] transition-all duration-500">
            <Palette size={18} md:size={22} fill="currentColor" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-lg md:text-3xl font-black tracking-tighter leading-none text-[#1b263b]">RangLab</span>
            <span className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.5em] text-[#c1121f] mt-1 opacity-60">Studio-beta</span>
          </div>
        </Link>

        {/* --- DESKTOP NAVIGATION --- */}
        <div className="hidden lg:flex items-center gap-1 bg-black/[0.03] p-1.5 rounded-[30px] border border-black/[0.02]">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => handleNavClick(e, link)}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-[22px] text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-500 ${
                  isActive ? 'bg-white text-black shadow-lg scale-105' : 'text-slate-400 hover:text-black'
                }`}
              >
                <span className={isActive ? 'text-black' : 'text-slate-300'}>{link.icon}</span> 
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* --- ACTIONS HUB --- */}
        <div className="flex items-center gap-2 md:gap-5 relative z-[1001]">
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                aria-label="Toggle user menu"
                className="flex items-center gap-2 md:gap-3 p-1 pr-3 md:pr-5 bg-white border border-slate-100 rounded-full hover:shadow-xl transition-all duration-500"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 bg-black rounded-full flex items-center justify-center text-white text-[10px] md:text-[12px] font-black">
                   {user.name?.charAt(0).toUpperCase()}
                </div>
                <ChevronDown size={14} className={`transition-transform duration-700 ${isProfileOpen ? 'rotate-180 text-black' : 'text-slate-300'}`} />
              </button>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-[-1]" onClick={() => setIsProfileOpen(false)} />
                  <div className="absolute top-[calc(100%+15px)] right-0 w-64 bg-white border border-black/5 rounded-[35px] shadow-[0_60px_120px_rgba(0,0,0,0.18)] p-3 animate-in fade-in zoom-in-95 duration-300">
                    <div className="px-5 py-4 mb-1 bg-slate-50 rounded-[24px]">
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Identity</p>
                       <p className="text-sm font-black text-black truncate italic uppercase tracking-tighter">{user.name}</p>
                    </div>
                    <Link to="/dashboard" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-4 px-5 py-4 rounded-[22px] text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:bg-black hover:text-white transition-all">
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-4 rounded-[22px] text-[10px] font-black uppercase tracking-[0.2em] text-red-500 hover:bg-red-50 transition-all">
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 md:gap-6">
              <Link to="/login" className="hidden sm:block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-black transition-all">Sign In</Link>
              <Link to="/signup" className="px-4 md:px-8 py-2.5 md:py-4 bg-black text-white rounded-full md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all shrink-0">
                Get Started
              </Link>
            </div>
          )}

          {/* MOBILE TOGGLE (SMART SWITCH: COMMAND -> X) */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            className="lg:hidden w-10 h-10 flex items-center justify-center bg-slate-100 rounded-[15px] text-black hover:bg-black hover:text-white transition-all active:scale-90"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Command size={20} />}
          </button>
        </div>
      </div>

      {/* --- MOBILE FULLSCREEN OVERLAY --- */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 w-full h-screen bg-white z-[1000] animate-in fade-in slide-in-from-top duration-500 overflow-y-auto">
          {/* Internal Close Button (Redundancy for A11y) */}
          <div className="absolute top-10 right-10">
              <button 
                onClick={closeMobileMenu} 
                className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-2xl active:scale-75 transition-all"
                aria-label="Exit Menu"
              >
                <X size={24} />
              </button>
          </div>

          <div className="p-6 pt-32 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-300 mb-6 pl-4 border-l-2 border-black">Navigation Menu</p>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`flex items-center justify-between p-6 rounded-[30px] transition-all ${
                    location.pathname === link.path ? 'bg-black text-white shadow-2xl scale-105' : 'bg-slate-50 text-black active:scale-95'
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <span className={location.pathname === link.path ? 'text-white' : 'text-slate-400'}>{link.icon}</span>
                    <span className="text-sm font-black uppercase tracking-widest">{link.name}</span>
                  </div>
                  <ChevronRight size={18} className="-rotate-90 opacity-20" />
                </Link>
              ))}
            </div>

            <div className="space-y-4 mb-10">
               {!user ? (
                 <div className="grid grid-cols-2 gap-3">
                    <Link onClick={closeMobileMenu} to="/login" className="p-6 bg-slate-100 text-black rounded-[25px] text-center font-black uppercase text-[10px] tracking-widest">Sign In</Link>
                    <Link onClick={closeMobileMenu} to="/signup" className="p-6 bg-black text-white rounded-[25px] text-center font-black uppercase text-[10px] tracking-widest">Join Lab</Link>
                 </div>
               ) : (
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-4 p-7 rounded-[30px] bg-red-50 text-red-500 text-xs font-black uppercase tracking-widest active:scale-95 transition-all"
                >
                  <LogOut size={18} /> Exit Studio Session
                </button>
               )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
