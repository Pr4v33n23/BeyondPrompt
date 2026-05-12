import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockUpsert, mockInsert, mockSelect, mockEq, mockFrom } = vi.hoisted(() => {
  const mockUpsert = vi.fn().mockResolvedValue({ error: null });
  const mockInsert = vi.fn().mockResolvedValue({ error: null });
  const mockSelect = vi.fn();
  const mockEq = vi.fn();

  const lessonProgressChain: Record<string, unknown> = {};
  lessonProgressChain.upsert = mockUpsert;
  lessonProgressChain.select = mockSelect.mockReturnValue(lessonProgressChain);
  lessonProgressChain.eq = mockEq.mockReturnValue(lessonProgressChain);

  const xpEventsChain: Record<string, unknown> = {};
  xpEventsChain.insert = mockInsert;

  const mockFrom = vi.fn((table: string) => {
    if (table === "lesson_progress") return lessonProgressChain;
    if (table === "xp_events") return xpEventsChain;
    return { select: mockSelect, eq: mockEq };
  });

  return { mockUpsert, mockInsert, mockSelect, mockEq, mockFrom };
});

vi.mock("@/lib/auth/server", () => ({
  createServerSupabaseClient: vi.fn().mockResolvedValue({ from: mockFrom }),
}));

import { upsertLessonProgress, addXpEvent } from "@/server/repositories/progress";

describe("progress repository", () => {
  beforeEach(() => vi.clearAllMocks());

  it("upsertLessonProgress upserts on lesson_progress with correct conflict target", async () => {
    await upsertLessonProgress("user-1", "lesson-1", "completed");
    expect(mockFrom).toHaveBeenCalledWith("lesson_progress");
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: "user-1", lesson_id: "lesson-1", status: "completed" }),
      { onConflict: "user_id,lesson_id" },
    );
  });

  it("addXpEvent inserts into xp_events with correct fields", async () => {
    await addXpEvent("user-1", 20, "quiz_pass", "lesson-1");
    expect(mockFrom).toHaveBeenCalledWith("xp_events");
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: "user-1", points: 20, reason: "quiz_pass" }),
    );
  });
});
