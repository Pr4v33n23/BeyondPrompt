import { NextResponse } from "next/server";
import { z } from "zod";
import { fail, ok } from "@/lib/api/response";
import { apiErrors } from "@/lib/api/errors";
import { listCourses } from "@/server/data/mock-catalog";

const createCourseSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(8),
});

export async function GET() {
  return NextResponse.json(ok({ courses: listCourses() }));
}

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = createCourseSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(fail(apiErrors.validation(parsed.error.flatten())), { status: 400 });
  }

  return NextResponse.json(
    ok({
      course: {
        id: crypto.randomUUID(),
        ...parsed.data,
      },
    }),
    { status: 201 },
  );
}
