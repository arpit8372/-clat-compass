"use server";

import { revalidatePath } from "next/cache";
import { createClient, isSupabaseConfigured } from "../lib/supabase/server";
import { getCurrentUserProfile } from "./auth";
import { Question, TestAttempt, AttemptResponse, AttemptMode } from "../lib/types/clat";
import { calculateExamScore } from "../lib/utils/scoring";
import { MOCK_QUESTIONS, MOCK_TESTS, MOCK_ATTEMPTS } from "../lib/data/mock-data";

// Fallback in-memory session cache for demo / preview mode
const localAttemptsCache: Map<string, TestAttempt> = new Map(
  MOCK_ATTEMPTS.map((a) => [a.id, a])
);
const localResponsesCache: Map<string, Record<string, AttemptResponse>> = new Map();

export async function startAttemptAction({
  testId,
  mode,
  subjectId,
  isPyq,
}: {
  testId?: string;
  mode: AttemptMode;
  subjectId?: string;
  isPyq?: boolean;
}): Promise<{ attemptId: string }> {
  const user = await getCurrentUserProfile();
  const userId = user?.id || "preview-student-id";

  if (!isSupabaseConfigured()) {
    // Demo mock creation
    const attemptId = `att-${Date.now()}`;
    let questions = MOCK_QUESTIONS;

    if (subjectId) {
      questions = questions.filter((q) => q.subject_id === subjectId);
    } else if (isPyq) {
      questions = questions.filter((q) => q.is_pyq);
    } else if (testId) {
      // Find matching mock test questions
      questions = MOCK_QUESTIONS;
    }

    const test = testId ? MOCK_TESTS.find((t) => t.id === testId) || null : null;

    const newAttempt: TestAttempt = {
      id: attemptId,
      user_id: userId,
      test_id: testId || null,
      mode,
      status: "in_progress",
      started_at: new Date().toISOString(),
      time_spent_seconds: 0,
      score: 0,
      total_questions: questions.length,
      correct_count: 0,
      incorrect_count: 0,
      unattempted_count: questions.length,
      accuracy: 0,
      created_at: new Date().toISOString(),
      test,
    };

    localAttemptsCache.set(attemptId, newAttempt);
    localResponsesCache.set(attemptId, {});

    return { attemptId };
  }

  const supabase = createClient();

  // Create attempt in Supabase
  const { data: attempt, error } = await supabase
    .from("test_attempts")
    .insert({
      user_id: userId,
      test_id: testId || null,
      mode,
      status: "in_progress",
      started_at: new Date().toISOString(),
      score: 0,
      total_questions: 0,
      correct_count: 0,
      incorrect_count: 0,
      unattempted_count: 0,
      accuracy: 0,
    })
    .select("id")
    .single();

  if (error || !attempt) {
    throw new Error(error?.message || "Failed to start test attempt");
  }

  return { attemptId: attempt.id };
}

