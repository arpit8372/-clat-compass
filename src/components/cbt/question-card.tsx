"use client";

import React from "react";
import { Question } from "../../lib/types/clat";

interface QuestionCardProps {
  question: Question;
  index: number;
  total: number;
  selectedOption: "A" | "B" | "C" | "D" | null;
  onSelectOption: (option: "A" | "B" | "C" | "D") => void;
  sectionName?: string;
}

export function QuestionCard({
  question,
  index,
  total,
  selectedOption,
  onSelectOption,
  sectionName,
}: QuestionCardProps) {
  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto passage-scroll p-6 bg-white">
      {/* Question Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="font-bold text-base text-slate-900">
            Question {index + 1}
          </span>
          <span className="text-xs text-slate-700">of {total}</span>
          {sectionName && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-compass-50 text-compass-800 border border-compass-200 ml-1">
              {sectionName}
            </span>
          )}
        </div>

        {/* Marking info */}
        <div className="flex items-center gap-1.5 text-xs font-medium">
          <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            +{question.marks_positive ?? 1.0}
          </span>
          <span className="text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            -{question.marks_negative ?? 0.25}
          </span>
        </div>
      </div>

      {/* Question Problem Statement */}
      <div className="mb-6">
        <h2 className="text-base font-medium text-slate-900 leading-relaxed whitespace-pre-wrap">
          {question.question_text}
        </h2>
      </div>

      {/* Options Selection */}
      <div className="space-y-3">
        {question.options.map((opt) => {
          const isSelected = selectedOption === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelectOption(opt.id)}
              className={`w-full flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? "bg-compass-50 border-compass-500 shadow-sm ring-1 ring-compass-500"
                  : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {/* Radio Circle & Letter */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 transition-colors ${
                  isSelected
                    ? "bg-compass-700 text-white"
                    : "bg-slate-100 text-slate-700 border border-slate-200"
                }`}
              >
                {opt.id}
              </div>

              {/* Option Text */}
              <div className="flex-1 pt-0.5 text-sm text-slate-800 leading-normal">
                {opt.text}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
