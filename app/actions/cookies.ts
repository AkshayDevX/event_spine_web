"use server";

import { cookies } from "next/headers";

export async function getCookieValue(key: string = "token") {
  const cookieStore = await cookies();
  return cookieStore.get(key)?.value || null;
}

export async function setCookieValue(key: string, value: string) {
  const cookieStore = await cookies();
  cookieStore.set(key, value, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function deleteCookie(key: string) {
  const cookieStore = await cookies();
  cookieStore.delete(key);
}
