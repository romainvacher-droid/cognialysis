"use client";
import { useEffect, useState } from "react";
import { IA_PROFILES } from "@/lib/psychology";
import Link from "next/link";

interface HistoryRow {
  id: string;
  mode: string;
  source: string;
  top_ia: string;
  top_score: number;
  created_at: string;
}

export default function HistoryPage() {
  const [rows, setRows] = useState<HistoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session_id = localStorage.getItem("cog_session");
    if (!session_id) { setLoading(false); return; }
    fetch(`/api/history?session_id=${session_id}`)
      .then(r => r.json())
      .then(data => { setRows(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const ia = (id: string) => IA_PROFILES.find(p => p.id === id);

  return (
    <main className="flex flex-col items-center px-4 py-12 max-w-xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-2">Mes résultats</h1>
      <p className="text-gray-400 text-sm mb-8">Historique de tes analyses sur cet appareil</p>

      {loading && <p className="text-gray-500">Chargement...</p>}

      {!loading && rows.length === 0 && (
        <div className="text-center space-y-4">
          <p className="text-gray-400">Aucun résultat enregistré.</p>
          <Link href="/test" className="inline-block px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-sm font-medium transition-colors">
            Faire le test →
          </Link>
        </div>
      )}

      {rows.length > 0 && (
        <div className="w-full space-y-3">
          {rows.map(row => {
            const profile = ia(row.top_ia);
            const date = new Date(row.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
            return (
              <div key={row.id} className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="text-3xl">{profile?.emoji ?? "🤖"}</div>
                <div className="flex-1">
                  <div className="font-semibold">{profile?.name ?? row.top_ia}</div>
                  <div className="text-xs text-gray-500">{row.mode === "test" ? "Test projectif" : row.source} · {date}</div>
                </div>
                <div className="text-lg font-bold" style={{ color: profile?.color ?? "#8b5cf6" }}>
                  {Math.round(row.top_score * 100)}%
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Link href="/" className="mt-8 text-gray-500 hover:text-gray-300 text-sm transition-colors">
        ← Retour à l'accueil
      </Link>
    </main>
  );
}
