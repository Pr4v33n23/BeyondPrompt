import { NextResponse } from "next/server";
import { ok, fail } from "@/lib/api/response";
import { apiErrors } from "@/lib/api/errors";
import { requireUser } from "@/lib/auth/server";
import { getLessonWithQuiz } from "@/server/repositories/lessons";
import { getLessonProgress } from "@/server/repositories/progress";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const user = await requireUser();
    const [lesson, progress] = await Promise.all([
      getLessonWithQuiz(id),
      getLessonProgress(user.id, id),
    ]);
    if (!lesson) {
      return NextResponse.json(fail(apiErrors.notFound("Lesson not found")), { status: 404 });
    }
    return NextResponse.json(ok({ lesson, progress }));
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("NEXT_REDIRECT")) throw err;
    return NextResponse.json(
      fail(apiErrors.internal(err instanceof Error ? err.message : "Unknown error")),
      { status: 500 },
    );
  }
}
