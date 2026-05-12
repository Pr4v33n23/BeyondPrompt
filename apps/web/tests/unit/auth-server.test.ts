import { describe, it, expect, vi } from "vitest";

vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue({ getAll: () => [], set: vi.fn() }),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`REDIRECT:${path}`);
  }),
}));

const makeClient = (role: string) => ({
  auth: {
    getUser: vi.fn().mockResolvedValue({
      data: { user: { id: "user-1", email: "a@b.com" } },
    }),
  },
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: { role }, error: null }),
  })),
});

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(),
}));

import { requireAdmin } from "@/lib/auth/server";
import { createServerClient } from "@supabase/ssr";

describe("requireAdmin", () => {
  it("redirects to /dashboard when role is learner", async () => {
    vi.mocked(createServerClient).mockReturnValue(makeClient("learner") as any);
    await expect(requireAdmin()).rejects.toThrow("REDIRECT:/dashboard");
  });

  it("returns user when role is admin", async () => {
    vi.mocked(createServerClient).mockReturnValue(makeClient("admin") as any);
    const user = await requireAdmin();
    expect(user.id).toBe("user-1");
  });
});
