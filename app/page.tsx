"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Trophy, User, History, Users, 
  LayoutDashboard, Loader2, Flame, LogOut, ShieldCheck 
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MatchCard from '@/components/MatchCard';

export default function LobbyPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // --- IMPORTANT : METS TON EMAIL ICI POUR VOIR LE BOUTON ADMIN ---
  const ADMIN_EMAIL = "ton-email@exemple.com"; 

  useEffect(() => {
    checkUser();
    fetchMatches();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    // On ne redirige pas de force vers login ici pour laisser les gens voir les matchs
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
    <div className="min-h-screen bg-[#05070a] text-white">
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
                {/* Utilisateur Connecté */}
                <Link href="/groups" className="p-2 text-slate-400 hover:text-white transition-colors" title="Mes Groupes">
                  <Users size={20} />
                </Link>
                
                <Link href="/profile" className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-xl border border-white/10 hover:border-emerald-500/50 transition-all group">
                  <User size={16} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase hidden sm:inline text-white">Mon Profil</span>
                </Link>

                {user.email === ADMIN_EMAIL && (
                  <Link href="/admin" className="flex items-center gap-2 bg-yellow-500/10 px-3 py-2 rounded-xl border border-yellow-500/20 hover:bg-yellow-500 hover:text-black transition-all group">
                    <ShieldCheck size={16} className="text-yellow-500 group-hover:text-black" />
                    <span className="text-[10px] font-black uppercase hidden sm:inline">Admin</span>
                  </Link>
                )}

                <div className="h-6 w-[1px] bg-white/10 mx-1"></div>

                <button 
                  onClick={handleLogout} 
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                  title="Déconnexion"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              /* Utilisateur Déconnecté */
              !loading && (
                <Link 
                  href="/login" 
                  className="bg-emerald-500 text-black px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  Connexion
                </Link>
              )
            )}
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="max-w-5xl mx-auto px-6 py-12 text-center md:text-left">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-full mb-6 border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
          <Flame size={14} fill="currentColor" className="animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Cotes dynamiques actives</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-4 italic">
          Dominez le <br />
          <span className="text-emerald-500 underline decoration-white/5">Classement.</span>
        </h1>
        <p className="text-slate-500 font-medium max-w-lg text-sm md:text-base mx-auto md:mx-0">
          Rejoignez des ligues privées et prouvez à vos amis que vous êtes le meilleur expert.
        </p>
      </header>

      {/* --- MATCHS GRID --- */}
      <main className="max-w-6xl mx-auto px-6 pb-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Marchs à venir
          </h2>
          <div className="h-[1px] flex-1 bg-white/5 ml-4"></div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="animate-spin text-emerald-500" size={40} />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-700 tracking-widest">Initialisation des marchés...</p>
          </div>
        ) : matches.length > 0 ? (
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
        ) : (
          <div className="text-center py-24 bg-white/[0.01] border border-dashed border-white/5 rounded-[3rem]">
            <p className="text-slate-600 font-black uppercase tracking-widest text-[10px]">Pause technique</p>
            <p className="text-[9px] text-slate-700 mt-2 uppercase">Aucun match ouvert aux paris pour le moment.</p>
          </div>
        )}
      </main>
    </div>
  );
}