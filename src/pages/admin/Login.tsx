import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate('/admin/portfolio');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white font-sans p-4">
      <div className="w-full max-w-md p-8 md:p-12 bg-[#141414] border border-white/10 rounded-[5px]">
        <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-widest mb-8 text-center" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
          ÚNICO Admin
        </h2>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 mb-6 text-xs uppercase tracking-widest text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-2">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#0A0A0A] border border-white/10 p-3 text-sm focus:border-white/40 focus:outline-none transition-colors text-white"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-2">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#0A0A0A] border border-white/10 p-3 text-sm focus:border-white/40 focus:outline-none transition-colors text-white"
            />
          </div>
          <button 
            type="submit" 
            className="mt-4 w-full bg-white text-black font-bold uppercase tracking-widest p-4 text-xs hover:bg-[#A3A3A3] transition-colors"
          >
            Entrar no Painel
          </button>
        </form>
      </div>
    </div>
  );
}
