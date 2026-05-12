"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface QuizOption {
  id: string;
  content: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  id: string;
  prompt: string;
  explanation: string;
  options: QuizOption[];
}

interface QuizPanelProps {
  questions: QuizQuestion[];
}

export function QuizPanel({ questions }: QuizPanelProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const question = questions[0];

  if (!question) {
    return (
      <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">No quiz configured for this lesson yet.</p>
      </section>
    );
  }

  const selected = question.options.find((option) => option.id === selectedOptionId) ?? null;

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="text-lg font-semibold">Knowledge check</h2>
      <p className="mt-3 text-sm">{question.prompt}</p>
      <div className="mt-4 space-y-2" role="radiogroup" aria-label="Quiz options">
        {question.options.map((option) => (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={selectedOptionId === option.id}
            onClick={() => setSelectedOptionId(option.id)}
            className="w-full rounded-md border border-zinc-200 px-3 py-2 text-left text-sm hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"
          >
            {option.content}
          </button>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <Button disabled={!selectedOptionId} onClick={() => setSubmitted(true)}>
          Submit answer
        </Button>
        {submitted && selected ? (
          <p className={selected.isCorrect ? "text-sm text-emerald-600" : "text-sm text-amber-600"}>
            {selected.isCorrect ? "Correct!" : "Not quite."} {question.explanation}
          </p>
        ) : null}
      </div>
    </section>
  );
}
