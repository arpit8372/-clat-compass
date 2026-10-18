"use client";

import React from "react";
import { Question, AttemptResponse } from "../../lib/types/clat";
import { getPaletteStatus } from "../../lib/utils/scoring";
import { Button } from "../ui/button";
import { AlertCircle, CheckCircle2, HelpCircle, EyeOff } from "lucide-react";

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  questions: Question[];
  responses: Record<string, AttemptResponse>;
}

export function SubmitModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  questions,
  responses,
}: SubmitModalProps) {
  if (!isOpen) return null;

  let answered = 0;
  let notAnswered = 0;
  let marked = 0;
  let notVisited = 0;

  questions.forEach((q) => {
    const status = getPaletteStatus(responses[q.id], false);
    if (status === "answered" || status === "answered_and_marked") answered++;
    if (status === "marked_for_review" || status === "answered_and_marked") marked++;
    if (status === "not_answered") notAnswered++;
    if (status === "not_visited") notVisited++;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-compass-50 flex items-center justify-center text-compass-700">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900">Submit Mock Test?</h3>
            <p className="text-xs text-slate-700">Review your attempt summary before final submission.</p>
          </div>
        </div>

        {/* Attempt Statistics Grid */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-2xl font-black text-slate-900">{questions.length}</span>
              <p className="text-xs font-semibold text-slate-700 mt-0.5">Total Questions</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-2xl font-black text-emerald-700">{answered}</span>
              <p className="text-xs font-semibold text-emerald-800 mt-0.5">Answered</p>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
              <span className="text-2xl font-black text-rose-600">{notAnswered}</span>
              <p className="text-xs font-semibold text-rose-800 mt-0.5">Not Answered</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
              <span className="text-2xl font-black text-purple-700">{marked}</span>
              <p className="text-xs font-semibold text-purple-800 mt-0.5">Marked for Review</p>
            </div>
          </div>

          {notVisited > 0 && (
            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
              <EyeOff className="w-4 h-4 flex-shrink-0 text-amber-600" />
              <span>
                You still have <strong>{notVisited}</strong> unvisited question{notVisited > 1 ? "s" : ""}.
              </span>
            </div>
          )}

          <p className="text-xs text-slate-700 text-center">
            Are you sure you want to end the test? You will immediately be redirected to your detailed performance scorecard.
          </p>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button variant="outline" size="md" onClick={onClose} disabled={isSubmitting}>
            Return to Test
          </Button>
          <Button variant="primary" size="md" onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Yes, Submit Test"}
          </Button>
        </div>
      </div>
    </div>
  );
}
