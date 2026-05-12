import { NextResponse } from "next/server";
import { z } from "zod";
import { fail, ok } from "@/lib/api/response";
import { apiErrors } from "@/lib/api/errors";
import { requireAdmin } from "@/lib/auth/server";
import { adminCreateQuestion, adminCreateOption } from "@/server/repositories/quiz";

const createQuestionSchema = z.object({
  lesson_id: z.string().uuid(),
  prompt: z.string().min(5),
  explanation: z.string().optional(),
  position: z.number().int().min(0),
  allows_multiple: z.boolean().default(false),
  options: z
    .array(
      z.object({
        content: z.string().min(1),
        is_correct: z.boolean(),
        position: z.number().int().min(0),
      }),
    )
    .min(2),
});

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const parsed = createQuestionSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(fail(apiErrors.validation(parsed.error.flatten())), { status: 400 });
    }

    const question = await adminCreateQuestion({
      lesson_id: parsed.data.lesson_id,
      prompt: parsed.data.prompt,
      explanation: parsed.data.explanation ?? null,
      position: parsed.data.position,
      allows_multiple: parsed.data.allows_multiple,
    });

    const options = await Promise.all(
      parsed.data.options.map((opt) =>
        adminCreateOption({ question_id: question.id, ...opt }),
      ),
    );

    return NextResponse.json(ok({ question: { ...question, options } }), { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("NEXT_REDIRECT")) throw err;
    return NextResponse.json(fail(apiErrors.internal("Failed to create question")), { status: 500 });
  }
}
