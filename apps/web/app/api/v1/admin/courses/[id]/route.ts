import { NextResponse } from "next/server";
import { z } from "zod";
import { fail, ok } from "@/lib/api/response";
import { apiErrors } from "@/lib/api/errors";
import { requireAdmin } from "@/lib/auth/server";
import { adminUpdateCourse, adminDeleteCourse } from "@/server/repositories/courses";

const updateCourseSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  status: z.enum(["draft", "published"]).optional(),
  estimated_minutes: z.number().int().positive().optional(),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await requireAdmin();
    const parsed = updateCourseSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(fail(apiErrors.validation(parsed.error.flatten())), { status: 400 });
    }
    const course = await adminUpdateCourse(id, parsed.data);
    return NextResponse.json(ok({ course }));
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("NEXT_REDIRECT")) throw err;
    return NextResponse.json(fail(apiErrors.internal("Failed to update course")), { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await requireAdmin();
    await adminDeleteCourse(id);
    return NextResponse.json(ok({ deleted: true }));
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("NEXT_REDIRECT")) throw err;
    return NextResponse.json(fail(apiErrors.internal("Failed to delete course")), { status: 500 });
  }
}
