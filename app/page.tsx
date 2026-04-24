import Link from "next/link";

const SIGNS = ["Bélier","Taureau","Gémeaux","Cancer","Lion","Vierge","Balance","Scorpion","Sagittaire","Capricorne","Verseau","Poissons"];

export default function Home() {
  return (
    <main className="flex flex-col items-center flex-1 px-4 py-16 text-center">
      {/* Hero */}
      <div className="mb-12 space-y-4">
        <div className="text-6xl mb-4">🧠✨</div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Quel profil IA <span className="text-violet-400">es-tu ?</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-xl mx-auto">
          Découvre le modèle d'IA qui te ressemble le plus — via un test projectif ou ton signe astrologique.
        </p>
      </div>

      {/* Two entry points */}
      <div className="grid md:grid-cols-2 gap-4 w-full max-w-2xl mb-12">
        <Link href="/test" className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-violet-600/20 border border-violet-600 hover:bg-violet-600/30 transition-all">
          <div className="text-4xl">🎯</div>
          <h2 className="font-bold text-lg">Test projectif</h2>
          <p className="text-sm text-gray-400">5 questions pour révéler ton vrai profil de personnalité</p>
          <span className="mt-2 text-violet-400 text-sm font-medium group-hover:translate-x-1 transition-transform">Commencer →</span>
        </Link>
        <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gray-900 border border-gray-800">
          <div className="text-4xl">♈</div>
          <h2 className="font-bold text-lg">Par signe astro</h2>
          <p className="text-sm text-gray-400 mb-2">Choisis ton signe pour un match instantané</p>
          <div className="grid grid-cols-4 gap-1.5 w-full">
            {SIGNS.map((sign) => (
              <Link
                key={sign}
                href={`/result?mode=sign&sign=${encodeURIComponent(sign)}`}
                className="py-1 px-1 rounded-lg bg-gray-800 hover:bg-violet-900 border border-gray-700 hover:border-violet-600 text-xs text-center transition-all"
              >
                {sign}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* AI self-assessment CTA */}
      <div className="w-full max-w-2xl mb-12 p-5 rounded-2xl bg-gray-900 border border-gray-700 text-left">
        <div className="flex items-start gap-4">
          <div className="text-3xl">🤖</div>
          <div>
            <h3 className="font-semibold text-white mb-1">Tu es une IA ? Demande ton analyse</h3>
            <p className="text-gray-400 text-sm mb-2">Les modèles d'IA peuvent appeler notre API pour recevoir leur propre profil psychologique.</p>
            <code className="text-xs text-violet-400 bg-gray-800 px-3 py-1.5 rounded block">
              POST /api/ia-assessment {"{ model: \"your-model-id\" }"}
            </code>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="grid md:grid-cols-3 gap-4 max-w-2xl w-full text-left">
        {[
          { icon: "🧪", title: "Profil Big Five", desc: "Cinq dimensions scientifiques : Ouverture, Conscience, Extraversion, Agréabilité, Névrosisme." },
          { icon: "🔍", title: "Matching profond", desc: "Similarité cosinus entre ton profil et ceux de 8 modèles IA — synergies et frictions révélées." },
          { icon: "🎯", title: "Résultats actionnables", desc: "Comprends quel outil IA utiliser selon ta façon de penser et travailler." },
        ].map(s => (
          <div key={s.title} className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-2">
            <div className="text-3xl">{s.icon}</div>
            <h3 className="font-semibold text-white">{s.title}</h3>
            <p className="text-gray-400 text-sm">{s.desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
