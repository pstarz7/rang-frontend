// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Mail, Lock, ArrowRight, Palette } from 'lucide-react';
// import { useAuth } from '../../context/AuthContext'; 

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     try {
//       const response = await fetch('http://localhost:5000/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });
      
//       const data = await response.json();
      
//       if (response.ok) {
//         // SUCCESS: Tell the Context we are logged in
//         login(data.user, data.token); 
//         navigate('/generate');
//       } else {
//         setError(data.message || 'Invalid credentials');
//       }
//     } catch (err) {
//       setError('Server connection failed. Is the backend running?');
//     }
//   };

//   return (
    
//     <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-6 font-sans">
//       <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl p-10 md:p-12">
//         <header className="flex flex-col items-center mb-10 text-center">
//           <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl">
//             <Palette size={28} />
//           </div>
//           <h1 className="text-3xl font-black tracking-tighter uppercase italic">Welcome.</h1>
//           {error && <p className="mt-2 text-xs font-bold text-red-500 uppercase tracking-widest bg-red-50 px-4 py-2 rounded-lg">{error}</p>}
//         </header>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Email</label>
//             <input 
//               type="email" 
//               required
//               className="w-full bg-slate-50 border border-black/5 rounded-2xl py-4 px-6 outline-none focus:border-black transition-all"
//               placeholder="email@example.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Password</label>
//             <input 
//               type="password" 
//               required
//               className="w-full bg-slate-50 border border-black/5 rounded-2xl py-4 px-6 outline-none focus:border-black transition-all"
//               placeholder="••••••••"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>
//           <button type="submit" className="w-full bg-black text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3">
//             Login <ArrowRight size={16} />
//           </button>
//         </form>
//         <p className="mt-10 text-center text-xs font-bold text-slate-400">
//           New to Rang? <Link to="/signup" className="text-black underline ml-1">Create Account</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Palette } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google'; 
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch('https://rang-server.onrender.com/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await response.json();
      if (response.ok) {
        login(data.user, data.token);
        navigate('/generate');
      } else {
        setError(data.message || 'Google Login Failed');
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
        login(data.user, data.token);
        navigate('/generate');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Server connection failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl p-10 md:p-12">
        <header className="flex flex-col items-center mb-10 text-center">
          <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl">
            <Palette size={28} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">Welcome.</h1>
          {error && <p className="mt-2 text-xs font-bold text-red-500 uppercase tracking-widest bg-red-50 px-4 py-2 rounded-lg">{error}</p>}
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email & Password inputs same as your original code */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Email</label>
            <input type="email" required className="w-full bg-slate-50 border border-black/5 rounded-2xl py-4 px-6 outline-none focus:border-black transition-all" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Password</label>
            <input type="password" required className="w-full bg-slate-50 border border-black/5 rounded-2xl py-4 px-6 outline-none focus:border-black transition-all" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button type="submit" className="w-full bg-black text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3">
            Login <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-8 flex flex-col items-center">
          <div className="relative w-full mb-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
            <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-white px-4 text-slate-400 font-black tracking-widest">Or login with</span></div>
          </div>
          
          {/* Google Login Component */}
          <GoogleLogin 
            onSuccess={handleGoogleSuccess} 
            onError={() => setError('Google Login Failed')}
            theme="outline"
            shape="pill"
          />
        </div>

        <p className="mt-10 text-center text-xs font-bold text-slate-400">
          New to Rang? <Link to="/signup" className="text-black underline ml-1">Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;