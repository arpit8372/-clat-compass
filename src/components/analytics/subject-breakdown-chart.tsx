"use client";

import React from "react";
import { SubjectScoreBreakdown } from "../../lib/types/clat";
import { BarChart3 } from "lucide-react";

interface SubjectBreakdownChartProps {
  breakdown?: Record<string, SubjectScoreBreakdown>;
}

export function SubjectBreakdownChart({ breakdown }: SubjectBreakdownChartProps) {
  if (!breakdown || Object.keys(breakdown).length === 0) {
    return null;
  }

  const sections = Object.values(breakdown);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-compass-700" />
        <h3 className="font-bold text-base text-slate-900">Sectional Performance Breakdown</h3>
      </div>

      <div className="space-y-5">
        {sections.map((sec) => {
          const maxMarks = Math.max(1, sec.total_marks);
          const percent = Math.min(100, Math.max(0, Math.round((sec.score / maxMarks) * 100)));

          return (
            <div key={sec.subject_name} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-slate-900">{sec.subject_name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-compass-800 bg-compass-50 px-2 py-0.5 rounded border border-compass-200">
                    {sec.score} / {sec.total_marks} Marks
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden mb-3">
                <div
                  className="bg-compass-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>

              {/* Detailed metrics */}
              <div className="flex items-center gap-4 text-xs text-slate-700">
                <span className="text-emerald-800 font-semibold">✓ {sec.correct} Correct</span>
                <span className="text-rose-800 font-semibold">✗ {sec.incorrect} Incorrect</span>
                <span className="text-slate-700">• {sec.unattempted} Unattempted</span>
                <span className="ml-auto text-slate-700">
                  {sec.total_questions} Questions
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
