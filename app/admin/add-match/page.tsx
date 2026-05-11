"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Trophy, Calendar, Hash, Flag, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function AddMatchPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // État du formulaire
  const [formData, setFormData] = useState({
    home_team: '',
    away_team: '',
    home_flag: '',
    away_flag: '',
    match_time: '',
    odds_home: '',
    odds_draw: '',
    odds_away: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('matches').insert([
      {
        home_team: formData.home_team,
        away_team: formData.away_team,
        home_flag: formData.home_flag,
        away_flag: formData.away_flag,
        match_time: new Date(formData.match_time).toISOString(),
        odds_home: parseFloat(formData.odds_home),
        odds_draw: parseFloat(formData.odds_draw),
        odds_away: parseFloat(formData.odds_away),
        status: 'scheduled'
      }
    ]);

    if (error) {
      alert("Erreur : " + error.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 2000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-white p-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={16} /> Retour au dashboard
        </Link>

        <div className="bg-slate-900/50 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.2)]">
              <Trophy className="text-black" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight">Ajouter un Match</h1>
              <p className="text-slate-500 text-sm font-medium">Coupe du Monde 2026 • Phase de poules</p>
            </div>
          </div>

          {success ? (
            <div className="py-20 text-center animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} />
              </div>
              <h2 className="text-2xl font-bold mb-2">Match ajouté !</h2>
              <p className="text-slate-400">Redirection vers l'accueil...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Équipes */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Équipe Domicile</label>
                  <input required placeholder="ex: France" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-emerald-500 transition-all"
                    onChange={e => setFormData({...formData, home_team: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Équipe Extérieur</label>
                  <input required placeholder="ex: Brésil" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-emerald-500 transition-all"
                    onChange={e => setFormData({...formData, away_team: e.target.value})} />
                </div>
              </div>

              {/* Drapeaux (Emojis) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2"><Flag size={12}/> Emoji Drapeau Dom.</label>
                  <input placeholder="ex: 🇫🇷" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-emerald-500 transition-all text-center text-xl"
                    onChange={e => setFormData({...formData, home_flag: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2"><Flag size={12}/> Emoji Drapeau Ext.</label>
                  <input placeholder="ex: 🇧🇷" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-emerald-500 transition-all text-center text-xl"
                    onChange={e => setFormData({...formData, away_flag: e.target.value})} />
                </div>
              </div>

              {/* Date et Heure */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2"><Calendar size={12}/> Date & Heure du coup d'envoi</label>
                <input required type="datetime-local" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-emerald-500 transition-all"
                  onChange={e => setFormData({...formData, match_time: e.target.value})} />
              </div>

              {/* Cotes */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2"><Hash size={12}/> Cotes (ex: 1.50)</label>
                <div className="grid grid-cols-3 gap-3">
                  <input required type="number" step="0.01" placeholder="1" className="bg-black/40 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-emerald-500 transition-all"
                    onChange={e => setFormData({...formData, odds_home: e.target.value})} />
                  <input required type="number" step="0.01" placeholder="N" className="bg-black/40 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-emerald-500 transition-all"
                    onChange={e => setFormData({...formData, odds_draw: e.target.value})} />
                  <input required type="number" step="0.01" placeholder="2" className="bg-black/40 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-emerald-500 transition-all"
                    onChange={e => setFormData({...formData, odds_away: e.target.value})} />
                </div>
              </div>

              <button disabled={loading} type="submit" className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-emerald-400 transition-all active:scale-[0.98] disabled:opacity-50 mt-4 shadow-xl">
                {loading ? "Création en cours..." : "ENREGISTRER LE MATCH"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}