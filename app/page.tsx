"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Trophy, User, Users, 
  Loader2, Flame, LogOut, ShieldCheck,
  TrendingUp, LayoutDashboard
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MatchCard from '@/components/MatchCard';

export default function LobbyPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // --- IMPORTANT : METS TON EMAIL ICI POUR LE BOUTON ADMIN ---
  const ADMIN_EMAIL = "ton-email@exemple.com"; 

  useEffect(() => {
    checkUser();
    fetchMatches();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchMatches = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('matches')
      .select('*')
      .eq('status', 'scheduled')
      .order('match_time', { ascending: true });
    setMatches(data || []);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-white flex flex-col">
      {/* --- NAVIGATION --- */}
      <nav className="sticky top-0 z-50 bg-[#05070a]/80 backdrop-blur-xl border-b border-white/5 px-4 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Trophy size={18} className="text-black" />
            </div>
            <span className="font-black tracking-tighter text-xl italic uppercase">
              Prono<span className="text-emerald-500">SaaS</span>
            </span>
          </Link>

          {/* Actions Droite */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <>
                {/* Nouveau Bouton Classement */}
                <Link href="/ranking" className="p-2 text-slate-400 hover:text-emerald-500 transition-colors" title="Classement Général">
                  <LayoutDashboard size={20} />
                </Link>

                <Link href="/groups" className="p-2 text-slate-400 hover:text-white transition-colors" title="Mes Groupes">
                  <Users size={20} />
                </Link>
                
                <Link href="/profile" className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-xl border border-white/10 hover:border-emerald-500/50 transition-all group">
                  <User size={16} className="text-emerald-500" />
                  <span className="text-[10px] font-black uppercase hidden sm:inline">Mon Profil</span>
                </Link>

                {user.email === ADMIN_EMAIL && (
                  <Link href="/admin" className="flex items-center gap-2 bg-yellow-500/10 px-3 py-2 rounded-xl border border-yellow-500/20 hover:bg-yellow-500 hover:text-black transition-all group">
                    <ShieldCheck size={16} className="text-yellow-500 group-hover:text-black" />
                    <span className="text-[10px] font-black uppercase hidden sm:inline">Admin</span>
                  </Link>
                )}

                <div className="h-6 w-[1px] bg-white/10 mx-1"></div>

                <button onClick={handleLogout} className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              !loading && (
                <Link href="/login" className="bg-emerald-500 text-black px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all">
                  Connexion
                </Link>
              )
            )}
          </div>
        </div>
      </nav>

      {/* --- CONTENT --- */}
      <div className="flex-grow">
        <header className="max-w-5xl mx-auto px-6 py-12 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-full mb-6 border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
            <Flame size={14} fill="currentColor" className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Cotes dynamiques actives</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-4 italic text-white">
            Dominez le <br />
            <span className="text-emerald-500 underline decoration-white/5">Classement.</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-lg text-sm md:text-base mx-auto md:mx-0">
            Prédisez les résultats, accumulez les points et grimpez au sommet de la ligue.
          </p>
        </header>

        <main className="max-w-6xl mx-auto px-6 pb-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 flex items-center gap-2">
              <TrendingUp size={16} />
              Matchs à venir
            </h2>
            <div className="h-[1px] flex-1 bg-white/5 ml-4"></div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="animate-spin text-emerald-500" size={40} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match) => (
                <MatchCard 
                  key={match.id}
                  matchId={match.id}
                  homeTeam={match.home_team}
                  homeFlag={match.home_flag}
                  awayTeam={match.away_team}
                  awayFlag={match.away_flag}
                  odds={{ h: match.odds_home, n: match.odds_draw, a: match.odds_away }}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* --- FOOTER --- */}
      <footer className="max-w-6xl w-full mx-auto px-6 py-12 border-t border-white/5 mt-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 opacity-30 grayscale">
          <Trophy size={16} />
          <span className="text-[10px] font-black uppercase italic text-white">PronoCup 2026</span>
        </div>
        
        <div className="flex gap-8">
          <Link href="/rules" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-emerald-500 transition-colors">
            Règles du jeu
          </Link>
          <Link href="/rules" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-emerald-500 transition-colors">
            CGU
          </Link>
        </div>

        <p className="text-[9px] text-slate-700 font-bold uppercase">
          Plateforme récréative
        </p>
      </footer>
    </div>
  );
}