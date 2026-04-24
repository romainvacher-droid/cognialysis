"use client";
import { useState } from "react";
import { IA_PROFILES, cosineSimilarity, TRAIT_LABELS, type BigFive } from "@/lib/psychology";
import dynamic from "next/dynamic";

const RadarChart = dynamic(() => import("@/components/RadarChart"), { ssr: false });

const KEYS: (keyof BigFive)[] = ["O", "C", "E", "A", "N"];

export default function ComparePage() {
  const [iaA, setIaA] = useState(IA_PROFILES[0].id);
  const [iaB, setIaB] = useState(IA_PROFILES[1].id);

  const profileA = IA_PROFILES.find(p => p.id === iaA)!;
  const profileB = IA_PROFILES.find(p => p.id === iaB)!;

  const bfA: BigFive = { O: profileA.O, C: profileA.C, E: profileA.E, A: profileA.A, N: profileA.N };
  const bfB: BigFive = { O: profileB.O, C: profileB.C, E: profileB.E, A: profileB.A, N: profileB.N };

  const similarity = cosineSimilarity(bfA, bfB);
  const synergies  = KEYS.filter(k => Math.abs(bfA[k] - bfB[k]) < 0.15);
  const frictions  = KEYS.filter(k => Math.abs(bfA[k] - bfB[k]) > 0.30);
  const dominant   = KEYS.map(k => ({
    k,
    diff: bfA[k] - bfB[k],
    label: TRAIT_LABELS[k],
  })).sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));

  return (
    <main className="flex flex-col items-center px-4 py-12 max-w-2xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-2 text-center">Comparer deux IA</h1>
      <p className="text-gray-400 mb-8 text-center text-sm">Qui est le plus proche de toi psychologiquement ?</p>

      {/* Selectors */}
      <div className="grid grid-cols-2 gap-4 w-full mb-8">
        {[{ val: iaA, set: setIaA, profile: profileA }, { val: iaB, set: setIaB, profile: profileB }].map(({ val, set, profile }, i) => (
          <div key={i} className="space-y-2">
            <select
              value={val}
              onChange={e => set(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
            >
              {IA_PROFILES.map(p => (
                <option key={p.id} value={p.id}>{p.emoji} {p.name}</option>
              ))}
            </select>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center"
              style={{ borderColor: profile.color + "60" }}>
              <div className="text-4xl mb-1">{profile.emoji}</div>
              <div className="font-bold">{profile.name}</div>
              <div className="text-xs text-gray-500">{profile.mbti}</div>
              <div className="text-xs text-gray-400 mt-2">{profile.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Radar chart */}
      <div className="w-full bg-gray-900 border border-gray-800 rounded-xl p-6 flex justify-center mb-6">
        <RadarChart
          profiles={[
            { data: bfA, color: profileA.color, label: profileA.name },
            { data: bfB, color: profileB.color, label: profileB.name },
          ]}
          size={280}
        />
      </div>

      {/* Similarity score */}
      <div className="w-full bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6 text-center">
        <p className="text-gray-500 text-sm mb-1">Similarité psychologique</p>
        <p className="text-4xl font-bold" style={{ color: similarity > 0.9 ? "#10b981" : similarity > 0.8 ? "#f59e0b" : "#ef4444" }}>
          {Math.round(similarity * 100)}%
        </p>
        <p className="text-gray-400 text-sm mt-1">
          {similarity > 0.92 ? "Quasi-identiques — mêmes forces, mêmes angles morts." :
           similarity > 0.85 ? "Proches — quelques divergences intéressantes." :
           similarity > 0.75 ? "Complémentaires — leurs différences sont leurs atouts." :
           "Très différents — ensemble, ils couvrent presque tout."}
        </p>
      </div>

      {/* Analysis */}
      <div className="w-full space-y-3 mb-8">
        {synergies.length > 0 && (
          <div className="bg-green-900/20 border border-green-800 rounded-xl p-4">
            <p className="text-green-400 font-medium mb-1">✦ Traits partagés</p>
            <p className="text-gray-300 text-sm">{synergies.map(k => TRAIT_LABELS[k]).join(" · ")}</p>
          </div>
        )}
        {frictions.length > 0 && (
          <div className="bg-orange-900/20 border border-orange-800 rounded-xl p-4">
            <p className="text-orange-400 font-medium mb-1">⚡ Divergences majeures</p>
            <div className="space-y-1">
              {frictions.map(k => {
                const diff = bfA[k] - bfB[k];
                const leader = diff > 0 ? profileA : profileB;
                return (
                  <p key={k} className="text-gray-300 text-sm">
                    <span className="font-medium" style={{ color: leader.color }}>{leader.name}</span> est plus {TRAIT_LABELS[k].toLowerCase()} (+{Math.round(Math.abs(diff) * 100)}pts)
                  </p>
                );
              })}
            </div>
          </div>
        )}

        {/* Dominant trait breakdown */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-gray-400 font-medium mb-3 text-sm">Écarts par dimension</p>
          {dominant.map(({ k, diff, label }) => {
            const absD = Math.abs(diff);
            const leader = diff > 0 ? profileA : profileB;
            return (
              <div key={k} className="flex items-center gap-3 mb-2">
                <span className="text-gray-500 text-xs w-24">{label}</span>
                <div className="flex-1 relative h-2 bg-gray-800 rounded-full overflow-hidden">
                  {/* A bar */}
                  <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: `${bfA[k] * 100}%`, backgroundColor: profileA.color, opacity: 0.6 }} />
                  {/* B bar */}
                  <div className="absolute left-0 top-0 h-full rounded-full border-r-2" style={{ width: `${bfB[k] * 100}%`, backgroundColor: profileB.color, opacity: 0.4, borderColor: profileB.color }} />
                </div>
                <span className="text-xs w-10 text-right" style={{ color: absD > 0.3 ? leader.color : "#6b7280" }}>
                  {absD > 0.05 ? `+${Math.round(absD * 100)}` : "≈"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
