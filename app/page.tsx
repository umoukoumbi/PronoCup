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

  // REMPLACE PAR TON EMAIL
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
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-white">
      <nav className="sticky top-0 z-50 bg-[#05070a]/80 backdrop-blur-xl border-b border-white/5 px-4 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Trophy size={18} className="text-black" />
            </div>
            <span className="font-black tracking-tighter text-xl italic uppercase">
              Prono<span className="text-emerald-500">SaaS</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {user && (
              <>
                <Link href="/groups" className="p-2 text-slate-400 hover:text-white transition-colors">
                  <Users size={20} />
                </Link>
                <Link href="/profile" className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-xl border border-white/10 hover:border-emerald-500/50 transition-all">
                  <User size={16} className="text-emerald-500" />
                  <span className="text-[10px] font-black uppercase hidden sm:inline">Mon Profil</span>
                </Link>
                {user.email === ADMIN_EMAIL && (
                  <Link href="/admin" className="flex items-center gap-2 bg-yellow-500/10 px-3 py-2 rounded-xl border border-yellow-500/20 hover:bg-yellow-500 hover:text-black transition-all group">
                    <ShieldCheck size={16} className="text-yellow-500 group-hover:text-black" />
                    <span className="text-[10px] font-black uppercase hidden sm:inline">Admin</span>
                  </Link>
                )}
                <button onClick={handleLogout} className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                  <LogOut size={18} />
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <header className="max-w-5xl mx-auto px-6 py-12">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-full mb-6 border border-emerald-500/20">
          <Flame size={14} fill="currentColor" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Cotes dynamiques</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none italic mb-4">
          Faites vos <span className="text-emerald-500 underline decoration-white/10">Jeux.</span>
        </h1>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-24">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-500" size={40} /></div>
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
  );
}