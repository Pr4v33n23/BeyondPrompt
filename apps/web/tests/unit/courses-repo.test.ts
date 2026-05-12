import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockSingle, mockEq, mockOrder, mockSelect, mockFrom } = vi.hoisted(() => {
  const mockSingle = vi.fn();
  const mockEq = vi.fn();
  const mockOrder = vi.fn();
  const mockSelect = vi.fn();
  const mockInsert = vi.fn();
  const mockUpdate = vi.fn();
  const mockDelete = vi.fn();

  const chain: Record<string, unknown> = {};
  chain.single = mockSingle;
  chain.eq = mockEq.mockReturnValue(chain);
  chain.order = mockOrder.mockReturnValue(chain);
  chain.select = mockSelect.mockReturnValue(chain);
  chain.insert = mockInsert.mockReturnValue(chain);
  chain.update = mockUpdate.mockReturnValue(chain);
  chain.delete = mockDelete.mockReturnValue(chain);

  const mockFrom = vi.fn().mockReturnValue(chain);

  return { mockSingle, mockEq, mockOrder, mockSelect, mockFrom };
});

vi.mock("@/lib/auth/server", () => ({
  createServerSupabaseClient: vi.fn().mockResolvedValue({ from: mockFrom }),
}));

import { listPublishedCourses, getCourseWithModules } from "@/server/repositories/courses";

describe("courses repository", () => {
  beforeEach(() => vi.clearAllMocks());

  it("listPublishedCourses queries courses table with status=published", async () => {
    // order is the terminal call for listPublishedCourses — make it resolve
    mockOrder.mockResolvedValueOnce({ data: [], error: null });
    await listPublishedCourses();
    expect(mockFrom).toHaveBeenCalledWith("courses");
    expect(mockEq).toHaveBeenCalledWith("status", "published");
  });

  it("getCourseWithModules returns null when course not found", async () => {
    mockSingle.mockResolvedValueOnce({ data: null, error: { code: "PGRST116" } });
    const result = await getCourseWithModules("nonexistent");
    expect(result).toBeNull();
  });
});
