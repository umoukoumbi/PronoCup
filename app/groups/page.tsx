"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Plus, Hash, ArrowLeft, Trophy, Loader2, Copy, Check } from 'lucide-react';
import Link from 'next/link';

export default function GroupsPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newGroupName, setNewGroupName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetchUserGroups();
  }, []);

  const fetchUserGroups = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Récupérer les groupes dont l'utilisateur est membre
    const { data, error } = await supabase
      .from('leagues')
      .select(`
        *,
        league_members!inner(user_id)
      `)
      .eq('league_members.user_id', user.id);

    if (!error) setGroups(data || []);
    setLoading(false);
  };

  const createGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !newGroupName) return;

    // Générer un code d'invitation unique de 6 caractères
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // 1. Créer la ligue
    const { data: league, error: lError } = await supabase
      .from('leagues')
      .insert([{ name: newGroupName, invite_code: inviteCode, owner_id: user.id }])
      .select()
      .single();

    if (lError) {
      alert("Erreur lors de la création : " + lError.message);
      return;
    }

    if (league) {
      // 2. Ajouter le créateur comme premier membre
      await supabase.from('league_members').insert([{ league_id: league.id, user_id: user.id }]);
      setNewGroupName('');
      fetchUserGroups();
      alert(`Groupe "${league.name}" créé !`);
    }
  };

  const joinGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !joinCode) return;

    // 1. Trouver la ligue par le code (Correction : ajout de .select('*'))
    const { data: league, error: findError } = await supabase
      .from('leagues')
      .select('*')
      .eq('invite_code', joinCode.toUpperCase().trim())
      .single();

    if (findError || !league) {
      alert("Code invalide ou groupe introuvable.");
      return;
    }

    // 2. S'ajouter à la ligue
    const { error: joinError } = await supabase
      .from('league_members')
      .insert([{ league_id: league.id, user_id: user.id }]);
    
    if (joinError) {
      // Si l'erreur est liée à la contrainte UNIQUE (déjà membre)
      alert("Vous faites déjà partie de ce groupe !");
    } else {
      setJoinCode('');
      fetchUserGroups();
      alert(`Succès ! Vous avez rejoint : ${league.name}`);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#05070a] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-emerald-500" size={40} />
      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Chargement de vos ligues...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05070a] text-white p-6">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white mb-12 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Retour au lobby
        </Link>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* COLONNE GAUCHE : FORMULAIRES */}
          <div className="space-y-6">
            <div className="bg-slate-900/50 border border-white/5 p-6 rounded-[2rem] backdrop-blur-xl">
              <h2 className="text-xl font-black mb-4 flex items-center gap-2 tracking-tight">
                <Plus size={20} className="text-emerald-500" /> CRÉER UN GROUPE
              </h2>
              <form onSubmit={createGroup} className="space-y-3">
                <input 
                  required
                  value={newGroupName}
                  onChange={e => setNewGroupName(e.target.value)}
                  placeholder="Nom (ex: Les Experts)"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-emerald-500 transition-all"
                />
                <button type="submit" className="w-full bg-emerald-500 text-black font-black py-3 rounded-xl hover:bg-emerald-400 transition-all active:scale-95">
                  CRÉER
                </button>
              </form>
            </div>

            <div className="bg-slate-900/50 border border-white/5 p-6 rounded-[2rem] backdrop-blur-xl">
              <h2 className="text-xl font-black mb-4 flex items-center gap-2 tracking-tight">
                <Hash size={20} className="text-blue-500" /> REJOINDRE
              </h2>
              <form onSubmit={joinGroup} className="space-y-3">
                <input 
                  required
                  value={joinCode}
                  onChange={e => setJoinCode(e.target.value)}
                  placeholder="Code (ex: A7B2X9)"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-blue-500 transition-all uppercase"
                />
                <button type="submit" className="w-full bg-blue-500 text-white font-black py-3 rounded-xl hover:bg-blue-400 transition-all active:scale-95">
                  REJOINDRE
                </button>
              </form>
            </div>
          </div>

          {/* COLONNE DROITE : LISTE */}
          <div className="md:col-span-2 space-y-4">
            <h1 className="text-3xl font-black uppercase tracking-tighter mb-6">Mes Groupes</h1>
            
            {groups.length > 0 ? (
              groups.map((group) => (
                <div key={group.id} className="group bg-slate-900/40 border border-white/5 p-6 rounded-[2.5rem] flex items-center justify-between hover:border-emerald-500/30 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                      <Users size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-tight">{group.name}</h3>
                      <button 
                        onClick={() => copyToClipboard(group.invite_code)}
                        className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-400 transition-colors mt-1"
                        title="Copier le code"
                      >
                        INVITE : <span className="font-mono text-emerald-500/80">{group.invite_code}</span> 
                        {copied === group.invite_code ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/groups/${group.id}`}
                    className="bg-white/5 hover:bg-white text-white hover:text-black px-6 py-3 rounded-xl font-black text-[10px] transition-all uppercase tracking-[0.2em]"
                  >
                    Classement
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center py-24 border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
                <Users size={48} className="mx-auto text-slate-800 mb-4" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                  Aucun groupe pour le moment.
                </p>
                <p className="text-[10px] text-slate-600 mt-2">Créez-en un ou demandez un code à un ami !</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}