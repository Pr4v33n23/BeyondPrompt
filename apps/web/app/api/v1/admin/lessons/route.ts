import { NextResponse } from "next/server";
import { z } from "zod";
import { fail, ok } from "@/lib/api/response";
import { apiErrors } from "@/lib/api/errors";
import { requireAdmin } from "@/lib/auth/server";
import { adminCreateLesson } from "@/server/repositories/lessons";

const createLessonSchema = z.object({
  module_id: z.string().uuid(),
  slug: z.string().min(3),
  title: z.string().min(3),
  content_markdown: z.string().optional(),
  position: z.number().int().min(0),
});

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const parsed = createLessonSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(fail(apiErrors.validation(parsed.error.flatten())), { status: 400 });
    }
    const lesson = await adminCreateLesson({
      ...parsed.data,
      content_markdown: parsed.data.content_markdown ?? null,
    });
    return NextResponse.json(ok({ lesson }), { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("NEXT_REDIRECT")) throw err;
    return NextResponse.json(fail(apiErrors.internal("Failed to create lesson")), { status: 500 });
  }
}
