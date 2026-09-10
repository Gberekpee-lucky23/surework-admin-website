import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME } from "@/lib/session";

async function handleLogout(request: NextRequest) {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);

  const redirectUrl = new URL("/admin", request.url);
  const response = NextResponse.redirect(redirectUrl, 303);

  // Explicitly clear cookie on the response with path "/"
  response.cookies.set(COOKIE_NAME, "", {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}

export async function POST(request: NextRequest) {
  return handleLogout(request);
}

export async function GET(request: NextRequest) {
  return handleLogout(request);
}

