"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Trophy, ArrowLeft, Loader2, Users, Medal } from 'lucide-react';
import Link from 'next/link';

export default function GroupRankingPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [league, setLeague] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    fetchGroupData();
  }, [id]);

  const fetchGroupData = async () => {
    setLoading(true);
    try {
      // 1. Récupérer les infos de la ligue
      const { data: leagueData } = await supabase
        .from('leagues')
        .select('*')
        .eq('id', id)
        .single();

      if (!leagueData) return;
      setLeague(leagueData);

      // 2. Récupérer les IDs des membres de cette ligue
      const { data: membersList } = await supabase
        .from('league_members')
        .select('user_id')
        .eq('league_id', id);

      if (!membersList || membersList.length === 0) {
        setMembers([]);
        return;
      }

      const userIds = membersList.map(m => m.user_id);

      // 3. Récupérer les pseudos des membres
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username')
        .in('id', userIds);

      // 4. Récupérer toutes les prédictions gagnantes de ces membres
      const { data: allPredictions } = await supabase
        .from('predictions')
        .select('user_id, points_won')
        .in('user_id', userIds)
        .gt('points_won', 0);

      // 5. Fusionner les données pour calculer les totaux
      const formattedMembers = (profiles || []).map(profile => {
        const totalPoints = (allPredictions || [])
          .filter(p => p.user_id === profile.id)
          .reduce((sum, p) => sum + (p.points_won || 0), 0);
        
        return {
          username: profile.username?.split('@')[0] || 'Anonyme',
          points: totalPoints
        };
      });

      // Trier par points décroissants
      formattedMembers.sort((a, b) => b.points - a.points);
      setMembers(formattedMembers);

    } catch (error) {
      console.error("Erreur lors de la récupération du classement :", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#05070a] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-emerald-500" size={40} />
      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Calcul des scores du groupe...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05070a] text-white p-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/groups" className="inline-flex items-center gap-2 text-slate-500 hover:text-white mb-8 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Retour à mes groupes
        </Link>

        <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-8 md:p-12 backdrop-blur-xl relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
            <Users size={180} />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <Trophy size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter italic text-emerald-500">
                    {league?.name}
                </h1>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">
                    Leaderboard Privé
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {members.length > 0 ? (
                members.map((member, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
                      index === 0 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-black/20 border-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${
                        index === 0 ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="font-bold text-lg">{member.username}</span>
                      {index === 0 && <Medal size={18} className="text-yellow-500" />}
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-emerald-500">{member.points}</span>
                      <span className="ml-2 text-[10px] font-bold text-slate-500 uppercase">pts</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-slate-500 italic">Aucun membre n'a encore marqué de points.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}