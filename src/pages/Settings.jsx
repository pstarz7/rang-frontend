import React, { useState, useEffect } from 'react';
import Navbar from '../components/Layout/Navbar';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, ShieldCheck, Loader2, Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Settings = () => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({ ...formData, name: user.name, email: user.email });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setMessage({ type: 'error', text: 'Passwords do not match' });
    }

    setLoading(true);
    try {
      const res = await fetch('https://rang-server.onrender.com/api/users/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}` 
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        // Update the local storage and context with new name/email
        login({ ...user, name: data.name, email: data.email });
        setMessage({ type: 'success', text: 'Profile updated successfully' });
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] font-sans pb-20">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-8 py-16">
        <header className="mb-12">
          <Link to="/dashboard" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 hover:text-black transition-colors mb-4">
             <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <h1 className="text-5xl font-black tracking-tighter italic uppercase leading-none">Settings.</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em]">Account Security & Profile</p>
        </header>

        <form onSubmit={handleSubmit} className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm space-y-8">
          {message.text && (
            <div className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border ${message.type === 'success' ? 'bg-green-50 border-green-100 text-green-600' : 'bg-red-50 border-red-100 text-red-600'}`}>
              {message.text}
            </div>
          )}

          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b border-slate-50 pb-4">Personal Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-200" size={18} />
                    <input 
                      type="text" value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-black transition-all"
                    />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-200" size={18} />
                    <input 
                      type="email" value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-black transition-all"
                    />
                  </div>
               </div>
            </div>
          </div>

          <div className="space-y-6 pt-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b border-slate-50 pb-4">Security</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-200" size={18} />
                    <input 
                      type="password" placeholder="Leave blank to keep current"
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-black transition-all"
                    />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Confirm Password</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-200" size={18} />
                    <input 
                      type="password" placeholder="Repeat new password"
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-black transition-all"
                    />
                  </div>
               </div>
            </div>
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-black text-white py-5 rounded-[25px] font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Update Account</>}
          </button>
        </form>
      </main>
    </div>
  );
};

export default Settings;