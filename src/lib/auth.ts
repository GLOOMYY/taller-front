import "server-only";

import { cookies } from "next/headers";

export const SESSION_COOKIE = "taller_session";

export async function getAccessToken() {
  return (await cookies()).get(SESSION_COOKIE)?.value ?? null;
}

export async function saveAccessToken(token: string) {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60,
  });
}

export async function clearAccessToken() {
  (await cookies()).delete(SESSION_COOKIE);
}
