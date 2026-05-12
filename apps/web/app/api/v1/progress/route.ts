import { NextResponse } from "next/server";
import { lessonCompleteSchema } from "@/lib/api/contracts";
import { apiErrors } from "@/lib/api/errors";
import { fail, ok } from "@/lib/api/response";

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = lessonCompleteSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(fail(apiErrors.validation(parsed.error.flatten())), { status: 400 });
  }

  return NextResponse.json(
    ok({
      lessonId: parsed.data.lessonId,
      status: "completed",
      completedAt: new Date().toISOString(),
    }),
  );
}