export async function saveResponseAction({
  attemptId,
  questionId,
  selectedOption,
  isMarkedForReview,
  timeSpentSeconds,
  visited = true,
}: {
  attemptId: string;
  questionId: string;
  selectedOption: "A" | "B" | "C" | "D" | null;
  isMarkedForReview: boolean;
  timeSpentSeconds: number;
  visited?: boolean;
}): Promise<{ success: boolean }> {
  if (!isSupabaseConfigured()) {
    const responses = localResponsesCache.get(attemptId) || {};
    responses[questionId] = {
      attempt_id: attemptId,
      question_id: questionId,
      selected_option: selectedOption,
      is_marked_for_review: isMarkedForReview,
      time_spent_seconds: timeSpentSeconds,
      visited,
      answered_at: selectedOption ? new Date().toISOString() : null,
    };
    localResponsesCache.set(attemptId, responses);
    return { success: true };
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("attempt_responses")
    .upsert(
      {
        attempt_id: attemptId,
        question_id: questionId,
        selected_option: selectedOption,
        is_marked_for_review: isMarkedForReview,
        time_spent_seconds: timeSpentSeconds,
        visited,
        answered_at: selectedOption ? new Date().toISOString() : null,
      },
      { onConflict: "attempt_id,question_id" }
    );

  if (error) {
    console.error("Error saving response:", error);
    return { success: false };
  }

  return { success: true };
}

export async function submitAttemptAction({
  attemptId,
  totalTimeSeconds,
}: {
  attemptId: string;
  totalTimeSeconds: number;
}): Promise<{ success: boolean; attemptId: string }> {
  if (!isSupabaseConfigured()) {
    const attempt = localAttemptsCache.get(attemptId);
    if (!attempt) throw new Error("Attempt not found");

    const responses = localResponsesCache.get(attemptId) || {};
    // Calculate final score using MOCK_QUESTIONS
    const scoreResult = calculateExamScore({
      questions: MOCK_QUESTIONS,
      responses,
    });

    attempt.status = "completed";
    attempt.submitted_at = new Date().toISOString();
    attempt.time_spent_seconds = totalTimeSeconds;
    attempt.score = scoreResult.score;
    attempt.correct_count = scoreResult.correctCount;
    attempt.incorrect_count = scoreResult.incorrectCount;
    attempt.unattempted_count = scoreResult.unattemptedCount;
    attempt.accuracy = scoreResult.accuracy;
    attempt.subject_breakdown = scoreResult.subjectBreakdown;
    localAttemptsCache.set(attemptId, attempt);

    revalidatePath(`/results/${attemptId}`);
    return { success: true, attemptId };
  }

  const supabase = createClient();

  // Fetch all questions and responses for this attempt
  const { data: responses } = await supabase
    .from("attempt_responses")
    .select("*")
    .eq("attempt_id", attemptId);

  const responseMap: Record<string, AttemptResponse> = {};
  responses?.forEach((r) => {
    responseMap[r.question_id] = r;
  });

  // Fetch test details or questions
  const { data: attempt } = await supabase
    .from("test_attempts")
    .select("*, test:tests(*)")
    .eq("id", attemptId)
    .single();

  let questions: Question[] = [];
  if (attempt?.test_id) {
    const { data: testQuestions } = await supabase
      .from("test_questions")
      .select("question:questions(*, subject:subjects(*), passage:passages(*))")
      .eq("test_id", attempt.test_id)
      .order("order_seq", { ascending: true });

    questions = (testQuestions?.map((tq) => tq.question).filter(Boolean) as unknown as Question[]) || [];
  } else {
    const { data: allQuestions } = await supabase
      .from("questions")
      .select("*, subject:subjects(*), passage:passages(*)");
    questions = (allQuestions as unknown as Question[]) || [];
  }

  const scoreResult = calculateExamScore({
    questions,
    responses: responseMap,
    positiveMark: attempt?.test?.positive_mark ?? 1.0,
    negativeMark: attempt?.test?.negative_mark ?? 0.25,
  });

  // Update attempt status
  await supabase
    .from("test_attempts")
    .update({
      status: "completed",
      submitted_at: new Date().toISOString(),
      time_spent_seconds: totalTimeSeconds,
      score: scoreResult.score,
      total_questions: scoreResult.totalQuestions,
      correct_count: scoreResult.correctCount,
      incorrect_count: scoreResult.incorrectCount,
      unattempted_count: scoreResult.unattemptedCount,
      accuracy: scoreResult.accuracy,
      subject_breakdown: scoreResult.subjectBreakdown,
    })
    .eq("id", attemptId);

  revalidatePath(`/results/${attemptId}`);
  return { success: true, attemptId };
}

export async function getAttemptDetails(attemptId: string): Promise<{
  attempt: TestAttempt | null;
  questions: Question[];
  responses: Record<string, AttemptResponse>;
}> {
  if (!isSupabaseConfigured()) {
    const attempt = localAttemptsCache.get(attemptId) || MOCK_ATTEMPTS[0];
    const responses = localResponsesCache.get(attemptId) || {};

    // If it's the mock sample attempt, mock full responses
    if (attemptId === "att-sample-completed" && Object.keys(responses).length === 0) {
      MOCK_QUESTIONS.forEach((q, idx) => {
        responses[q.id] = {
          attempt_id: attemptId,
          question_id: q.id,
          selected_option: idx % 6 === 0 ? "A" : q.correct_option, // few wrong answers for realism
          is_marked_for_review: false,
          time_spent_seconds: 45,
          visited: true,
          answered_at: new Date().toISOString(),
        };
      });
    }

    return {
      attempt,
      questions: MOCK_QUESTIONS,
      responses,
    };
  }

  const supabase = createClient();
  const { data: attempt } = await supabase
    .from("test_attempts")
    .select("*, test:tests(*)")
    .eq("id", attemptId)
    .single();

  if (!attempt) {
    return { attempt: null, questions: [], responses: {} };
  }

  // Get questions
  let questions: Question[] = [];
  if (attempt.test_id) {
    const { data: testQuestions } = await supabase
      .from("test_questions")
      .select("question:questions(*, subject:subjects(*), passage:passages(*))")
      .eq("test_id", attempt.test_id)
      .order("order_seq", { ascending: true });

    questions = (testQuestions?.map((tq) => tq.question).filter(Boolean) as unknown as Question[]) || [];
  } else {
    const { data: allQuestions } = await supabase
      .from("questions")
      .select("*, subject:subjects(*), passage:passages(*)")
      .limit(30);
    questions = (allQuestions as unknown as Question[]) || [];
  }

  // Get responses
  const { data: rawResponses } = await supabase
    .from("attempt_responses")
    .select("*")
    .eq("attempt_id", attemptId);

  const responses: Record<string, AttemptResponse> = {};
  rawResponses?.forEach((r) => {
    responses[r.question_id] = r;
  });

  return {
    attempt: attempt as TestAttempt,
    questions,
    responses,
  };
}
