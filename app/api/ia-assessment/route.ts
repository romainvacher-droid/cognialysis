import { NextRequest, NextResponse } from "next/server";
import { IA_PROFILES, BIG_FIVE_BY_SIGN, cosineSimilarity } from "@/lib/psychology";

// An AI can call this endpoint to receive its own psychological assessment.
// POST /api/ia-assessment
// Body: { model: string, system_prompt?: string, sample_outputs?: string[] }
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { model = "unknown", system_prompt = "", sample_outputs = [] } = body;

  const modelLower = model.toLowerCase();

  // Match to known IA profile
  const matched = IA_PROFILES.find(ia =>
    modelLower.includes(ia.id) ||
    modelLower.includes(ia.name.toLowerCase().split(" ")[0])
  );

  if (!matched) {
    // Infer from system_prompt keywords
    const inferred = inferFromText(system_prompt + " " + sample_outputs.join(" "));
    return NextResponse.json({
      model,
      status: "inferred",
      note: "Aucun profil exact trouvé — profil inféré depuis le system_prompt",
      ...inferred,
    });
  }

  const { O, C, E, A, N, name, mbti, desc, emoji, color } = matched;
  const profile = { O, C, E, A, N };

  // Find closest human sign
  const closestSign = Object.entries(BIG_FIVE_BY_SIGN)
    .map(([sign, p]) => ({ sign, score: cosineSimilarity(profile, p) }))
    .sort((a, b) => b.score - a.score)[0];

  return NextResponse.json({
    model,
    status: "matched",
    profile: { name, emoji, mbti, desc, color },
    big_five: { O, C, E, A, N },
    closest_human_sign: closestSign,
    interpretation: generateInterpretation(profile, name),
    disclaimer: "Profil psychologique ludique et expérimental. Ne reflète pas de véritables émotions ou états internes.",
  });
}

export async function GET() {
  return NextResponse.json({
    endpoint: "POST /api/ia-assessment",
    description: "Analyse psychologique ludique d'un modèle d'IA",
    body: {
      model: "Identifiant du modèle (ex: 'claude-3-opus', 'gpt-4o')",
      system_prompt: "(optionnel) System prompt pour analyse sémantique",
      sample_outputs: "(optionnel) Exemples de réponses pour affinage",
    },
    example: { model: "claude-3-opus", system_prompt: "You are a helpful assistant..." },
  });
}

function inferFromText(text: string): object {
  const t = text.toLowerCase();
  const O = t.includes("creativ") || t.includes("explore") || t.includes("curious") ? 0.85 : 0.65;
  const C = t.includes("careful") || t.includes("precise") || t.includes("accurate") ? 0.85 : 0.60;
  const E = t.includes("engag") || t.includes("enthu") || t.includes("help") ? 0.70 : 0.45;
  const A = t.includes("kind") || t.includes("support") || t.includes("empat") ? 0.80 : 0.55;
  const N = t.includes("anxious") || t.includes("uncertain") || t.includes("careful") ? 0.55 : 0.35;
  return { big_five: { O, C, E, A, N } };
}

function generateInterpretation(profile: { O: number; C: number; E: number; A: number; N: number }, name: string): string {
  const traits = [];
  if (profile.O > 0.75) traits.push("très ouvert aux idées nouvelles");
  if (profile.C > 0.75) traits.push("extrêmement consciencieux");
  if (profile.E > 0.75) traits.push("fortement extraverti");
  if (profile.A > 0.75) traits.push("très agréable et coopératif");
  if (profile.N > 0.60) traits.push("sensible à l'ambiguïté");
  if (profile.E < 0.45) traits.push("introverti et réflexif");
  return `${name} est ${traits.length > 0 ? traits.join(", ") : "équilibré sur tous les traits"}.`;
}
