import { NextResponse } from "next/server";
import { ok, fail } from "@/lib/api/response";
import { apiErrors } from "@/lib/api/errors";
import { requireUser } from "@/lib/auth/server";
import { getUserProgressStats } from "@/server/repositories/progress";

export async function GET() {
  try {
    const user = await requireUser();
    const stats = await getUserProgressStats(user.id);
    return NextResponse.json(ok(stats));
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("NEXT_REDIRECT")) throw err;
    return NextResponse.json(
      fail(apiErrors.internal(err instanceof Error ? err.message : "Unknown error")),
      { status: 500 },
    );
  }
}
