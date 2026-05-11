"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Trophy, ArrowLeft, Loader2, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default function RankingPage() {
  const [rankings, setRankings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      try {
        // 1. Récupérer tous les profils
        const { data: profiles, error: profError } = await supabase
          .from('profiles')
          .select('id, username');

        if (profError) throw profError;

        // 2. Récupérer tous les pronostics qui ont rapporté des points
        const { data: allPredictions, error: predError } = await supabase
          .from('predictions')
          .select('user_id, points_won')
          .gt('points_won', 0); // On ne prend que ceux qui ont des points

        if (predError) throw predError;

        // 3. Calculer les totaux à la main (plus fiable)
        const computedRankings = profiles.map(profile => {
          const userPoints = allPredictions
            .filter(p => p.user_id === profile.id)
            .reduce((sum, p) => sum + (p.points_won || 0), 0);
          
          return {
            username: profile.username?.split('@')[0] || 'Anonyme',
            points: userPoints
          };
        });

        // 4. Trier par points décroissants
        computedRankings.sort((a, b) => b.points - a.points);
        setRankings(computedRankings);
        
      } catch (error) {
        console.error("Erreur classement:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070a] flex flex-col items-center justify-center gap-4">
        <Loader2 className="text-emerald-500 animate-spin" size={40} />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Calcul des scores...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070a] text-white p-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white mb-12 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Retour au lobby
        </Link>

        <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-8 md:p-12 backdrop-blur-xl">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/20">
              <BarChart3 className="text-emerald-500" size={30} />
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter">Classement</h1>
              <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Global League 2026</p>
            </div>
          </div>

          <div className="space-y-4">
            {rankings.length > 0 ? (
              rankings.map((user, index) => (
                <div key={index} className={`flex items-center justify-between p-4 rounded-2xl border ${index === 0 ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-black/20 border-white/5'}`}>
                  <div className="flex items-center gap-4">
                    <span className={`w-8 text-center font-black ${index === 0 ? 'text-emerald-500' : 'text-slate-600'}`}>
                      {index + 1}
                    </span>
                    <span className="font-bold">{user.username}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-emerald-500">{user.points}</span>
                    <span className="ml-2 text-[10px] font-bold text-slate-600 uppercase">pts</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-slate-500 italic">Aucun point marqué pour le moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}