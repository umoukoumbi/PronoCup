"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, Users } from 'lucide-react';

export default function AdminGroups() {
  const [leagues, setLeagues] = useState<any[]>([]);

  useEffect(() => {
    const fetchLeagues = async () => {
      const { data } = await supabase.from('leagues').select('*, league_members(count)');
      setLeagues(data || []);
    };
    fetchLeagues();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-black uppercase mb-10">Ligues Utilisateurs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {leagues.map(league => (
          <div key={league.id} className="bg-slate-900/40 border border-white/5 p-6 rounded-3xl flex justify-between items-center">
            <div>
              <h3 className="text-xl font-black text-emerald-500 uppercase">{league.name}</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
                Code: {league.invite_code} • {league.league_members[0].count} Membres
              </p>
            </div>
            <button className="text-slate-600 hover:text-red-500 transition-colors p-2">
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}