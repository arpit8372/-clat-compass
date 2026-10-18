"use client";

import React from "react";
import { TestAttempt } from "../../lib/types/clat";
import { formatSecondsToTime } from "../../lib/utils/scoring";
import { Award, CheckCircle2, XCircle, Clock, Target, HelpCircle } from "lucide-react";

interface ScoreSummaryProps {
  attempt: TestAttempt;
}

export function ScoreSummary({ attempt }: ScoreSummaryProps) {
  const percentageScore =
    attempt.total_questions > 0
      ? Math.max(0, Math.round((attempt.score / attempt.total_questions) * 100))
      : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-compass-700 bg-compass-50 px-2.5 py-1 rounded-md border border-compass-200">
            Official Exam Result
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-2">
            {attempt.test?.title || "CLAT Practice Mock"}
          </h1>
          <p className="text-xs text-slate-700 mt-1">
            Submitted on {new Date(attempt.submitted_at || attempt.started_at).toLocaleDateString()} at{" "}
            {new Date(attempt.submitted_at || attempt.started_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>

        {/* Big Score Pill */}
        <div className="flex items-center gap-4 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-md">
          <div className="w-12 h-12 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              Total Score
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-amber-400">{attempt.score}</span>
              <span className="text-sm font-semibold text-slate-400">/ {attempt.total_questions}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {/* Accuracy */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 text-slate-700 mb-1">
            <Target className="w-4 h-4 text-compass-700" />
            <span className="text-xs font-semibold">Accuracy</span>
          </div>
          <span className="text-2xl font-bold text-slate-900">{attempt.accuracy}%</span>
          <p className="text-[11px] text-slate-700 mt-0.5">Correct vs attempted</p>
        </div>

        {/* Correct */}
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
          <div className="flex items-center gap-2 text-emerald-800 mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold">Correct Answers</span>
          </div>
          <span className="text-2xl font-bold text-emerald-700">{attempt.correct_count}</span>
          <p className="text-[11px] text-emerald-800 mt-0.5">+{attempt.correct_count} Marks</p>
        </div>

        {/* Incorrect */}
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
          <div className="flex items-center gap-2 text-rose-800 mb-1">
            <XCircle className="w-4 h-4 text-rose-600" />
            <span className="text-xs font-semibold">Incorrect Answers</span>
          </div>
          <span className="text-2xl font-bold text-rose-600">{attempt.incorrect_count}</span>
          <p className="text-[11px] text-rose-800 mt-0.5">
            -{attempt.incorrect_count * 0.25} Negative Mark penalty
          </p>
        </div>

        {/* Time Spent */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 text-slate-700 mb-1">
            <Clock className="w-4 h-4 text-compass-700" />
            <span className="text-xs font-semibold">Time Spent</span>
          </div>
          <span className="text-2xl font-bold text-slate-900">
            {formatSecondsToTime(attempt.time_spent_seconds)}
          </span>
          <p className="text-[11px] text-slate-700 mt-0.5">
            Avg {Math.round(attempt.time_spent_seconds / Math.max(1, attempt.total_questions))}s / question
          </p>
        </div>
      </div>
    </div>
  );
}
