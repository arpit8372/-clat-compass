"use client";

import React, { useState } from "react";
import { Question, AttemptResponse } from "../../lib/types/clat";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { toggleBookmarkAction } from "../../actions/bookmarks";
import { CheckCircle2, XCircle, HelpCircle, Bookmark, BookOpen, Filter } from "lucide-react";

interface QuestionReviewListProps {
  questions: Question[];
  responses: Record<string, AttemptResponse>;
}

export function QuestionReviewList({ questions, responses }: QuestionReviewListProps) {
  const [filter, setFilter] = useState<"all" | "incorrect" | "correct" | "unattempted">("all");
  const [bookmarkedMap, setBookmarkedMap] = useState<Record<string, boolean>>({});

  const handleToggleBookmark = async (questionId: string) => {
    const isCur = bookmarkedMap[questionId] || false;
    setBookmarkedMap((prev) => ({ ...prev, [questionId]: !isCur }));
    await toggleBookmarkAction({
      questionId,
      notes: "Saved from test review",
      tag: "test-review",
    });
  };

  const filteredQuestions = questions.filter((q) => {
    const resp = responses[q.id];
    const isAttempted = Boolean(resp?.selected_option);
    const isCorrect = resp?.selected_option === q.correct_option;

    if (filter === "correct") return isAttempted && isCorrect;
    if (filter === "incorrect") return isAttempted && !isCorrect;
    if (filter === "unattempted") return !isAttempted;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filter Tabs Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-700" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Review Questions:</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(["all", "incorrect", "correct", "unattempted"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg capitalize transition-colors ${
                filter === tab
                  ? "bg-compass-700 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab === "incorrect" ? "Incorrect Answers" : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {filteredQuestions.map((q, idx) => {
          const originalIndex = questions.findIndex((item) => item.id === q.id);
          const resp = responses[q.id];
          const userOption = resp?.selected_option;
          const isCorrect = userOption === q.correct_option;
          const isUnattempted = !userOption;
          const isBookmarked = bookmarkedMap[q.id];

          return (
            <div
              key={q.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              {/* Question Header */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">
                    Question {originalIndex + 1}
                  </span>
                  <Badge variant="outline">{q.subject?.name || "General"}</Badge>
                  {isUnattempted ? (
                    <Badge variant="default">Unattempted (0)</Badge>
                  ) : isCorrect ? (
                    <Badge variant="success">Correct (+1.0)</Badge>
                  ) : (
                    <Badge variant="danger">Incorrect (-0.25)</Badge>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleBookmark(q.id)}
                  className={`gap-1.5 text-xs ${
                    isBookmarked
                      ? "bg-amber-50 text-amber-800 border-amber-300"
                      : "text-slate-600"
                  }`}
                >
                  <Bookmark
                    className={`w-3.5 h-3.5 ${
                      isBookmarked ? "fill-amber-500 text-amber-500" : ""
                    }`}
                  />
                  {isBookmarked ? "Bookmarked" : "Bookmark"}
                </Button>
              </div>

              {/* Passage Reference (if present) */}
              {q.passage && (
                <div className="p-4 bg-slate-50/50 border-b border-slate-100 text-xs text-slate-600 font-serif leading-relaxed line-clamp-3">
                  <span className="font-sans font-bold text-slate-700 block mb-1">
                    Passage: {q.passage.title}
                  </span>
                  {q.passage.content}
                </div>
              )}

              {/* Question Text */}
              <div className="p-6">
                <h3 className="text-base font-semibold text-slate-900 mb-5 leading-relaxed">
                  {q.question_text}
                </h3>

                {/* Options List */}
                <div className="space-y-3 mb-6">
                  {q.options.map((opt) => {
                    const isUserChoice = userOption === opt.id;
                    const isRightOption = opt.id === q.correct_option;

                    let cardStyles = "border-slate-200 bg-white";
                    let badgeLabel = null;

                    if (isRightOption) {
                      cardStyles = "border-emerald-500 bg-emerald-50/80 ring-1 ring-emerald-500";
                      badgeLabel = (
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded ml-auto flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correct Answer
                        </span>
                      );
                    } else if (isUserChoice && !isRightOption) {
                      cardStyles = "border-rose-400 bg-rose-50/80 ring-1 ring-rose-400";
                      badgeLabel = (
                        <span className="text-[11px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded ml-auto flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Your Choice
                        </span>
                      );
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`p-3.5 rounded-xl border flex items-start gap-3 ${cardStyles}`}
                      >
                        <div
                          className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                            isRightOption
                              ? "bg-emerald-600 text-white"
                              : isUserChoice
                              ? "bg-rose-600 text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {opt.id}
                        </div>
                        <div className="text-sm text-slate-800 pt-0.5">{opt.text}</div>
                        {badgeLabel}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Card */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm leading-relaxed text-slate-700">
                  <span className="font-bold text-slate-900 block mb-1">
                    Analytical Solution:
                  </span>
                  {q.explanation}
                </div>
              </div>
            </div>
          );
        })}

        {filteredQuestions.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800">No questions found for this filter</h3>
          </div>
        )}
      </div>
    </div>
  );
}
