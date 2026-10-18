"use server";

import { revalidatePath } from "next/cache";
import { createClient, isSupabaseConfigured } from "../lib/supabase/server";
import { createAdminClient } from "../lib/supabase/admin";
import { getCurrentUserProfile } from "./auth";
import { Question, Passage, Test, UserProfile } from "../lib/types/clat";
import { MOCK_QUESTIONS, MOCK_PASSAGES, MOCK_TESTS } from "../lib/data/mock-data";

// Fallback in-memory arrays for admin operations in preview
let localQuestions = [...MOCK_QUESTIONS];
const localPassages = [...MOCK_PASSAGES];
const localTests = [...MOCK_TESTS];
const localUsers: UserProfile[] = [
  {
    id: "usr-admin-1",
    email: "admin@clatcompass.com",
    full_name: "Lead Administrator",
    role: "admin",
    created_at: new Date(Date.now() - 3600000 * 240).toISOString(),
  },
  {
    id: "user-student-1",
    email: "student@clatcompass.com",
    full_name: "Aarav Sharma",
    role: "student",
    created_at: new Date(Date.now() - 3600000 * 120).toISOString(),
  },
];

async function assertAdmin() {
  const profile = await getCurrentUserProfile();
  if (isSupabaseConfigured() && profile?.role !== "admin") {
    throw new Error("Unauthorized: Admin privilege required.");
  }
}

// 1. Provision new Student Account
export async function createStudentUserAction({
  email,
  password,
  fullName,
}: {
  email: string;
  password: string;
  fullName: string;
}): Promise<{ success: boolean; error?: string; user?: UserProfile }> {
  await assertAdmin();

  if (!email || !password || password.length < 6) {
    return { success: false, error: "Provide a valid email and password of at least 6 characters." };
  }

  if (!isSupabaseConfigured()) {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email,
      full_name: fullName,
      role: "student",
      created_at: new Date().toISOString(),
    };
    localUsers.push(newUser);
    revalidatePath("/admin/users");
    return { success: true, user: newUser };
  }

  try {
    const adminSupabase = createAdminClient();

    // Create user in Supabase auth
    const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role: "student",
      },
    });

    if (authError || !authData.user) {
      return { success: false, error: authError?.message || "Failed to create user in Auth." };
    }

    // Upsert profile in DB
    const { data: profile, error: profError } = await adminSupabase
      .from("profiles")
      .upsert({
        id: authData.user.id,
        email,
        full_name: fullName,
        role: "student",
      })
      .select()
      .single();

    if (profError) {
      return { success: false, error: profError.message };
    }

    revalidatePath("/admin/users");
    return { success: true, user: profile as UserProfile };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create student account.";
    return { success: false, error: message };
  }
}

export async function listUsersAction(): Promise<UserProfile[]> {
  await assertAdmin();

  if (!isSupabaseConfigured()) {
    return localUsers;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error listing users:", error);
    return [];
  }

  return (data as UserProfile[]) || [];
}

// 2. Questions Management
export async function createQuestionAction(data: Partial<Question>): Promise<{ success: boolean; error?: string }> {
  await assertAdmin();

  if (!isSupabaseConfigured()) {
    const newQ: Question = {
      id: `q-${Date.now()}`,
      passage_id: data.passage_id || null,
      subject_id: data.subject_id || "sub-legal",
      question_text: data.question_text || "",
      options: data.options || [
        { id: "A", text: "Option A" },
        { id: "B", text: "Option B" },
        { id: "C", text: "Option C" },
        { id: "D", text: "Option D" },
      ],
      correct_option: data.correct_option || "A",
      explanation: data.explanation || "",
      marks_positive: data.marks_positive ?? 1.0,
      marks_negative: data.marks_negative ?? 0.25,
      difficulty: data.difficulty || "medium",
      is_pyq: data.is_pyq ?? false,
      pyq_year: data.pyq_year || null,
      tags: data.tags || [],
    };
    localQuestions.unshift(newQ);
    revalidatePath("/admin/questions");
    return { success: true };
  }

  const supabase = createClient();
  const { error } = await supabase.from("questions").insert({
    passage_id: data.passage_id || null,
    subject_id: data.subject_id,
    question_text: data.question_text,
    options: data.options,
    correct_option: data.correct_option,
    explanation: data.explanation,
    marks_positive: data.marks_positive ?? 1.0,
    marks_negative: data.marks_negative ?? 0.25,
    difficulty: data.difficulty || "medium",
    is_pyq: data.is_pyq ?? false,
    pyq_year: data.pyq_year,
    tags: data.tags ?? [],
  });

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/questions");
  return { success: true };
}

export async function deleteQuestionAction(id: string): Promise<{ success: boolean }> {
  await assertAdmin();

  if (!isSupabaseConfigured()) {
    localQuestions = localQuestions.filter((q) => q.id !== id);
    revalidatePath("/admin/questions");
    return { success: true };
  }

  const supabase = createClient();
  await supabase.from("questions").delete().eq("id", id);
  revalidatePath("/admin/questions");
  return { success: true };
}

