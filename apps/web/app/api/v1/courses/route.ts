import { NextResponse } from "next/server";
import { ok, fail } from "@/lib/api/response";
import { apiErrors } from "@/lib/api/errors";
import { listPublishedCourses } from "@/server/repositories/courses";

export async function GET() {
  try {
    const courses = await listPublishedCourses();
    return NextResponse.json(ok({ courses }));
  } catch (err) {
    return NextResponse.json(
      fail(apiErrors.internal(err instanceof Error ? err.message : "Unknown error")),
      { status: 500 },
    );
  }
}
