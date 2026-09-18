import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "umrahzone_secure_jwt_secret_token_983742849182374921"
);

const COOKIE_NAME = "umrahzone_admin_token";

export interface AdminUser {
  email: string;
  role: "admin";
}

/**
 * Sign a JWT for the  admin session valid for 7 days
 */
export async function signAdminToken(user: AdminUser): Promise<string> {
  return await new SignJWT({ email: user.email, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

/**
 * Verify a JWT string
 */
export async function verifyAdminToken(token: string): Promise<AdminUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.role === "admin" && typeof payload.email === "string") {
      return {
        email: payload.email,
        role: "admin",
      };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Check if the current incoming request is authenticated as Admin (for API routes & server components)
 */
export async function getAdminSession(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

/**
 * Verify credentials against environment variables
 */
export function validateAdminCredentials(email: string, password: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@umrahzone.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "adminpassword123";

  return email.trim().toLowerCase() === adminEmail.trim().toLowerCase() && password === adminPassword;
}

export { COOKIE_NAME };
