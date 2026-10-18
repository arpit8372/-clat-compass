"use client";

import React from "react";
import { Question, AttemptResponse, PaletteQuestionStatus } from "../../lib/types/clat";
import { getPaletteStatus } from "../../lib/utils/scoring";

interface QuestionPaletteProps {
  questions: Question[];
  responses: Record<string, AttemptResponse>;
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  sectionNames?: string[];
  activeSection?: string;
  onSelectSection?: (section: string) => void;
}

export function QuestionPalette({
  questions,
  responses,
  currentIndex,
  onSelectIndex,
  sectionNames,
  activeSection,
  onSelectSection,
}: QuestionPaletteProps) {
  // Compute counts
  let answeredCount = 0;
  let notAnsweredCount = 0;
  let notVisitedCount = 0;
  let markedCount = 0;
  let markedAnsweredCount = 0;

  questions.forEach((q) => {
    const status = getPaletteStatus(responses[q.id], false);
    if (status === "answered") answeredCount++;
    else if (status === "not_answered") notAnsweredCount++;
    else if (status === "marked_for_review") markedCount++;
    else if (status === "answered_and_marked") markedAnsweredCount++;
    else notVisitedCount++;
  });

  const getStatusStyle = (status: PaletteQuestionStatus, isCurrent: boolean) => {
    const currentRing = isCurrent ? "ring-2 ring-offset-2 ring-compass-600 font-extrabold scale-105 z-10" : "";

    switch (status) {
      case "answered":
        return `bg-emerald-600 text-white hover:bg-emerald-700 ${currentRing}`;
      case "not_answered":
        return `bg-rose-500 text-white hover:bg-rose-600 ${currentRing}`;
      case "marked_for_review":
        return `bg-purple-600 text-white hover:bg-purple-700 ${currentRing}`;
      case "answered_and_marked":
        return `bg-indigo-600 text-white hover:bg-indigo-700 relative ${currentRing}`;
      case "not_visited":
      default:
        return `bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200 ${currentRing}`;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 border-l border-slate-200 w-80 flex-shrink-0">
      {/* Palette Title */}
      <div className="p-3.5 bg-white border-b border-slate-200">
        <h3 className="font-bold text-sm text-slate-900 tracking-tight">Question Palette</h3>
      </div>

      {/* Section Filter Pills (if test has multiple sections) */}
      {sectionNames && sectionNames.length > 1 && (
        <div className="p-2 border-b border-slate-200 bg-white flex flex-wrap gap-1">
          {sectionNames.map((sec) => (
            <button
              key={sec}
              onClick={() => onSelectSection && onSelectSection(sec)}
              className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${
                activeSection === sec
                  ? "bg-compass-700 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      )}

      {/* Legend with Counts */}
      <div className="p-3 bg-white border-b border-slate-200 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] bg-emerald-600 text-white">
            {answeredCount}
          </span>
          <span className="text-slate-600">Answered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] bg-rose-500 text-white">
            {notAnsweredCount}
          </span>
          <span className="text-slate-600">Not Answered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] bg-purple-600 text-white">
            {markedCount}
          </span>
          <span className="text-slate-600">Marked for Review</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] bg-indigo-600 text-white">
            {markedAnsweredCount}
          </span>
          <span className="text-slate-600">Ans & Marked</span>
        </div>
        <div className="flex items-center gap-1.5 col-span-2">
          <span className="w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] bg-slate-100 text-slate-700 border border-slate-300">
            {notVisitedCount}
          </span>
          <span className="text-slate-600">Not Visited</span>
        </div>
      </div>

      {/* Question Number Buttons Grid */}
      <div className="flex-1 overflow-y-auto passage-scroll p-4">
        <div className="grid grid-cols-5 gap-2.5">
          {questions.map((q, idx) => {
            const resp = responses[q.id];
            const isCurrent = idx === currentIndex;
            const status = getPaletteStatus(resp, isCurrent);

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => onSelectIndex(idx)}
                className={`w-10 h-10 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${getStatusStyle(
                  status,
                  isCurrent
                )}`}
              >
                {idx + 1}
                {status === "answered_and_marked" && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-300 ring-1 ring-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
