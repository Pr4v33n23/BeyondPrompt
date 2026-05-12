import { NextResponse } from "next/server";
import { lessonCompleteSchema } from "@/lib/api/contracts";
import { apiErrors } from "@/lib/api/errors";
import { fail, ok } from "@/lib/api/response";
import { requireUser } from "@/lib/auth/server";
import { upsertLessonProgress, addXpEvent } from "@/server/repositories/progress";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const payload = await request.json();
    const parsed = lessonCompleteSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(fail(apiErrors.validation(parsed.error.flatten())), { status: 400 });
    }
    await upsertLessonProgress(user.id, parsed.data.lessonId, "completed");
    await addXpEvent(user.id, 5, "lesson_complete", parsed.data.lessonId);
    return NextResponse.json(
      ok({ lessonId: parsed.data.lessonId, status: "completed", completedAt: new Date().toISOString() }),
    );
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("NEXT_REDIRECT")) throw err;
    return NextResponse.json(
      fail(apiErrors.internal(err instanceof Error ? err.message : "Unknown error")),
      { status: 500 },
    );
  }
}
