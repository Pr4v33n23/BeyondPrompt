import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/auth/middleware";

const learnerProtectedRoutes = ["/dashboard", "/courses"];
const adminProtectedRoutes = ["/admin"];
const authRoutes = ["/login", "/signup"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { response, user } = await updateSession(request);

  const needsLearnerAuth = learnerProtectedRoutes.some((route) => pathname.startsWith(route));
  const needsAdminAuth = adminProtectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.includes(pathname);

  if ((needsLearnerAuth || needsAdminAuth) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/courses/:path*", "/admin/:path*", "/login", "/signup"],
};
