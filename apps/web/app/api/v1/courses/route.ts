import { NextResponse } from "next/server";
import { ok } from "@/lib/api/response";
import { listCourses } from "@/server/data/mock-catalog";

export async function GET() {
  return NextResponse.json(ok({ courses: listCourses() }));
}
