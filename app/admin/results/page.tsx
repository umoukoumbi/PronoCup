"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CheckCircle2, Loader2, ArrowLeft, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function AdminResultsPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    // On ne récupère que les matchs programmés qui n'ont pas encore de score
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('status', 'scheduled')
      .order('match_time', { ascending: true });

    if (error) console.error("Erreur fetch matches:", error);
    setMatches(data || []);
    setLoading(false);
  };

  const submitResult = async (matchId: string, hScore: number, aScore: number) => {
    setUpdating(matchId);

    // 1. Déterminer le résultat final (1, N, ou 2)
    let finalResult = 'N';
    if (hScore > aScore) finalResult = '1';
    else if (aScore > hScore) finalResult = '2';

    try {
      // 2. Mettre à jour le match lui-même
      const { error: matchError } = await supabase
        .from('matches')
        .update({ 
          home_score: hScore, 
          away_score: aScore, 
          status: 'finished' 
        })
        .eq('id', matchId);

      if (matchError) throw matchError;

      // 3. Récupérer tous les pronostics gagnants pour ce match
      const { data: winners, error: winnersError } = await supabase
        .from('predictions')
        .select('id, odds_at_bet')
        .eq('match_id', matchId)
        .eq('predicted_result', finalResult);

      if (winnersError) throw winnersError;

      // 4. Distribuer les points aux gagnants (Cote au moment du pari * 10)
      if (winners && winners.length > 0) {
        await Promise.all(winners.map(async (win) => {
          // Si odds_at_bet est vide, on prend 1.0 par défaut pour éviter le bug
          const odds = Number(win.odds_at_bet) || 1.0;
          const pointsToAward = Math.round(odds * 10);

          await supabase
            .from('predictions')
            .update({ 
              points_won: pointsToAward, 
              is_processed: true 
            })
            .eq('id', win.id);
        }));
      }

      // 5. Marquer les perdants comme traités (0 points)
      await supabase
        .from('predictions')
        .update({ 
          is_processed: true, 
          points_won: 0 
        })
        .eq('match_id', matchId)
        .neq('predicted_result', finalResult);

      alert(`Match clôturé ! ${winners?.length || 0} parieurs ont reçu leurs points.`);
      fetchMatches(); // Rafraîchir la liste

    } catch (error: any) {
      console.error("Erreur complète:", error);
      alert("Erreur lors de la validation : " + error.message);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#05070a] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-emerald-500" size={40} />
      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Chargement des matchs en attente...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
          <Trophy size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Saisie des Résultats</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Validez les scores pour distribuer les points</p>
        </div>
      </div>

      {matches.length > 0 ? (
        <div className="grid gap-4">
          {matches.map((match) => (
            <MatchResultRow 
              key={match.id} 
              match={match} 
              onSave={submitResult} 
              isUpdating={updating === match.id} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]">
          <CheckCircle2 size={48} className="mx-auto text-slate-800 mb-4" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Tous les matchs ont été clôturés !</p>
        </div>
      )}
    </div>
  );
}

function MatchResultRow({ match, onSave, isUpdating }: any) {
  const [h, setH] = useState(0);
  const [a, setA] = useState(0);

  return (
    <div className="bg-slate-900/40 p-6 rounded-[2.5rem] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-white/10 transition-all">
      <div className="flex items-center gap-4 flex-1 justify-end">
        <span className="font-bold text-lg">{match.home_team}</span>
        <span className="text-2xl">{match.home_flag}</span>
      </div>

      <div className="flex items-center gap-3 bg-black/40 p-3 rounded-2xl border border-white/5 shadow-inner">
        <input 
          type="number" 
          min="0"
          className="w-12 bg-transparent text-center font-black text-2xl text-emerald-500 outline-none" 
          value={h} 
          onChange={e => setH(parseInt(e.target.value) || 0)} 
        />
        <span className="text-slate-700 font-black">-</span>
        <input 
          type="number" 
          min="0"
          className="w-12 bg-transparent text-center font-black text-2xl text-emerald-500 outline-none" 
          value={a} 
          onChange={e => setA(parseInt(e.target.value) || 0)} 
        />
      </div>

      <div className="flex items-center gap-4 flex-1 justify-start">
        <span className="text-2xl">{match.away_flag}</span>
        <span className="font-bold text-lg">{match.away_team}</span>
      </div>

      <button 
        onClick={() => onSave(match.id, h, a)} 
        disabled={isUpdating}
        className="w-full md:w-auto bg-white text-black px-8 py-3 rounded-xl font-black text-xs hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
      >
        {isUpdating ? <Loader2 className="animate-spin" size={16} /> : 'VALIDER LE SCORE'}
      </button>
    </div>
  );
}