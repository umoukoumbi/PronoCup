"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { History, CheckCircle2, XCircle, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('predictions')
      .select(`
        *,
        matches (home_team, away_team, home_score, away_score, status)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setHistory(data || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-slate-500 mb-8 font-bold text-sm">
          <ArrowLeft size={16} /> Retour
        </Link>

        <h1 className="text-3xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
          <History className="text-emerald-500" /> Mon Historique
        </h1>

        <div className="space-y-3">
          {history.map((bet) => (
            <div key={bet.id} className="bg-slate-900/40 border border-white/5 p-5 rounded-3xl flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase mb-1">
                  Pari sur : <span className="text-white">{bet.predicted_result === '1' ? bet.matches.home_team : bet.predicted_result === '2' ? bet.matches.away_team : 'Nul'}</span>
                </p>
                <h3 className="font-bold">{bet.matches.home_team} {bet.matches.home_score ?? ''} - {bet.matches.away_score ?? ''} {bet.matches.away_team}</h3>
              </div>

              <div className="text-right">
                {bet.is_processed ? (
                  bet.points_won > 0 ? (
                    <div className="flex flex-col items-end">
                      <span className="text-emerald-500 font-black text-xl">+{bet.points_won}</span>
                      <span className="text-[8px] font-black uppercase text-emerald-500/50">Gagné</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-end">
                      <span className="text-red-500 font-black text-xl">0</span>
                      <span className="text-[8px] font-black uppercase text-red-500/50">Perdu</span>
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-end text-slate-500">
                    <Clock size={20} />
                    <span className="text-[8px] font-black uppercase">En attente</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}