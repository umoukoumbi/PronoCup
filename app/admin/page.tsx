"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Trophy, Activity, Star } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMatches: 0,
    totalPredictions: 0,
    totalLeagues: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      // On récupère les comptes de chaque table
      const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: matchesCount } = await supabase.from('matches').select('*', { count: 'exact', head: true });
      const { count: predCount } = await supabase.from('predictions').select('*', { count: 'exact', head: true });
      const { count: leaguesCount } = await supabase.from('leagues').select('*', { count: 'exact', head: true });

      setStats({
        totalUsers: usersCount || 0,
        totalMatches: matchesCount || 0,
        totalPredictions: predCount || 0,
        totalLeagues: leaguesCount || 0
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Vue d'ensemble</h1>
      <p className="text-slate-500 font-medium mb-10 uppercase tracking-widest text-xs">Statistiques en temps réel de ta plateforme</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Utilisateurs" value={stats.totalUsers} icon={<Users className="text-blue-500" />} color="blue" />
        <StatCard title="Matchs" value={stats.totalMatches} icon={<Trophy className="text-emerald-500" />} color="emerald" />
        <StatCard title="Pronostics" value={stats.totalPredictions} icon={<Activity className="text-purple-500" />} color="purple" />
        <StatCard title="Ligues Privées" value={stats.totalLeagues} icon={<Star className="text-yellow-500" />} color="yellow" />
      </div>

      <div className="mt-12 p-8 border border-white/5 bg-white/[0.02] rounded-[2.5rem]">
        <h2 className="text-xl font-bold mb-4">Bienvenue dans l'administration</h2>
        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
          Utilisez le menu latéral pour gérer vos matchs, mettre à jour les cotes ou clôturer les résultats. 
          Toute modification ici impacte directement les points des utilisateurs en temps réel.
        </p>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] hover:border-white/10 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white/5 rounded-2xl">
          {icon}
        </div>
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Live</span>
      </div>
      <p className="text-3xl font-black mb-1">{value}</p>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">{title}</p>
    </div>
  );
}