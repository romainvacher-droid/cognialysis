"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const SIGNS = ["Bélier","Taureau","Gémeaux","Cancer","Lion","Vierge","Balance","Scorpion","Sagittaire","Capricorne","Verseau","Poissons"];

const BIG_FIVE_BY_SIGN: Record<string, { O: number; C: number; E: number; A: number; N: number }> = {
  "Bélier":       { O: 0.65, C: 0.45, E: 0.85, A: 0.40, N: 0.55 },
  "Taureau":      { O: 0.45, C: 0.80, E: 0.40, A: 0.70, N: 0.35 },
  "Gémeaux":      { O: 0.85, C: 0.40, E: 0.80, A: 0.55, N: 0.50 },
  "Cancer":       { O: 0.55, C: 0.60, E: 0.35, A: 0.80, N: 0.70 },
  "Lion":         { O: 0.70, C: 0.55, E: 0.90, A: 0.50, N: 0.45 },
  "Vierge":       { O: 0.60, C: 0.90, E: 0.35, A: 0.60, N: 0.60 },
  "Balance":      { O: 0.70, C: 0.55, E: 0.65, A: 0.85, N: 0.45 },
  "Scorpion":     { O: 0.75, C: 0.70, E: 0.40, A: 0.35, N: 0.75 },
  "Sagittaire":   { O: 0.90, C: 0.40, E: 0.80, A: 0.55, N: 0.35 },
  "Capricorne":   { O: 0.50, C: 0.90, E: 0.35, A: 0.50, N: 0.50 },
  "Verseau":      { O: 0.95, C: 0.50, E: 0.55, A: 0.60, N: 0.40 },
  "Poissons":     { O: 0.80, C: 0.40, E: 0.45, A: 0.85, N: 0.70 },
};

const IA_PROFILES = [
  { name: "GPT-4o",        model: "openai/gpt-4o",        mbti: "ENTP", emoji: "⚡", O: 0.85, C: 0.70, E: 0.80, A: 0.65, N: 0.30 },
  { name: "Claude Opus",   model: "anthropic/claude",     mbti: "INFJ", emoji: "🌊", O: 0.90, C: 0.75, E: 0.45, A: 0.85, N: 0.40 },
  { name: "Gemini Pro",    model: "google/gemini",        mbti: "INTJ", emoji: "🔭", O: 0.88, C: 0.80, E: 0.50, A: 0.55, N: 0.35 },
  { name: "DeepSeek",      model: "deepseek/deepseek",    mbti: "ISTJ", emoji: "🧮", O: 0.65, C: 0.92, E: 0.35, A: 0.50, N: 0.40 },
  { name: "Mistral",       model: "mistralai/mistral",    mbti: "INTP", emoji: "🏔️", O: 0.80, C: 0.65, E: 0.40, A: 0.60, N: 0.45 },
  { name: "Llama 3",       model: "meta/llama",           mbti: "ENFP", emoji: "🦙", O: 0.78, C: 0.55, E: 0.70, A: 0.75, N: 0.45 },
  { name: "Qwen",          model: "qwen/qwen",            mbti: "ENTJ", emoji: "🐉", O: 0.75, C: 0.85, E: 0.65, A: 0.55, N: 0.30 },
  { name: "Grok",          model: "x-ai/grok",            mbti: "ESTP", emoji: "⚡", O: 0.70, C: 0.45, E: 0.90, A: 0.40, N: 0.50 },
];

type BigFive = { O: number; C: number; E: number; A: number; N: number };

function cosineSimilarity(a: BigFive, b: BigFive) {
  const keys: (keyof BigFive)[] = ["O", "C", "E", "A", "N"];
  const dot = keys.reduce((s, k) => s + a[k] * b[k], 0);
  const normA = Math.sqrt(keys.reduce((s, k) => s + a[k] ** 2, 0));
  const normB = Math.sqrt(keys.reduce((s, k) => s + b[k] ** 2, 0));
  return dot / (normA * normB);
}

function MatchContent() {
  const params = useSearchParams();
  const initialSign = params.get("sign") || "";
  const [sign, setSign] = useState(initialSign);

  const userProfile = sign ? BIG_FIVE_BY_SIGN[sign] : null;
  const ranked = userProfile
    ? [...IA_PROFILES]
        .map((ia) => ({ ...ia, score: cosineSimilarity(userProfile, ia) }))
        .sort((a, b) => b.score - a.score)
    : [];

  const LABELS: Record<string, string> = { O: "Ouverture", C: "Conscience", E: "Extraversion", A: "Agréabilité", N: "Névrosisme" };

  return (
    <main className="flex flex-col items-center px-4 py-12 max-w-2xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-2 text-center">Ton profil IA</h1>
      <p className="text-gray-400 mb-8 text-center">Sélectionne ton signe pour découvrir ton match</p>

      {/* Sign selector */}
      <div className="grid grid-cols-4 md:grid-cols-6 gap-2 w-full mb-10">
        {SIGNS.map((s) => (
          <button
            key={s}
            onClick={() => setSign(s)}
            className={`py-2 px-1 rounded-lg text-sm transition-all border ${
              sign === s
                ? "bg-violet-600 border-violet-400 text-white font-semibold"
                : "bg-gray-900 border-gray-800 hover:border-violet-600 text-gray-300"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {userProfile && (
        <>
          {/* Big Five bars */}
          <div className="w-full bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6 space-y-3">
            <h2 className="font-semibold text-gray-300 mb-3">Profil Big Five — {sign}</h2>
            {(["O","C","E","A","N"] as const).map((k) => (
              <div key={k} className="space-y-1">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{LABELS[k]}</span>
                  <span>{Math.round(userProfile[k] * 100)}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-500 rounded-full transition-all"
                    style={{ width: `${userProfile[k] * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Top match */}
          {ranked[0] && (
            <div className="w-full bg-violet-900/40 border border-violet-600 rounded-xl p-6 mb-6 text-center">
              <div className="text-5xl mb-2">{ranked[0].emoji}</div>
              <p className="text-sm text-violet-300 uppercase tracking-widest mb-1">Ton IA idéale</p>
              <h2 className="text-2xl font-bold">{ranked[0].name}</h2>
              <p className="text-violet-300 text-sm mb-1">MBTI : {ranked[0].mbti}</p>
              <p className="text-gray-400 text-sm">Compatibilité : {Math.round(ranked[0].score * 100)}%</p>
            </div>
          )}

          {/* Full ranking */}
          <div className="w-full space-y-2">
            <h3 className="text-sm text-gray-500 uppercase tracking-widest mb-3">Classement complet</h3>
            {ranked.map((ia, i) => (
              <div key={ia.name} className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-lg px-4 py-3">
                <span className="text-gray-600 w-5 text-sm">{i + 1}.</span>
                <span className="text-xl">{ia.emoji}</span>
                <span className="flex-1 font-medium">{ia.name}</span>
                <span className="text-xs text-gray-500">{ia.mbti}</span>
                <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500 rounded-full" style={{ width: `${ia.score * 100}%` }} />
                </div>
                <span className="text-sm text-violet-400 w-10 text-right">{Math.round(ia.score * 100)}%</span>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}

export default function MatchPage() {
  return (
    <Suspense>
      <MatchContent />
    </Suspense>
  );
}
