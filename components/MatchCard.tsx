"use client";
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Zap } from 'lucide-react';

function Flag({ code }: { code: string }) {
  if (!code) return null;
  return (
    <span 
      className={`fi fi-${code.toLowerCase()} text-4xl shadow-lg`} 
      style={{ borderRadius: '6px', width: '1.33em', lineHeight: '1em', display: 'inline-block' }} 
    />
  );
}

export default function MatchCard({ matchId, homeTeam, homeFlag, awayTeam, awayFlag, odds }: any) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [selected, setSelected] = useState<string | null>(null);

  const handlePrediction = async (prediction: string) => {
    setStatus('loading');
    setSelected(prediction);
    const oddsAtBet = prediction === '1' ? odds.h : prediction === 'N' ? odds.n : odds.a;
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return alert("Connecte-toi !");

    const { error } = await supabase.from('predictions').upsert({
      user_id: user.id, match_id: matchId, predicted_result: prediction, odds_at_bet: oddsAtBet
    });

    if (!error) {
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  return (
    <div className="bg-[#0f1117] border border-white/5 rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden transition-all hover:border-white/10">
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex flex-col items-center gap-3 flex-1 text-center">
          <Flag code={homeFlag} />
          <span className="text-[11px] font-black uppercase text-slate-300 leading-tight tracking-tighter">{homeTeam}</span>
        </div>
        <div className="flex flex-col items-center px-4 opacity-20">
          <span className="text-[10px] font-black text-white tracking-[0.3em] italic">VS</span>
        </div>
        <div className="flex flex-col items-center gap-3 flex-1 text-center">
          <Flag code={awayFlag} />
          <span className="text-[11px] font-black uppercase text-slate-300 leading-tight tracking-tighter">{awayTeam}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <OddsBtn label="1" val={odds.h} active={selected === '1'} onClick={() => handlePrediction('1')} loading={status === 'loading' && selected === '1'} />
        <OddsBtn label="N" val={odds.n} active={selected === 'N'} onClick={() => handlePrediction('N')} loading={status === 'loading' && selected === 'N'} />
        <OddsBtn label="2" val={odds.a} active={selected === '2'} onClick={() => handlePrediction('2')} loading={status === 'loading' && selected === '2'} />
      </div>

      {status === 'success' && (
        <div className="absolute inset-x-0 bottom-2 flex items-center justify-center gap-2 text-emerald-400 font-black text-[9px] uppercase tracking-widest animate-pulse">
          <Zap size={10} fill="currentColor" /> Pari validé
        </div>
      )}
    </div>
  );
}

function OddsBtn({ label, val, active, onClick, loading }: any) {
  return (
    <button 
      onClick={onClick}
      disabled={loading}
      className={`relative py-4 rounded-2xl border-2 transition-all active:scale-95 flex flex-col items-center justify-center gap-1 ${
        active 
        ? 'bg-emerald-500 border-emerald-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
        : 'bg-slate-800/30 border-white/5 text-white hover:border-white/20'
      }`}
    >
      <span className={`text-[9px] font-black uppercase ${active ? 'text-black/50' : 'text-slate-500'}`}>{label}</span>
      {loading ? <Loader2 size={18} className="animate-spin" /> : <span className="text-xl font-black italic tracking-tighter">{val?.toFixed(2)}</span>}
    </button>
  );
}