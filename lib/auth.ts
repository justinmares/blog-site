import { cookies } from "next/headers";

const TOKEN_NAME = "admin_token";

export function generateToken(): string {
  const pwd = process.env.ADMIN_PASSWORD || "changeme123";
  // Simple hash: base64 of password + salt
  return Buffer.from(`authenticated:${pwd}`).toString("base64");
}

export function checkPassword(password: string): boolean {
  return password === (process.env.ADMIN_PASSWORD || "changeme123");
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_NAME);
  if (!token) return false;
  return token.value === generateToken();
}
