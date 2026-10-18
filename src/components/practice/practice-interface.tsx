"use client";

import React, { useState } from "react";
import { Question, Passage } from "../../lib/types/clat";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { toggleBookmarkAction } from "../../actions/bookmarks";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Filter,
  Sparkles,
} from "lucide-react";

interface PracticeInterfaceProps {
  questions: Question[];
  initialQuestionIndex?: number;
}

export function PracticeInterface({
  questions,
  initialQuestionIndex = 0,
}: PracticeInterfaceProps) {
  const [currentIndex, setCurrentIndex] = useState(initialQuestionIndex);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, "A" | "B" | "C" | "D">>({});
  const [checkedQuestions, setCheckedQuestions] = useState<Record<string, boolean>>({});
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string, boolean>>({});
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>("all");

  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (optId: "A" | "B" | "C" | "D") => {
    if (!currentQuestion) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestion.id]: optId }));
    // In practice mode, immediately check the question upon selecting an option!
    setCheckedQuestions((prev) => ({ ...prev, [currentQuestion.id]: true }));
  };

  const handleToggleBookmark = async () => {
    if (!currentQuestion) return;
    const isCurrently = bookmarkedIds[currentQuestion.id] || false;
    setBookmarkedIds((prev) => ({ ...prev, [currentQuestion.id]: !isCurrently }));
    await toggleBookmarkAction({
      questionId: currentQuestion.id,
      notes: "Saved from Practice Mode",
      tag: "practice-review",
    });
  };

  const isChecked = currentQuestion ? checkedQuestions[currentQuestion.id] : false;
  const userOption = currentQuestion ? selectedAnswers[currentQuestion.id] : null;
  const isCorrect = userOption === currentQuestion?.correct_option;

  const filteredQuestions =
    selectedSubjectFilter === "all"
      ? questions
      : questions.filter((q) => q.subject?.name === selectedSubjectFilter);

  const subjects = Array.from(new Set(questions.map((q) => q.subject?.name).filter(Boolean)));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-700" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Filter Section:</span>
          <select
            value={selectedSubjectFilter}
            onChange={(e) => {
              setSelectedSubjectFilter(e.target.value);
              setCurrentIndex(0);
            }}
            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-compass-500"
          >
            <option value="all">All Subjects ({questions.length})</option>
            {subjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        {/* Counter & Bookmark */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-700">
            Question <strong>{currentIndex + 1}</strong> of <strong>{questions.length}</strong>
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleBookmark}
            className={`gap-1.5 ${
              currentQuestion && bookmarkedIds[currentQuestion.id]
                ? "bg-amber-50 text-amber-700 border-amber-300"
                : "text-slate-600"
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${currentQuestion && bookmarkedIds[currentQuestion.id] ? "fill-amber-500 text-amber-500" : ""}`} />
            {currentQuestion && bookmarkedIds[currentQuestion.id] ? "Bookmarked" : "Bookmark"}
          </Button>
        </div>
      </div>

      {/* Main Practice Card */}
      {currentQuestion ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Passage Section if Present */}
          {currentQuestion.passage && (
            <div className="p-6 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-compass-700" />
                <h3 className="font-bold text-sm text-slate-900">{currentQuestion.passage.title}</h3>
                {currentQuestion.passage.source && (
                  <span className="text-[11px] text-slate-700 italic ml-auto truncate max-w-xs">
                    {currentQuestion.passage.source}
                  </span>
                )}
              </div>
              <div className="text-sm text-slate-700 font-serif leading-relaxed space-y-3 max-h-60 overflow-y-auto passage-scroll pr-2">
                {currentQuestion.passage.content.split("\n\n").map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>
          )}

          {/* Question Body */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline">{currentQuestion.subject?.name || "General"}</Badge>
              <Badge
                variant={
                  currentQuestion.difficulty === "easy"
                    ? "success"
                    : currentQuestion.difficulty === "medium"
                    ? "warning"
                    : "danger"
                }
              >
                {currentQuestion.difficulty}
              </Badge>
              {currentQuestion.is_pyq && (
                <Badge variant="purple">CLAT {currentQuestion.pyq_year || "PYQ"}</Badge>
              )}
            </div>

            <h2 className="text-base font-semibold text-slate-900 mb-6 leading-relaxed">
              {currentQuestion.question_text}
            </h2>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((opt) => {
                const isSelected = userOption === opt.id;
                const isThisTheCorrectAnswer = opt.id === currentQuestion.correct_option;

                let optionStyles = "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50";

                if (isChecked) {
                  if (isThisTheCorrectAnswer) {
                    optionStyles = "bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500 text-emerald-950 font-medium";
                  } else if (isSelected && !isThisTheCorrectAnswer) {
                    optionStyles = "bg-rose-50 border-rose-500 ring-1 ring-rose-500 text-rose-950";
                  } else {
                    optionStyles = "bg-slate-50 border-slate-200 opacity-60";
                  }
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${optionStyles}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                        isChecked && isThisTheCorrectAnswer
                          ? "bg-emerald-600 text-white"
                          : isChecked && isSelected
                          ? "bg-rose-600 text-white"
                          : isSelected
                          ? "bg-compass-700 text-white"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {opt.id}
                    </div>
                    <div className="flex-1 pt-0.5 text-sm leading-normal">{opt.text}</div>

                    {isChecked && isThisTheCorrectAnswer && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    )}
                    {isChecked && isSelected && !isThisTheCorrectAnswer && (
                      <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Immediate Explanation Card (Reveals in Practice Mode) */}
            {isChecked && (
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${
                      isCorrect ? "bg-emerald-600" : "bg-rose-600"
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                  </div>
                  <span
                    className={`font-bold text-sm ${
                      isCorrect ? "text-emerald-700" : "text-rose-700"
                    }`}
                  >
                    {isCorrect ? "Correct Answer! (+1.0 Mark)" : `Incorrect! Correct Option is ${currentQuestion.correct_option}`}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 text-sm text-slate-700 leading-relaxed font-sans">
                  <span className="font-bold text-slate-900 block mb-1">Explanation:</span>
                  {currentQuestion.explanation}
                </div>

                {currentQuestion.tags && currentQuestion.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {currentQuestion.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-medium px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              disabled={currentIndex === questions.length - 1}
            >
              Next Question
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <HelpCircle className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800">No Questions Found</h3>
          <p className="text-xs text-slate-700 mt-1">Try selecting a different filter above.</p>
        </div>
      )}
    </div>
  );
}
