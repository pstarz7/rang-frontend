import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Palette, AlertCircle } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google'; 
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    try {
      const response = await fetch('https://rang-server.onrender.com/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // --- FIX: Spread data to avoid nesting, pass token explicitly ---
        const { token, ...userData } = data;
        login(userData, token);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Google Auth Failed');
      }
    } catch (err) {
      setError('Connection to server failed.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('https://rang-server.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // --- MASTER FIX: Controller returns {_id, name, email, token} at top level ---
        // We extract token and pass the remaining object as userData
        const { token, ...userData } = data;
        login(userData, token);
        
        // Use a slight delay or direct check to ensure storage is ready
        navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Server connection failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl p-10 border border-black/5 animate-in fade-in zoom-in-95 duration-500">
        <header className="flex flex-col items-center mb-10 text-center">
          <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl">
            <Palette size={28} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">Welcome.</h1>
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2">
               <AlertCircle size={14} /> {error}
            </div>
          )}
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Email</label>
            <input type="email" required className="w-full bg-slate-50 border border-transparent focus:border-black rounded-2xl py-4 px-6 outline-none transition-all font-bold" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Password</label>
            <input type="password" required className="w-full bg-slate-50 border border-transparent focus:border-black rounded-2xl py-4 px-6 outline-none transition-all font-bold" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="w-full bg-black text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-transform">
            Authorize <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-8 flex flex-col items-center">
          <div className="relative w-full mb-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
            <div className="relative flex justify-center text-[8px] uppercase"><span className="bg-white px-4 text-slate-400 font-black tracking-widest">Or login with</span></div>
          </div>
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError('Google Login Failed')} theme="outline" shape="pill" />
        </div>

        <p className="mt-10 text-center text-xs font-bold text-slate-400">
          New to Rang? <Link to="/signup" className="text-black underline ml-1">Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
