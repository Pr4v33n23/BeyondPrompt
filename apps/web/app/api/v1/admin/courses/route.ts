import { NextResponse } from "next/server";
import { z } from "zod";
import { fail, ok } from "@/lib/api/response";
import { apiErrors } from "@/lib/api/errors";
import { requireAdmin } from "@/lib/auth/server";
import { adminListCourses, adminCreateCourse } from "@/server/repositories/courses";

const createCourseSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(8),
});

export async function GET() {
  try {
    await requireAdmin();
    const courses = await adminListCourses();
    return NextResponse.json(ok({ courses }));
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("NEXT_REDIRECT")) throw err;
    return NextResponse.json(fail(apiErrors.internal("Failed to load courses")), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const parsed = createCourseSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(fail(apiErrors.validation(parsed.error.flatten())), { status: 400 });
    }
    const course = await adminCreateCourse(parsed.data);
    return NextResponse.json(ok({ course }), { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("NEXT_REDIRECT")) throw err;
    return NextResponse.json(fail(apiErrors.internal("Failed to create course")), { status: 500 });
  }
}
