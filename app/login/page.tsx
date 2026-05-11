"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Trophy, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      router.push('/'); // Redirige vers l'accueil après connexion
      router.refresh();
    }
    setLoading(false);
  };

  const handleSignUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: email.split('@')[0], // Crée un pseudo par défaut
        }
      }
    });

    if (error) alert(error.message);
    else alert("Vérifiez vos emails pour confirmer l'inscription !");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#05070a] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900/50 border border-white/10 p-8 rounded-3xl backdrop-blur-xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Trophy className="text-black" size={28} />
          </div>
          <h1 className="text-2xl font-black text-white">Rejoindre l'Arène</h1>
          <p className="text-slate-400 text-sm">Connectez-vous pour parier sur 2026</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-slate-500" size={18} />
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-emerald-500 outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-slate-500" size={18} />
            <input 
              type="password" 
              placeholder="Mot de passe" 
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-emerald-500 outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-black font-black py-3 rounded-xl hover:bg-emerald-400 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Chargement..." : "SE CONNECTER"}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-3">
            <button 
                onClick={handleSignUp}
                className="w-full bg-transparent border border-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/5 transition-all"
            >
                Créer un compte
            </button>
        </div>
      </div>
    </div>
  );
}