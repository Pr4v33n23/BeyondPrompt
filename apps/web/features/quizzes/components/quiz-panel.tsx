"use client";

import { useState } from "react";
import { toast } from "sonner";
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
  lessonId: string;
  questions: QuizQuestion[];
}

export function QuizPanel({ lessonId, questions }: QuizPanelProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);

  if (questions.length === 0) {
    return (
      <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">No quiz configured for this lesson yet.</p>
      </section>
    );
  }

  async function handleSubmit() {
    const allAnswered = questions.every((q) => answers[q.id]);
    if (!allAnswered) {
      toast.error("Please answer all questions before submitting.");
      return;
    }
    setPending(true);
    try {
      const res = await fetch("/api/v1/quiz-attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          answers: Object.entries(answers).map(([questionId, optionId]) => ({
            questionId,
            optionId,
          })),
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
      toast.success("Quiz submitted!");
    } catch {
      toast.error("Could not submit quiz. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="space-y-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="text-lg font-semibold">Knowledge check</h2>
      {questions.map((question, idx) => {
        const selectedOptionId = answers[question.id] ?? null;
        const selectedOption = question.options.find((o) => o.id === selectedOptionId) ?? null;

        return (
          <div key={question.id} className="space-y-3">
            <p className="text-sm font-medium">
              {idx + 1}. {question.prompt}
            </p>
            <div className="space-y-2" role="radiogroup" aria-label={`Question ${idx + 1} options`}>
              {question.options.map((option) => {
                let optionClass =
                  "w-full rounded-md border border-zinc-200 px-3 py-2 text-left text-sm hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900";
                if (submitted) {
                  if (option.isCorrect) {
                    optionClass =
                      "w-full rounded-md border border-emerald-400 bg-emerald-50 px-3 py-2 text-left text-sm dark:border-emerald-600 dark:bg-emerald-900/20";
                  } else if (option.id === selectedOptionId && !option.isCorrect) {
                    optionClass =
                      "w-full rounded-md border border-red-400 bg-red-50 px-3 py-2 text-left text-sm dark:border-red-600 dark:bg-red-900/20";
                  }
                } else if (option.id === selectedOptionId) {
                  optionClass =
                    "w-full rounded-md border border-zinc-900 bg-zinc-100 px-3 py-2 text-left text-sm dark:border-zinc-200 dark:bg-zinc-800";
                }

                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={selectedOptionId === option.id}
                    disabled={submitted}
                    onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: option.id }))}
                    className={optionClass}
                  >
                    {option.content}
                  </button>
                );
              })}
            </div>
            {submitted && selectedOption && (
              <p
                className={
                  selectedOption.isCorrect
                    ? "text-sm text-emerald-600 dark:text-emerald-400"
                    : "text-sm text-red-600 dark:text-red-400"
                }
              >
                {selectedOption.isCorrect ? "Correct!" : "Not quite."}{" "}
                {question.explanation}
              </p>
            )}
          </div>
        );
      })}

      {!submitted && (
        <Button
          onClick={handleSubmit}
          disabled={pending || questions.some((q) => !answers[q.id])}
        >
          {pending ? "Submitting..." : "Submit answers"}
        </Button>
      )}
    </section>
  );
}
