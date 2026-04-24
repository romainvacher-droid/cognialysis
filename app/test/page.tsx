"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TEST_QUESTIONS } from "@/lib/psychology";

export default function TestPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  const q = TEST_QUESTIONS[step];
  const progress = Math.round((step / TEST_QUESTIONS.length) * 100);

  function handleNext() {
    if (selected === null) return;
    const next = [...answers, selected];
    setAnswers(next);
    setSelected(null);
    if (step + 1 >= TEST_QUESTIONS.length) {
      router.push(`/result?mode=test&answers=${next.join(",")}`);
    } else {
      setStep(step + 1);
    }
  }

  return (
    <main className="flex flex-col items-center justify-center flex-1 px-4 py-12 max-w-xl mx-auto w-full">
      {/* Progress */}
      <div className="w-full mb-8">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Question {step + 1} / {TEST_QUESTIONS.length}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-violet-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="w-full mb-8 text-center">
        <div className="text-4xl mb-4">{step === 3 ? "🎨" : "💭"}</div>
        <h2 className="text-xl font-semibold text-white">{q.question}</h2>
      </div>

      {/* Options */}
      <div className="w-full space-y-3">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`w-full text-left px-5 py-4 rounded-xl border transition-all ${
              selected === i
                ? "bg-violet-600 border-violet-400 text-white"
                : "bg-gray-900 border-gray-800 hover:border-violet-600 text-gray-300"
            }`}
          >
            {"emoji" in opt && <span className="mr-2 text-lg">{(opt as { emoji: string }).emoji}</span>}
            {opt.text}
          </button>
        ))}
      </div>

      {/* Next */}
      <button
        onClick={handleNext}
        disabled={selected === null}
        className="mt-8 w-full py-3 rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed font-semibold transition-colors"
      >
        {step + 1 >= TEST_QUESTIONS.length ? "Voir mon profil IA →" : "Question suivante →"}
      </button>
    </main>
  );
}
