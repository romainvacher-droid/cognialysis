"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BIG_FIVE_BY_SIGN, computeProfileFromAnswers, rankIAByProfile, TRAIT_LABELS, type BigFive } from "@/lib/psychology";
import Link from "next/link";
import dynamic from "next/dynamic";

const RadarChart = dynamic(() => import("@/components/RadarChart"), { ssr: false });

const KEYS: (keyof BigFive)[] = ["O", "C", "E", "A", "N"];

function getOrCreateSession(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("cog_session");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("cog_session", id);
  }
  return id;
}

function CompatibilityInsight({ userProfile, iaProfile }: {
  userProfile: BigFive;
  iaProfile: ReturnType<typeof rankIAByProfile>[0];
}) {
  const synergies = KEYS.filter(k => Math.abs(userProfile[k] - iaProfile[k]) < 0.15);
  const frictions = KEYS.filter(k => Math.abs(userProfile[k] - iaProfile[k]) > 0.32);
  return (
    <div className="space-y-2">
      {synergies.length > 0 && (
        <div className="bg-green-900/20 border border-green-800 rounded-xl p-3">
          <p className="text-green-400 text-sm font-medium mb-0.5">✦ En harmonie</p>
          <p className="text-gray-300 text-sm">{synergies.map(k => TRAIT_LABELS[k]).join(" · ")}</p>
        </div>
      )}
      {frictions.length > 0 && (
        <div className="bg-orange-900/20 border border-orange-800 rounded-xl p-3">
          <p className="text-orange-400 text-sm font-medium mb-0.5">⚡ Points de friction</p>
          <p className="text-gray-300 text-sm">{frictions.map(k => TRAIT_LABELS[k]).join(" · ")}</p>
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

  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  let profile: BigFive | null = null;
  let source = "";

  if (mode === "test" && answersRaw) {
    profile = computeProfileFromAnswers(answersRaw.split(",").map(Number));
    source = "Test projectif";
  } else if (sign && BIG_FIVE_BY_SIGN[sign]) {
    profile = BIG_FIVE_BY_SIGN[sign];
    source = sign;
  }

  const ranked = profile ? rankIAByProfile(profile) : [];
  const top = ranked[0];

  // Auto-save on mount
  useEffect(() => {
    if (!profile || !top || saved) return;
    const session_id = getOrCreateSession();
    fetch("/api/save-result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id, mode, source,
        big_five: profile,
        top_ia: top.id,
        top_score: top.score,
        all_scores: Object.fromEntries(ranked.map(r => [r.id, r.score])),
      }),
    }).then(() => setSaved(true)).catch(() => {});
  }, []);  // eslint-disable-line

  if (!profile || !top) {
    return (
      <main className="flex flex-col items-center justify-center flex-1 px-4 py-20 text-center">
        <p className="text-gray-400 mb-4">Aucun profil trouvé.</p>
        <Link href="/" className="text-violet-400 hover:underline">Recommencer</Link>
      </main>
    );
  }

  const ogUrl = `/api/og?ia=${top.id}&score=${top.score.toFixed(3)}&source=${encodeURIComponent(source)}&mode=${mode}`;
  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/result?mode=${mode}&${mode === "test" ? `answers=${answersRaw}` : `sign=${encodeURIComponent(sign)}`}`
    : "";

  function handleShare() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <main className="flex flex-col items-center px-4 py-12 max-w-2xl mx-auto w-full">
      <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">{source}</p>
      <h1 className="text-3xl font-bold mb-8 text-center">Ton profil IA</h1>

      {/* Top match */}
      <div className="w-full rounded-2xl p-6 mb-4 text-center border-2" style={{ borderColor: top.color, background: `${top.color}15` }}>
        <div className="text-5xl mb-2">{top.emoji}</div>
        <p className="text-sm uppercase tracking-widest mb-1" style={{ color: top.color }}>Ton IA idéale</p>
        <h2 className="text-2xl font-bold">{top.name}</h2>
        <p className="text-gray-400 text-sm mb-1">{top.provider} · MBTI {top.mbti}</p>
        <p className="text-gray-300 text-sm mb-3">{top.desc}</p>
        <p className="text-2xl font-bold" style={{ color: top.color }}>{Math.round(top.score * 100)}%</p>
      </div>

      {/* Insights */}
      <div className="w-full mb-6">
        <CompatibilityInsight userProfile={profile} iaProfile={top} />
      </div>

      {/* Radar chart — toi vs top IA */}
      <div className="w-full bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col items-center mb-6">
        <p className="text-sm text-gray-500 mb-4">Toi vs {top.name}</p>
        <RadarChart
          profiles={[
            { data: profile, color: "#8b5cf6", label: "Toi" },
            { data: { O: top.O, C: top.C, E: top.E, A: top.A, N: top.N }, color: top.color, label: top.name },
          ]}
          size={260}
        />
      </div>

      {/* Full ranking */}
      <div className="w-full space-y-2 mb-6">
        <h3 className="text-sm text-gray-500 uppercase tracking-widest mb-3">Classement</h3>
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

      {/* Actions */}
      <div className="w-full grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={handleShare}
          className="py-3 rounded-full bg-violet-600 hover:bg-violet-500 font-medium text-sm transition-colors"
        >
          {copied ? "✓ Lien copié !" : "Partager mon résultat"}
        </button>
        <Link
          href="/compare"
          className="py-3 rounded-full border border-gray-700 hover:border-gray-500 text-center text-sm font-medium transition-colors"
        >
          Comparer deux IA
        </Link>
      </div>
      <div className="w-full grid grid-cols-2 gap-3">
        <Link href="/test" className="py-3 rounded-full border border-violet-800 text-violet-400 hover:bg-violet-900/30 text-center text-sm font-medium transition-colors">
          Refaire le test
        </Link>
        <Link href="/history" className="py-3 rounded-full bg-gray-900 border border-gray-800 hover:border-gray-600 text-center text-sm font-medium transition-colors">
          Mes résultats
        </Link>
      </div>
    </main>
  );
}

export default function ResultPage() {
  return <Suspense><ResultContent /></Suspense>;
}
