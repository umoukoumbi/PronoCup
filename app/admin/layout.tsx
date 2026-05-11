"use client";

import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ArrowLeft, 
  Trophy, 
  CheckCircle, 
  BarChart3 
} from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#05070a] text-white">
      {/* Sidebar Admin */}
      <aside className="w-64 border-r border-white/5 bg-black/40 backdrop-blur-xl p-6 flex flex-col gap-8">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-4">
          <ArrowLeft size={16} /> Retour au site
        </Link>
        
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 px-2 text-center">Console Admin</p>
          
          <AdminNavLink href="/admin" icon={<LayoutDashboard size={18} />} label="Vue d'ensemble" />
          <AdminNavLink href="/admin/matches" icon={<Trophy size={18} />} label="Gestion Matchs" />
          <AdminNavLink href="/admin/results" icon={<CheckCircle size={18} />} label="Saisir Résultats" />
          <AdminNavLink href="/admin/groups" icon={<Users size={18} />} label="Gestion Groupes" />
        </div>
      </aside>

      {/* Zone de contenu */}
      <main className="flex-1 p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

function AdminNavLink({ href, icon, label }: { href: string, icon: any, label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-emerald-400 transition-all font-bold text-sm">
      {icon} {label}
    </Link>
  );
}