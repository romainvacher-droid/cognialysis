import Link from "next/link";

const SIGNS = ["Bélier","Taureau","Gémeaux","Cancer","Lion","Vierge","Balance","Scorpion","Sagittaire","Capricorne","Verseau","Poissons"];

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center flex-1 px-4 py-20 text-center">
      {/* Hero */}
      <div className="mb-12 space-y-4">
        <div className="text-6xl mb-4">🧠✨</div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Quel profil IA <span className="text-violet-400">es-tu ?</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-xl mx-auto">
          Ton signe astrologique révèle ta personnalité Big Five. Découvre le modèle d'IA qui te ressemble le plus.
        </p>
        <Link
          href="/match"
          className="inline-block mt-6 px-8 py-3 rounded-full bg-violet-600 hover:bg-violet-500 font-semibold text-white transition-colors"
        >
          Découvrir mon profil IA →
        </Link>
      </div>

      {/* Signs grid */}
      <div className="w-full max-w-2xl">
        <p className="text-sm text-gray-500 mb-4 uppercase tracking-widest">Choisir son signe</p>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {SIGNS.map((sign) => (
            <Link
              key={sign}
              href={`/match?sign=${encodeURIComponent(sign)}`}
              className="py-2 px-1 rounded-lg bg-gray-900 hover:bg-violet-900 border border-gray-800 hover:border-violet-600 text-sm text-center transition-all"
            >
              {sign}
            </Link>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="mt-20 grid md:grid-cols-3 gap-6 max-w-3xl w-full text-left">
        {[
          { icon: "♈", title: "Ton signe", desc: "Chaque signe astrologique est associé à un profil Big Five (OCEAN) unique." },
          { icon: "📊", title: "Big Five", desc: "Ouverture, Conscience, Extraversion, Agréabilité, Névrosisme — les 5 dimensions de ta personnalité." },
          { icon: "🤖", title: "Ton IA", desc: "Chaque modèle IA a son propre profil de personnalité. Lequel te correspond ?" },
        ].map((step) => (
          <div key={step.title} className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-2">
            <div className="text-3xl">{step.icon}</div>
            <h3 className="font-semibold text-white">{step.title}</h3>
            <p className="text-gray-400 text-sm">{step.desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
