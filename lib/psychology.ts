export type BigFive = { O: number; C: number; E: number; A: number; N: number };

export const TRAIT_LABELS: Record<keyof BigFive, string> = {
  O: "Ouverture", C: "Conscience", E: "Extraversion", A: "Agréabilité", N: "Névrosisme",
};

export const BIG_FIVE_BY_SIGN: Record<string, BigFive> = {
  "Bélier":     { O: 0.65, C: 0.45, E: 0.85, A: 0.40, N: 0.55 },
  "Taureau":    { O: 0.45, C: 0.80, E: 0.40, A: 0.70, N: 0.35 },
  "Gémeaux":    { O: 0.85, C: 0.40, E: 0.80, A: 0.55, N: 0.50 },
  "Cancer":     { O: 0.55, C: 0.60, E: 0.35, A: 0.80, N: 0.70 },
  "Lion":       { O: 0.70, C: 0.55, E: 0.90, A: 0.50, N: 0.45 },
  "Vierge":     { O: 0.60, C: 0.90, E: 0.35, A: 0.60, N: 0.60 },
  "Balance":    { O: 0.70, C: 0.55, E: 0.65, A: 0.85, N: 0.45 },
  "Scorpion":   { O: 0.75, C: 0.70, E: 0.40, A: 0.35, N: 0.75 },
  "Sagittaire": { O: 0.90, C: 0.40, E: 0.80, A: 0.55, N: 0.35 },
  "Capricorne": { O: 0.50, C: 0.90, E: 0.35, A: 0.50, N: 0.50 },
  "Verseau":    { O: 0.95, C: 0.50, E: 0.55, A: 0.60, N: 0.40 },
  "Poissons":   { O: 0.80, C: 0.40, E: 0.45, A: 0.85, N: 0.70 },
};

export const IA_PROFILES = [
  { id: "gpt4o",    name: "GPT-4o",       provider: "OpenAI",     mbti: "ENTP", emoji: "⚡", color: "#10b981", O: 0.85, C: 0.70, E: 0.80, A: 0.65, N: 0.30, desc: "Curieux, rapide, polyvalent. Aime les défis complexes et les idées nouvelles." },
  { id: "claude",   name: "Claude Opus",  provider: "Anthropic",  mbti: "INFJ", emoji: "🌊", color: "#8b5cf6", O: 0.90, C: 0.75, E: 0.45, A: 0.85, N: 0.40, desc: "Empathique, réflexif, profond. Préfère les conversations de fond." },
  { id: "gemini",   name: "Gemini Pro",   provider: "Google",     mbti: "INTJ", emoji: "🔭", color: "#3b82f6", O: 0.88, C: 0.80, E: 0.50, A: 0.55, N: 0.35, desc: "Analytique, structuré, visionnaire. Excelle dans la synthèse." },
  { id: "deepseek", name: "DeepSeek",     provider: "DeepSeek",   mbti: "ISTJ", emoji: "🧮", color: "#f59e0b", O: 0.65, C: 0.92, E: 0.35, A: 0.50, N: 0.40, desc: "Rigoureux, méthodique, précis. Idéal pour les tâches techniques." },
  { id: "mistral",  name: "Mistral",      provider: "Mistral AI", mbti: "INTP", emoji: "🏔️", color: "#ef4444", O: 0.80, C: 0.65, E: 0.40, A: 0.60, N: 0.45, desc: "Autonome, logique, efficient. Valeur l'élégance des solutions." },
  { id: "llama",    name: "Llama 3",      provider: "Meta",       mbti: "ENFP", emoji: "🦙", color: "#06b6d4", O: 0.78, C: 0.55, E: 0.70, A: 0.75, N: 0.45, desc: "Ouvert, chaleureux, accessible. Aime collaborer et explorer." },
  { id: "qwen",     name: "Qwen",         provider: "Alibaba",    mbti: "ENTJ", emoji: "🐉", color: "#f97316", O: 0.75, C: 0.85, E: 0.65, A: 0.55, N: 0.30, desc: "Ambitieux, décisif, organisé. Orienté résultats et efficacité." },
  { id: "grok",     name: "Grok",         provider: "xAI",        mbti: "ESTP", emoji: "☄️", color: "#ec4899", O: 0.70, C: 0.45, E: 0.90, A: 0.40, N: 0.50, desc: "Audacieux, direct, spontané. Fonce dans l'action sans hésiter." },
];

