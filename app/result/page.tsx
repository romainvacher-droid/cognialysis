"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BIG_FIVE_BY_SIGN, computeProfileFromAnswers, rankIAByProfile, TRAIT_LABELS, type BigFive } from "@/lib/psychology";
import Link from "next/link";

function RadarBar({ label, value, color = "#8b5cf6" }: { label: string; value: number; color?: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm text-gray-400">
        <span>{label}</span>
        <span>{Math.round(value * 100)}%</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${value * 100}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function CompatibilityAnalysis({ userProfile, iaProfile }: { userProfile: BigFive; iaProfile: typeof import("@/lib/psychology").IA_PROFILES[0] & { score: number } }) {
  const keys: (keyof BigFive)[] = ["O", "C", "E", "A", "N"];
  const synergies = keys.filter(k => Math.abs(userProfile[k] - iaProfile[k]) < 0.2);
  const frictions = keys.filter(k => Math.abs(userProfile[k] - iaProfile[k]) > 0.35);

  return (
    <div className="space-y-3 text-sm">
      {synergies.length > 0 && (
        <div className="bg-green-900/20 border border-green-800 rounded-lg p-3">
          <p className="text-green-400 font-medium mb-1">✦ Synergies</p>
          <p className="text-gray-300">Vous partagez : {synergies.map(k => TRAIT_LABELS[k]).join(", ")}</p>
        </div>
      )}
      {frictions.length > 0 && (
        <div className="bg-orange-900/20 border border-orange-800 rounded-lg p-3">
          <p className="text-orange-400 font-medium mb-1">⚡ Points de friction</p>
          <p className="text-gray-300">Divergence sur : {frictions.map(k => TRAIT_LABELS[k]).join(", ")}</p>
        </div>
      )}
    </div>
  );
}

function ResultContent() {
  const params = useSearchParams();
  const mode = params.get("mode") || "sign";
  const sign = params.get("sign") || "";
  const answersRaw = params.get("answers") || "";

  let profile: BigFive | null = null;
  let source = "";

  if (mode === "test" && answersRaw) {
    const answers = answersRaw.split(",").map(Number);
    profile = computeProfileFromAnswers(answers);
    source = "Test projectif (5 questions)";
  } else if (mode === "sign" && sign && BIG_FIVE_BY_SIGN[sign]) {
    profile = BIG_FIVE_BY_SIGN[sign];
    source = `Signe astrologique — ${sign}`;
  }

  if (!profile) {
    return (
      <main className="flex flex-col items-center justify-center flex-1 px-4 py-20 text-center">
        <p className="text-gray-400">Aucun profil trouvé.</p>
        <Link href="/" className="mt-4 text-violet-400 hover:underline">Recommencer</Link>
      </main>
    );
  }

  const ranked = rankIAByProfile(profile);
  const top = ranked[0];
  const keys: (keyof BigFive)[] = ["O", "C", "E", "A", "N"];

  return (
    <main className="flex flex-col items-center px-4 py-12 max-w-2xl mx-auto w-full">
      <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">{source}</p>
      <h1 className="text-3xl font-bold mb-8 text-center">Ton profil IA</h1>

      {/* Top match */}
      <div className="w-full rounded-2xl p-6 mb-6 text-center border-2" style={{ borderColor: top.color, background: `${top.color}15` }}>
        <div className="text-5xl mb-2">{top.emoji}</div>
        <p className="text-sm uppercase tracking-widest mb-1" style={{ color: top.color }}>Ton IA idéale</p>
        <h2 className="text-2xl font-bold">{top.name}</h2>
        <p className="text-gray-400 text-sm mb-1">{top.provider} · MBTI {top.mbti}</p>
        <p className="text-gray-300 text-sm mb-3">{top.desc}</p>
        <p className="text-lg font-semibold" style={{ color: top.color }}>{Math.round(top.score * 100)}% de compatibilité</p>
      </div>

      {/* Compatibility analysis */}
      <div className="w-full mb-6">
        <CompatibilityAnalysis userProfile={profile} iaProfile={top} />
      </div>

      {/* Big Five profile */}
      <div className="w-full bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6 space-y-3">
        <h3 className="font-semibold text-gray-300 mb-3">Ton profil Big Five</h3>
        {keys.map(k => (
          <RadarBar key={k} label={TRAIT_LABELS[k]} value={profile![k]} color={top.color} />
        ))}
      </div>

      {/* Full ranking */}
      <div className="w-full space-y-2 mb-8">
        <h3 className="text-sm text-gray-500 uppercase tracking-widest mb-3">Classement complet</h3>
        {ranked.map((ia, i) => (
          <div key={ia.id} className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-lg px-4 py-3">
            <span className="text-gray-600 w-5 text-sm">{i + 1}.</span>
            <span className="text-xl">{ia.emoji}</span>
            <span className="flex-1 font-medium text-sm">{ia.name}</span>
            <span className="text-xs text-gray-500">{ia.mbti}</span>
            <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${ia.score * 100}%`, backgroundColor: ia.color }} />
            </div>
            <span className="text-sm w-9 text-right" style={{ color: ia.color }}>{Math.round(ia.score * 100)}%</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="w-full grid grid-cols-2 gap-3">
        <Link href="/test" className="py-3 rounded-full border border-violet-600 text-violet-400 hover:bg-violet-600 hover:text-white text-center text-sm font-medium transition-colors">
          Refaire le test
        </Link>
        <Link href="/" className="py-3 rounded-full bg-gray-900 border border-gray-800 hover:border-gray-600 text-center text-sm font-medium transition-colors">
          Accueil
        </Link>
      </div>
    </main>
  );
}

export default function ResultPage() {
  return <Suspense><ResultContent /></Suspense>;
}
