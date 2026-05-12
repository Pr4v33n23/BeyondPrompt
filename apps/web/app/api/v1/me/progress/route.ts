import { NextResponse } from "next/server";
import { ok } from "@/lib/api/response";

export async function GET() {
  return NextResponse.json(
    ok({
      xp: 120,
      streakDays: 3,
      coursesInProgress: 1,
      lessonsCompleted: 1,
    }),
  );
}
