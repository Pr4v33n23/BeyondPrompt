import { NextResponse } from "next/server";
import { ok, fail } from "@/lib/api/response";
import { apiErrors } from "@/lib/api/errors";
import { getCourseWithModules } from "@/server/repositories/courses";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  try {
    const course = await getCourseWithModules(slug);
    if (!course) {
      return NextResponse.json(fail(apiErrors.notFound("Course not found")), { status: 404 });
    }
    return NextResponse.json(ok({ course }));
  } catch (err) {
    return NextResponse.json(
      fail(apiErrors.internal(err instanceof Error ? err.message : "Unknown error")),
      { status: 500 },
    );
  }
}
