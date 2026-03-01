import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Palette, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // --- STATE MANAGEMENT ---
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  // --- VALIDATION ENGINE ---
  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid architecture";
    }

    if (!formData.password) {
      newErrors.password = "Key required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Min 8 chars";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setServerError('');
    try {
      const response = await fetch('https://rang-server.onrender.com/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await response.json();
      if (response.ok) {
        // --- FIX: Spread data to avoid nesting, then pass token separately ---
        const { token, ...userFields } = data;
        login(userFields, token);
        navigate('/dashboard');
      } else {
        setServerError(data.message || 'Google Auth Failed');
      }
    } catch (err) {
      setServerError('Connection to server failed.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('https://rang-server.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // --- FIX: Since controller returns {_id, name, email, token} at top level
        // i'm extract the token and pass the rest as userData
        const { token, ...userFields } = data;
        login(userFields, token); 
        navigate('/dashboard');
      } else {
        setServerError(data.message || "Registry failed");
      }
    } catch (err) {
      setServerError("Cloud connection lost.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4 font-sans selection:bg-black selection:text-white">
      <div className="w-full max-w-sm bg-white rounded-[40px] shadow-[0_30px_80px_rgba(0,0,0,0.06)] p-8 md:p-10 border border-black/5 animate-in fade-in zoom-in-95 duration-500">

        <header className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-black rounded-[18px] flex items-center justify-center text-white mb-4 shadow-xl hover:scale-105 transition-transform cursor-pointer">
            <Palette size={24} />
          </div>
          <h1 className="text-2xl font-black tracking-tighter uppercase italic text-[#111]">Join Rang.</h1>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Initialize Identity</p>
        </header>

        {serverError && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 animate-in slide-in-from-top-2">
            <AlertCircle size={14} className="text-red-500" />
            <p className="text-[9px] font-black text-red-500 uppercase tracking-widest">{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NAME */}
          <div className="space-y-1.5">
            <div className="flex justify-between px-3">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Name</label>
              {errors.name && <span className="text-[8px] font-bold text-red-500 uppercase">{errors.name}</span>}
            </div>
            <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input
                type="text"
                className="w-full bg-slate-50 border border-transparent rounded-[18px] py-3.5 pl-12 pr-5 outline-none focus:border-black focus:bg-white transition-all font-bold text-xs"
                placeholder="Artist Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          {/* EMAIL */}
          <div className="space-y-1.5">
            <div className="flex justify-between px-3">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Email</label>
              {errors.email && <span className="text-[8px] font-bold text-red-500 uppercase">{errors.email}</span>}
            </div>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input
                type="email"
                className="w-full bg-slate-50 border border-transparent rounded-[18px] py-3.5 pl-12 pr-5 outline-none focus:border-black focus:bg-white transition-all font-bold text-xs"
                placeholder="system@domain.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="space-y-1.5">
            <div className="flex justify-between px-3">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Security Key</label>
              {errors.password && <span className="text-[8px] font-bold text-red-500 uppercase">{errors.password}</span>}
            </div>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input
                type="password"
                className="w-full bg-slate-50 border border-transparent rounded-[18px] py-3.5 pl-12 pr-5 outline-none focus:border-black focus:bg-white transition-all font-bold text-xs"
                placeholder="Min. 8 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-4 rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-zinc-800 transition-all mt-4 flex items-center justify-center gap-2 disabled:opacity-50 group"
          >
            {isSubmitting ? 'Syncing...' : 'signUp'} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-4">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
            <div className="relative flex justify-center text-[8px] uppercase font-black tracking-widest text-slate-300">
                <span className="bg-white px-3">Or continue with</span>
            </div>
          </div>

          <div className="w-full flex justify-center overflow-hidden">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setServerError('Google Login Failed')}
              theme="outline"
              shape="pill"
              width="250px"
            />
          </div>
        </div>

        <footer className="mt-8 text-center pt-6 border-t border-slate-50">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">
            Existing index? <Link to="/login" className="text-black underline underline-offset-4 decoration-slate-200 hover:decoration-black transition-all ml-1">Login</Link>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Signup;