import React from "react";
import { getBookmarksAction } from "@/actions/bookmarks";
import { PracticeInterface } from "@/components/practice/practice-interface";
import { MOCK_QUESTIONS } from "@/lib/data/mock-data";
import { Question } from "@/lib/types/clat";
import { RotateCcw, Sparkles } from "lucide-react";

export default async function RevisionPage() {
  const bookmarks = await getBookmarksAction();

  // Combine bookmarked questions or fallback to challenging sample questions
  const bookmarkedQuestions = bookmarks
    .map((b) => b.question)
    .filter(Boolean) as Question[];

  const questionsToRevise =
    bookmarkedQuestions.length > 0 ? bookmarkedQuestions : MOCK_QUESTIONS.slice(0, 8);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
          <RotateCcw className="w-4 h-4" />
          Active Recall & Spaced Practice
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900">
          Targeted Revision Engine
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review high-priority questions, re-test your conceptual mastery, and verify correct legal reasoning.
        </p>
      </div>

      <PracticeInterface questions={questionsToRevise} />
    </div>
  );
}
