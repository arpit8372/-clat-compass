import React from "react";
import { PracticeInterface } from "@/components/practice/practice-interface";
import { MOCK_QUESTIONS, MOCK_SUBJECTS } from "@/lib/data/mock-data";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { Question } from "@/lib/types/clat";
import { BookOpen, Sparkles } from "lucide-react";

export default async function PracticePage({
  searchParams,
}: {
  searchParams?: { subject?: string; topic?: string };
}) {
  let questions: Question[] = MOCK_QUESTIONS;

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data } = await supabase
      .from("questions")
      .select("*, subject:subjects(*), passage:passages(*)")
      .order("created_at", { ascending: false });

    if (data && data.length > 0) {
      questions = data as unknown as Question[];
    }
  }

  // Filter if subject param passed
  if (searchParams?.subject) {
    const code = searchParams.subject;
    const targetSubject = MOCK_SUBJECTS.find((s) => s.code === code);
    if (targetSubject) {
      questions = questions.filter(
        (q) => q.subject_id === targetSubject.id || q.subject?.name === targetSubject.name
      );
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-compass-700 mb-1">
            <BookOpen className="w-4 h-4" />
            Instant Feedback Practice
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">
            CLAT Practice Mode
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Solve questions at your own pace. Explanations and correct options are revealed immediately upon selection.
          </p>
        </div>
      </div>

      <PracticeInterface questions={questions} />
    </div>
  );
}
