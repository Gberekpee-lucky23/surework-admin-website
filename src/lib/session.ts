/**
 * session.ts — reads and verifies the admin session cookie.
 * Returns the decoded admin payload or null. Never throws.
 * Server-only: never import this in "use client" files.
 */
import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "fallback-secret-change-in-production"
);

export const COOKIE_NAME = "admin_session";
export const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours

export interface AdminSession {
  id: number;
  email: string;
  name: string;
  role: string;
}

export async function getSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as AdminSession;
  } catch {
    return null;
  }
}

export async function signSession(data: AdminSession): Promise<string> {
  return new SignJWT(data as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(SECRET);
}
