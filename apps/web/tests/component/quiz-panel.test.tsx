import { render, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { QuizPanel } from "@/features/quizzes/components/quiz-panel";

// Suppress sonner toast in tests
vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const mockQuestion = {
  id: "q1",
  prompt: "What is the capital of France?",
  explanation: "Paris is the capital and largest city of France.",
  options: [
    { id: "o1", content: "London", isCorrect: false },
    { id: "o2", content: "Paris", isCorrect: true },
    { id: "o3", content: "Berlin", isCorrect: false },
  ],
};

describe("QuizPanel", () => {
  it("renders the question prompt text", () => {
    const { getByText } = render(
      <QuizPanel lessonId="lesson-1" questions={[mockQuestion]} />,
    );
    expect(getByText(/What is the capital of France\?/)).toBeInTheDocument();
  });

  it("renders all option texts", () => {
    const { getByText } = render(
      <QuizPanel lessonId="lesson-1" questions={[mockQuestion]} />,
    );
    expect(getByText("London")).toBeInTheDocument();
    expect(getByText("Paris")).toBeInTheDocument();
    expect(getByText("Berlin")).toBeInTheDocument();
  });

  it("submit button is disabled until an option is selected", () => {
    const { getByRole } = render(
      <QuizPanel lessonId="lesson-1" questions={[mockQuestion]} />,
    );
    const submitBtn = getByRole("button", { name: /submit answers/i });
    expect(submitBtn).toBeDisabled();
  });

  it("submit button is enabled after selecting an option", () => {
    const { getByRole } = render(
      <QuizPanel lessonId="lesson-1" questions={[mockQuestion]} />,
    );
    const parisOption = getByRole("radio", { name: "Paris" });
    fireEvent.click(parisOption);
    const submitBtn = getByRole("button", { name: /submit answers/i });
    expect(submitBtn).not.toBeDisabled();
  });

  it("shows explanation text after successful submit", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          score: 1,
          total: 1,
          xpAwarded: 10,
          results: [{ questionId: "q1", isCorrect: true, correctOptionId: "o2" }],
        },
        error: null,
      }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const { getByRole, getByText } = render(
      <QuizPanel lessonId="lesson-1" questions={[mockQuestion]} />,
    );

    // Select the correct option
    fireEvent.click(getByRole("radio", { name: "Paris" }));

    // Submit
    fireEvent.click(getByRole("button", { name: /submit answers/i }));

    await waitFor(() => {
      expect(
        getByText(/Paris is the capital and largest city of France\./),
      ).toBeInTheDocument();
    });

    vi.unstubAllGlobals();
  });
});