// 3. Passage Management
export async function createPassageAction(data: Partial<Passage>): Promise<{ success: boolean; passageId?: string; error?: string }> {
  await assertAdmin();

  if (!isSupabaseConfigured()) {
    const newP: Passage = {
      id: `p-${Date.now()}`,
      title: data.title || "Untitled Passage",
      content: data.content || "",
      subject_id: data.subject_id,
      source: data.source || null,
      created_at: new Date().toISOString(),
    };
    localPassages.unshift(newP);
    revalidatePath("/admin/passages");
    return { success: true, passageId: newP.id };
  }

  const supabase = createClient();
  const { data: newP, error } = await supabase
    .from("passages")
    .insert({
      title: data.title,
      content: data.content,
      subject_id: data.subject_id,
      source: data.source,
      word_count: data.content ? data.content.split(/\s+/).length : 0,
    })
    .select("id")
    .single();

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/passages");
  return { success: true, passageId: newP?.id };
}

// 4. Test Management
export async function createTestAction(data: Partial<Test> & { questionIds?: string[] }): Promise<{ success: boolean; error?: string }> {
  await assertAdmin();

  if (!isSupabaseConfigured()) {
    const newT: Test = {
      id: `test-${Date.now()}`,
      title: data.title || "New Mock Test",
      slug: data.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || `test-${Date.now()}`,
      description: data.description || "",
      type: data.type || "full_mock",
      duration_minutes: data.duration_minutes || 120,
      total_marks: data.total_marks || 120,
      positive_mark: data.positive_mark || 1.0,
      negative_mark: data.negative_mark || 0.25,
      is_published: true,
      pyq_year: data.pyq_year || null,
      question_count: data.questionIds?.length || 20,
      created_at: new Date().toISOString(),
    };
    localTests.unshift(newT);
    revalidatePath("/mocks");
    revalidatePath("/admin/tests");
    return { success: true };
  }

  const supabase = createClient();
  const slug = data.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || `test-${Date.now()}`;
  const { data: newTest, error } = await supabase
    .from("tests")
    .insert({
      title: data.title,
      slug,
      description: data.description,
      type: data.type || "full_mock",
      duration_minutes: data.duration_minutes || 120,
      total_marks: data.total_marks || 120,
      positive_mark: data.positive_mark || 1.0,
      negative_mark: data.negative_mark || 0.25,
      is_published: true,
      pyq_year: data.pyq_year,
    })
    .select("id")
    .single();

  if (error) return { success: false, error: error.message };

  if (data.questionIds && data.questionIds.length > 0 && newTest) {
    const junctionRows = data.questionIds.map((qid, idx) => ({
      test_id: newTest.id,
      question_id: qid,
      order_seq: idx + 1,
    }));
    await supabase.from("test_questions").insert(junctionRows);
  }

  revalidatePath("/mocks");
  revalidatePath("/admin/tests");
  return { success: true };
}

// 5. Bulk Import
export async function bulkImportAction(jsonData: string): Promise<{ success: boolean; count: number; error?: string }> {
  await assertAdmin();

  try {
    const parsed = JSON.parse(jsonData);
    if (!Array.isArray(parsed)) {
      return { success: false, count: 0, error: "JSON must be an array of questions." };
    }

    if (!isSupabaseConfigured()) {
      parsed.forEach((item, index) => {
        localQuestions.push({
          id: `imp-${Date.now()}-${index}`,
          subject_id: item.subject_id || "sub-legal",
          question_text: item.question_text || "",
          options: item.options || [
            { id: "A", text: "A" },
            { id: "B", text: "B" },
            { id: "C", text: "C" },
            { id: "D", text: "D" },
          ],
          correct_option: item.correct_option || "A",
          explanation: item.explanation || "",
          marks_positive: item.marks_positive ?? 1.0,
          marks_negative: item.marks_negative ?? 0.25,
          difficulty: item.difficulty || "medium",
          is_pyq: Boolean(item.is_pyq),
          pyq_year: item.pyq_year,
          tags: item.tags || [],
        });
      });
      revalidatePath("/admin/questions");
      return { success: true, count: parsed.length };
    }

    const supabase = createClient();
    const rows = parsed.map((item) => ({
      passage_id: item.passage_id || null,
      subject_id: item.subject_id,
      question_text: item.question_text,
      options: item.options,
      correct_option: item.correct_option,
      explanation: item.explanation || "",
      marks_positive: item.marks_positive ?? 1.0,
      marks_negative: item.marks_negative ?? 0.25,
      difficulty: item.difficulty || "medium",
      is_pyq: Boolean(item.is_pyq),
      pyq_year: item.pyq_year,
      tags: item.tags || [],
    }));

    const { error } = await supabase.from("questions").insert(rows);
    if (error) return { success: false, count: 0, error: error.message };

    revalidatePath("/admin/questions");
    return { success: true, count: rows.length };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid JSON format.";
    return { success: false, count: 0, error: message };
  }
}
