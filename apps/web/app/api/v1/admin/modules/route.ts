import { NextResponse } from "next/server";
import { z } from "zod";
import { fail, ok } from "@/lib/api/response";
import { apiErrors } from "@/lib/api/errors";
import { requireAdmin } from "@/lib/auth/server";
import { adminCreateModule } from "@/server/repositories/modules";

const createModuleSchema = z.object({
  course_id: z.string().uuid(),
  slug: z.string().min(3),
  title: z.string().min(3),
  position: z.number().int().min(0),
});

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const parsed = createModuleSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(fail(apiErrors.validation(parsed.error.flatten())), { status: 400 });
    }
    const module = await adminCreateModule(parsed.data);
    return NextResponse.json(ok({ module }), { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("NEXT_REDIRECT")) throw err;
    return NextResponse.json(fail(apiErrors.internal("Failed to create module")), { status: 500 });
  }
}
