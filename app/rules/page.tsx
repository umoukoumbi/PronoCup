"use client";
import React from 'react';
import { ArrowLeft, BookOpen, Users, Zap, Trophy, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-[#05070a] text-white p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-500 transition-colors mb-10 font-bold text-sm uppercase tracking-widest">
          <ArrowLeft size={16} /> Retour au Lobby
        </Link>

        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic mb-12">
          Comment ça <span className="text-emerald-500">marche ?</span>
        </h1>

        <div className="space-y-12">
          {/* Section 1 */}
          <section className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem]">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500"><Zap size={24} /></div>
              <h2 className="text-2xl font-black uppercase italic">Le Principe</h2>
            </div>
            <p className="text-slate-400 leading-relaxed font-medium">
              PronoCup est un réseau social de pronostics sportifs. Le but est simple : prédisez le résultat des matchs (1, N, 2) et accumulez des points pour devenir le leader de votre groupe.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500"><Users size={24} /></div>
              <h2 className="text-2xl font-black uppercase italic text-blue-500">Groupes & Communauté</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                <h3 className="font-black mb-2 uppercase text-xs text-white/50">Création</h3>
                <p className="text-sm text-slate-400">Créez votre propre groupe en 2 clics dans l'onglet "Groupes".</p>
              </div>
              <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                <h3 className="font-black mb-2 uppercase text-xs text-white/50">Invitation</h3>
                <p className="text-sm text-slate-400">Partagez votre code de groupe unique à vos amis pour qu'ils vous rejoignent.</p>
              </div>
            </div>
          </section>

          {/* Section 3 - RÈGLES DE CALCUL */}
          <section className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-[2.5rem]">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-500 text-black rounded-2xl"><Trophy size={24} /></div>
              <h2 className="text-2xl font-black uppercase italic">Calcul des Points</h2>
            </div>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <span className="text-emerald-500 font-black">●</span>
                <p className="text-slate-300 text-sm"><strong>Pari Juste :</strong> Vous remportez le montant de la cote validée au moment de votre pari.</p>
              </li>
              <li className="flex gap-4">
                <span className="text-emerald-500 font-black">●</span>
                <p className="text-slate-300 text-sm"><strong>Cotes Dynamiques :</strong> Plus une équipe est favorite (beaucoup de paris sur elle), plus sa cote baisse. Pariez tôt pour verrouiller une meilleure cote !</p>
              </li>
              <li className="flex gap-4">
                <span className="text-emerald-500 font-black">●</span>
                <p className="text-slate-300 text-sm"><strong>Pari Perdu :</strong> Aucun point n'est retiré. Votre score reste le même.</p>
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="p-8 border border-white/5 rounded-[2.5rem] opacity-60">
             <div className="flex items-center gap-4 mb-4 text-slate-400">
               <ShieldCheck size={20} />
               <span className="text-xs font-black uppercase tracking-widest">Fair Play & Jeu Responsable</span>
             </div>
             <p className="text-[11px] text-slate-500 uppercase tracking-tighter">
               Cette application est gratuite et à but purement récréatif. Aucune somme d'argent réelle n'est misée ou redistribuée.
             </p>
          </section>
        </div>
      </div>
    </div>
  );
}