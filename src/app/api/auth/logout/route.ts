import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME } from "@/lib/session";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  const loginUrl = new URL("https://surework.ng/");
  return NextResponse.redirect(loginUrl);
}
