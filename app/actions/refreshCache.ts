"use server";

import { updateTag } from "next/cache";

export async function refreshCache(tag: string) {
  updateTag(tag);
}
