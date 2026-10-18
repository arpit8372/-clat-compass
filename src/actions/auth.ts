"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient, isSupabaseConfigured } from "../lib/supabase/server";
import { UserProfile } from "../lib/types/clat";

export interface AuthState {
  error?: string;
  success?: string;
}

export async function loginAction(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();
  const redirectTo = formData.get("redirectTo")?.toString() || "/dashboard";

  if (!email || !password) {
    return { error: "Please enter both email and password." };
  }

  if (!isSupabaseConfigured()) {
    // Demo fallback mode when Supabase is not yet connected
    return { error: "Supabase is not configured yet. Please configure your .env.local with Supabase credentials." };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect(redirectTo);
}

export async function logoutAction(): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    await supabase.auth.signOut();
  }
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function requestPasswordResetAction(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email")?.toString().trim();

  if (!email) {
    return { error: "Please enter your email address." };
  }

  if (!isSupabaseConfigured()) {
    return { error: "Supabase credentials are required for password recovery emails." };
  }

  const supabase = createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Password reset link sent! Please check your email inbox." };
}

export async function updatePasswordAction(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  if (!password || password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured." };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  return { success: "Password updated successfully. You can now access your dashboard." };
}

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  if (!isSupabaseConfigured()) {
    // Return mock student profile for preview
    return {
      id: "preview-student-id",
      email: "student@clatcompass.local",
      full_name: "CLAT Aspirant",
      role: "student",
      created_at: new Date().toISOString(),
    };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return {
      id: user.id,
      email: user.email || "",
      full_name: user.user_metadata?.full_name || "Student",
      role: (user.user_metadata?.role as "admin" | "student") || "student",
      created_at: user.created_at,
    };
  }

  return profile as UserProfile;
}
