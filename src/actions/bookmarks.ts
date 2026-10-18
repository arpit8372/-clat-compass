"use server";

import { revalidatePath } from "next/cache";
import { createClient, isSupabaseConfigured } from "../lib/supabase/server";
import { getCurrentUserProfile } from "./auth";
import { Bookmark } from "../lib/types/clat";
import { MOCK_BOOKMARKS, MOCK_QUESTIONS } from "../lib/data/mock-data";

// In-memory bookmark cache for preview
const localBookmarks: Bookmark[] = [...MOCK_BOOKMARKS];

export async function toggleBookmarkAction({
  questionId,
  notes,
  tag,
}: {
  questionId: string;
  notes?: string;
  tag?: string;
}): Promise<{ isBookmarked: boolean; bookmarkId?: string }> {
  const user = await getCurrentUserProfile();
  const userId = user?.id || "preview-student-id";

  if (!isSupabaseConfigured()) {
    const existingIndex = localBookmarks.findIndex((b) => b.question_id === questionId);
    if (existingIndex >= 0) {
      localBookmarks.splice(existingIndex, 1);
      revalidatePath("/bookmarks");
      return { isBookmarked: false };
    } else {
      const q = MOCK_QUESTIONS.find((item) => item.id === questionId);
      const newBm: Bookmark = {
        id: `bm-${Date.now()}`,
        user_id: userId,
        question_id: questionId,
        notes: notes || "Review this question later",
        tag: tag || "general",
        created_at: new Date().toISOString(),
        question: q,
      };
      localBookmarks.unshift(newBm);
      revalidatePath("/bookmarks");
      return { isBookmarked: true, bookmarkId: newBm.id };
    }
  }

  const supabase = createClient();
  const { data: existing } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("user_id", userId)
    .eq("question_id", questionId)
    .maybeSingle();

  if (existing) {
    await supabase.from("bookmarks").delete().eq("id", existing.id);
    revalidatePath("/bookmarks");
    return { isBookmarked: false };
  } else {
    const { data: newBm, error } = await supabase
      .from("bookmarks")
      .insert({
        user_id: userId,
        question_id: questionId,
        notes,
        tag,
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);
    revalidatePath("/bookmarks");
    return { isBookmarked: true, bookmarkId: newBm.id };
  }
}

export async function getBookmarksAction(): Promise<Bookmark[]> {
  if (!isSupabaseConfigured()) {
    return localBookmarks;
  }

  const user = await getCurrentUserProfile();
  if (!user) return [];

  const supabase = createClient();
  const { data, error } = await supabase
    .from("bookmarks")
    .select("*, question:questions(*, subject:subjects(*), passage:passages(*))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching bookmarks:", error);
    return [];
  }

  return (data as unknown as Bookmark[]) || [];
}

export async function updateBookmarkNotesAction({
  bookmarkId,
  notes,
  tag,
}: {
  bookmarkId: string;
  notes: string;
  tag?: string;
}): Promise<{ success: boolean }> {
  if (!isSupabaseConfigured()) {
    const bm = localBookmarks.find((b) => b.id === bookmarkId);
    if (bm) {
      bm.notes = notes;
      if (tag !== undefined) bm.tag = tag;
    }
    revalidatePath("/bookmarks");
    return { success: true };
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("bookmarks")
    .update({ notes, tag })
    .eq("id", bookmarkId);

  if (error) throw new Error(error.message);
  revalidatePath("/bookmarks");
  return { success: true };
}