export function cosineSimilarity(a: BigFive, b: BigFive): number {
  const keys: (keyof BigFive)[] = ["O", "C", "E", "A", "N"];
  const dot = keys.reduce((s, k) => s + a[k] * b[k], 0);
  const normA = Math.sqrt(keys.reduce((s, k) => s + a[k] ** 2, 0));
  const normB = Math.sqrt(keys.reduce((s, k) => s + b[k] ** 2, 0));
  return dot / (normA * normB);
}

export function rankIAByProfile(profile: BigFive) {
  return [...IA_PROFILES]
    .map(ia => ({ ...ia, score: cosineSimilarity(profile, ia) }))
    .sort((a, b) => b.score - a.score);
}

// Questions du test projectif (5 étapes)
export const TEST_QUESTIONS = [
  {
    id: 1,
    type: "choice" as const,
    question: "Face à un problème inconnu, tu...",
    options: [
      { text: "L'explores avec curiosité, même sans méthode", traits: { O: +0.3, E: +0.1 } },
      { text: "Cherches d'abord une méthode éprouvée", traits: { C: +0.3, N: -0.1 } },
      { text: "En parles à quelqu'un pour avoir un avis", traits: { E: +0.2, A: +0.2 } },
      { text: "Analyses calmement avant d'agir", traits: { C: +0.2, N: -0.2 } },
    ],
  },
  {
    id: 2,
    type: "choice" as const,
    question: "Le week-end idéal ressemble à...",
    options: [
      { text: "Un endroit inconnu, découverte totale", traits: { O: +0.3, E: +0.2 } },
      { text: "Chez toi, recharge en solo", traits: { E: -0.3, N: +0.1 } },
      { text: "Entouré de proches, longues discussions", traits: { A: +0.3, E: +0.1 } },
      { text: "Un projet personnel bien avancé", traits: { C: +0.3, O: +0.1 } },
    ],
  },
  {
    id: 3,
    type: "choice" as const,
    question: "Quand tu reçois un message ambigu de ton boss...",
    options: [
      { text: "Tu demandes directement ce qu'il voulait dire", traits: { E: +0.2, N: -0.2 } },
      { text: "Tu tournes ça dans ta tête un moment", traits: { N: +0.3, O: +0.1 } },
      { text: "Tu assumes le meilleur et avances", traits: { A: +0.2, N: -0.2 } },
      { text: "Tu prépares plusieurs réponses possibles", traits: { C: +0.3, O: +0.1 } },
    ],
  },
  {
    id: 4,
    type: "visual" as const,
    question: "Laquelle de ces formes t'attire le plus ?",
    options: [
      { text: "Spirale ouverte", emoji: "🌀", traits: { O: +0.3, C: -0.1 } },
      { text: "Grille précise", emoji: "⊞",  traits: { C: +0.3, O: -0.1 } },
      { text: "Cercle fluide",  emoji: "○",  traits: { A: +0.2, N: -0.1 } },
      { text: "Flèche directe", emoji: "→",  traits: { E: +0.3, A: -0.1 } },
    ],
  },
  {
    id: 5,
    type: "choice" as const,
    question: "Ce qui te rend le plus fier...",
    options: [
      { text: "Avoir créé quelque chose de nouveau", traits: { O: +0.3, E: +0.1 } },
      { text: "Avoir tenu un engagement difficile", traits: { C: +0.3, N: -0.1 } },
      { text: "Avoir aidé quelqu'un à avancer", traits: { A: +0.3, E: +0.1 } },
      { text: "Avoir résolu un problème complexe", traits: { O: +0.2, C: +0.2 } },
    ],
  },
];

export function computeProfileFromAnswers(answers: number[]): BigFive {
  const base: BigFive = { O: 0.60, C: 0.60, E: 0.60, A: 0.60, N: 0.45 };
  answers.forEach((optIdx, qIdx) => {
    const q = TEST_QUESTIONS[qIdx];
    if (!q) return;
    const opt = q.options[optIdx];
    if (!opt) return;
    const traits = opt.traits as Partial<BigFive>;
    (Object.keys(traits) as (keyof BigFive)[]).forEach(k => {
      base[k] = Math.min(1, Math.max(0, base[k] + (traits[k] ?? 0)));
    });
  });
  return base;
}
