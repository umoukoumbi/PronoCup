"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Edit3, 
  Save, 
  Trash2, 
  Plus, 
  X, 
  Loader2, 
  Calendar, 
  Flag, 
  TrendingUp 
} from 'lucide-react';

export default function AdminMatches() {
  const [matches, setMatches] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // État pour le nouveau match
  const [newMatch, setNewMatch] = useState({
    home_team: '', home_flag: '',
    away_team: '', away_flag: '',
    match_time: '',
    odds_home: 2.0, odds_draw: 3.0, odds_away: 2.0,
    status: 'scheduled'
  });

  useEffect(() => { fetchMatches(); }, []);

  const fetchMatches = async () => {
    const { data } = await supabase
      .from('matches')
      .select('*')
      .order('match_time', { ascending: false });
    setMatches(data || []);
  };

  const handleAddMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Insertion dans Supabase
    const { error } = await supabase.from('matches').insert([newMatch]);
    
    if (error) {
      alert("Erreur : " + error.message);
    } else {
      setShowAddForm(false);
      setNewMatch({ 
        home_team: '', home_flag: '', 
        away_team: '', away_flag: '', 
        match_time: '', 
        odds_home: 2.0, odds_draw: 3.0, odds_away: 2.0,
        status: 'scheduled'
      });
      fetchMatches();
    }
    setLoading(false);
  };

  const updateOdds = async (id: string, h: number, n: number, a: number) => {
    const { error } = await supabase
      .from('matches')
      .update({ odds_home: h, odds_draw: n, odds_away: a })
      .eq('id', id);
    
    if (!error) {
      setEditingId(null);
      fetchMatches();
    }
  };

  const deleteMatch = async (id: string) => {
    if(confirm("🚨 ATTENTION : Supprimer ce match supprimera tous les paris associés. Confirmer ?")) {
      await supabase.from('matches').delete().eq('id', id);
      fetchMatches();
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">Gestion <span className="text-emerald-500">Matchs</span></h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-1">Configurez les rencontres et les cotes</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className={`w-full md:w-auto px-8 py-3 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-lg ${
            showAddForm ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-emerald-500 text-black hover:scale-105'
          }`}
        >
          {showAddForm ? <><X size={18} /> Annuler</> : <><Plus size={18} /> Nouveau Match</>}
        </button>
      </div>

      {/* FORMULAIRE D'AJOUT */}
      {showAddForm && (
        <form onSubmit={handleAddMatch} className="bg-[#0f1117] border border-white/10 p-8 rounded-[3rem] mb-12 animate-in fade-in zoom-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Colonne Gauche : Équipes */}
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                <Flag size={14} /> Équipes & Drapeaux
              </h3>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <input required placeholder="Équipe Domicile" className="flex-1 bg-black/40 border border-white/5 p-4 rounded-2xl outline-none focus:border-emerald-500 transition-all font-bold" value={newMatch.home_team} onChange={e => setNewMatch({...newMatch, home_team: e.target.value})} />
                  <input required placeholder="🇫🇷" className="w-20 bg-black/40 border border-white/5 p-4 rounded-2xl text-center text-2xl" value={newMatch.home_flag} onChange={e => setNewMatch({...newMatch, home_flag: e.target.value})} />
                </div>
                
                <div className="flex gap-3">
                  <input required placeholder="Équipe Extérieur" className="flex-1 bg-black/40 border border-white/5 p-4 rounded-2xl outline-none focus:border-emerald-500 transition-all font-bold" value={newMatch.away_team} onChange={e => setNewMatch({...newMatch, away_team: e.target.value})} />
                  <input required placeholder="🇧🇪" className="w-20 bg-black/40 border border-white/5 p-4 rounded-2xl text-center text-2xl" value={newMatch.away_flag} onChange={e => setNewMatch({...newMatch, away_flag: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Colonne Droite : Cotes & Date */}
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                <TrendingUp size={14} /> Paramètres de jeu
              </h3>

              <div className="space-y-4">
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <input required type="datetime-local" className="w-full bg-black/40 border border-white/5 p-4 pl-12 rounded-2xl outline-none focus:border-emerald-500 text-slate-300" value={newMatch.match_time} onChange={e => setNewMatch({...newMatch, match_time: e.target.value})} />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase text-center text-slate-600">Cote 1</label>
                    <input required type="number" step="0.01" className="bg-black/40 border border-white/5 p-4 rounded-2xl text-center font-black text-emerald-500" value={newMatch.odds_home} onChange={e => setNewMatch({...newMatch, odds_home: parseFloat(e.target.value)})} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase text-center text-slate-600">Cote N</label>
                    <input required type="number" step="0.01" className="bg-black/40 border border-white/5 p-4 rounded-2xl text-center font-black text-emerald-500" value={newMatch.odds_draw} onChange={e => setNewMatch({...newMatch, odds_draw: parseFloat(e.target.value)})} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase text-center text-slate-600">Cote 2</label>
                    <input required type="number" step="0.01" className="bg-black/40 border border-white/5 p-4 rounded-2xl text-center font-black text-emerald-500" value={newMatch.odds_away} onChange={e => setNewMatch({...newMatch, odds_away: parseFloat(e.target.value)})} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button 
            disabled={loading} 
            className="w-full mt-10 bg-white text-black font-black py-5 rounded-[2rem] hover:bg-emerald-400 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm shadow-xl disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Publier le match dans le lobby'}
          </button>
        </form>
      )}

      {/* LISTE DES MATCHS */}
      <div className="grid gap-4">
        {matches.map(match => (
          <div key={match.id} className={`bg-[#0f1117] border border-white/5 p-6 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 transition-all ${match.status === 'finished' ? 'opacity-50 grayscale' : ''}`}>
            
            {/* Teams */}
            <div className="flex items-center gap-6 flex-1 justify-center md:justify-start">
              <div className="flex flex-col items-center">
                <span className="text-4xl mb-1">{match.home_flag}</span>
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">{match.home_team}</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] font-black text-white/20 block">VS</span>
                <span className="text-[9px] font-bold text-slate-600 uppercase italic">
                  {new Date(match.match_time).toLocaleDateString()}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-4xl mb-1">{match.away_flag}</span>
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">{match.away_team}</span>
              </div>
            </div>

            {/* Odds Edit */}
            <div className="flex items-center gap-2 bg-black/40 p-2.5 rounded-[1.5rem] border border-white/5">
              <span className="text-[8px] font-black text-slate-600 px-2 uppercase vertical-text hidden lg:block">Cotes</span>
              <input disabled={editingId !== match.id} type="number" step="0.01" defaultValue={match.odds_home} className="w-14 bg-transparent text-center font-black text-emerald-500 disabled:opacity-50" id={`h-${match.id}`} />
              <input disabled={editingId !== match.id} type="number" step="0.01" defaultValue={match.odds_draw} className="w-14 bg-transparent text-center font-black text-emerald-500 disabled:opacity-50" id={`n-${match.id}`} />
              <input disabled={editingId !== match.id} type="number" step="0.01" defaultValue={match.odds_away} className="w-14 bg-transparent text-center font-black text-emerald-500 disabled:opacity-50" id={`a-${match.id}`} />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {editingId === match.id ? (
                <button 
                  onClick={() => {
                    const h = (document.getElementById(`h-${match.id}`) as HTMLInputElement).value;
                    const n = (document.getElementById(`n-${match.id}`) as HTMLInputElement).value;
                    const a = (document.getElementById(`a-${match.id}`) as HTMLInputElement).value;
                    updateOdds(match.id, parseFloat(h), parseFloat(n), parseFloat(a));
                  }}
                  className="p-4 bg-emerald-500 text-black rounded-2xl shadow-lg hover:scale-105 transition-transform"
                >
                  <Save size={20} />
                </button>
              ) : (
                <button 
                  onClick={() => setEditingId(match.id)} 
                  disabled={match.status === 'finished'}
                  className="p-4 bg-white/5 text-slate-400 rounded-2xl hover:text-white hover:bg-white/10 transition-all disabled:hidden"
                >
                  <Edit3 size={20} />
                </button>
              )}
              <button 
                onClick={() => deleteMatch(match.id)} 
                className="p-4 bg-white/5 text-slate-400 rounded-2xl hover:text-red-500 hover:bg-red-500/10 transition-all"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}