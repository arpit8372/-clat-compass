import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAttemptDetails } from "@/actions/attempts";
import { ScoreSummary } from "@/components/analytics/score-summary";
import { SubjectBreakdownChart } from "@/components/analytics/subject-breakdown-chart";
import { QuestionReviewList } from "@/components/analytics/question-review-list";
import { Button } from "@/components/ui/button";
import { Compass, RotateCcw, ArrowLeft, BookOpen } from "lucide-react";

export default async function ResultPage({
  params,
}: {
  params: { attemptId: string };
}) {
  const { attempt, questions, responses } = await getAttemptDetails(params.attemptId);

  if (!attempt) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Action bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </Link>

        <div className="flex items-center gap-3">
          <Link href={`/practice`}>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs font-bold">
              <BookOpen className="w-3.5 h-3.5" />
              Practice Similar
            </Button>
          </Link>
          <Link href="/mocks">
            <Button variant="primary" size="sm" className="gap-1.5 text-xs font-bold">
              <Compass className="w-3.5 h-3.5" />
              Next Mock Test
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Scorecard */}
      <ScoreSummary attempt={attempt} />

      {/* Sectional Breakdown */}
      {attempt.subject_breakdown && (
        <SubjectBreakdownChart breakdown={attempt.subject_breakdown} />
      )}

      {/* Full Question-by-Question Solution Review */}
      <div className="pt-4 border-t border-slate-200">
        <div className="mb-6">
          <h2 className="text-xl font-black text-slate-900">Comprehensive Solutions & Review</h2>
          <p className="text-xs text-slate-500 mt-1">
            Analyze your answer choices, learn from mistakes, and bookmark critical legal principles.
          </p>
        </div>

        <QuestionReviewList questions={questions} responses={responses} />
      </div>
    </div>
  );
}
