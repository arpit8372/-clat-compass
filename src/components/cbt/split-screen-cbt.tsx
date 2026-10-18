"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Question, TestAttempt, AttemptResponse } from "../../lib/types/clat";
import { PassageViewer } from "./passage-viewer";
import { QuestionCard } from "./question-card";
import { QuestionPalette } from "./question-palette";
import { ExamTimer } from "./exam-timer";
import { SubmitModal } from "./submit-modal";
import { Button } from "../ui/button";
import { saveResponseAction, submitAttemptAction } from "../../actions/attempts";
import { Compass, ChevronLeft, ChevronRight, Bookmark, RotateCcw, Send, LayoutGrid } from "lucide-react";

interface SplitScreenCbtProps {
  attempt: TestAttempt;
  questions: Question[];
  initialResponses: Record<string, AttemptResponse>;
}

export function SplitScreenCbt({
  attempt,
  questions,
  initialResponses,
}: SplitScreenCbtProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, AttemptResponse>>(initialResponses);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paletteOpenMobile, setPaletteOpenMobile] = useState(false);

  // Duration in seconds
  const totalDurationSeconds = (attempt.test?.duration_minutes ?? 120) * 60;
  const initialTimeLeft = Math.max(0, totalDurationSeconds - (attempt.time_spent_seconds || 0));
  const [totalTimeSpent, setTotalTimeSpent] = useState(attempt.time_spent_seconds || 0);

  const currentQuestion = questions[currentIndex];

  // Distinct sections for section navigation tabs
  const sectionNames = Array.from(
    new Set(questions.map((q) => q.subject?.name || "General"))
  );
  const activeSection = currentQuestion?.subject?.name || "General";

  // Mark current question as visited on mount and index change
  useEffect(() => {
    if (!currentQuestion) return;

    setResponses((prev) => {
      const existing = prev[currentQuestion.id];
      if (existing && existing.visited) return prev;

      const updated: AttemptResponse = {
        attempt_id: attempt.id,
        question_id: currentQuestion.id,
        selected_option: existing?.selected_option || null,
        is_marked_for_review: existing?.is_marked_for_review || false,
        time_spent_seconds: existing?.time_spent_seconds || 0,
        visited: true,
      };

      // Background persist visited
      saveResponseAction({
        attemptId: attempt.id,
        questionId: currentQuestion.id,
        selectedOption: updated.selected_option,
        isMarkedForReview: updated.is_marked_for_review,
        timeSpentSeconds: updated.time_spent_seconds,
        visited: true,
      });

      return { ...prev, [currentQuestion.id]: updated };
    });
  }, [currentIndex, currentQuestion, attempt.id]);

  // Handle selecting an option
  const handleSelectOption = (optionId: "A" | "B" | "C" | "D") => {
    if (!currentQuestion) return;

    setResponses((prev) => {
      const existing = prev[currentQuestion.id];
      const updated: AttemptResponse = {
        attempt_id: attempt.id,
        question_id: currentQuestion.id,
        selected_option: optionId,
        is_marked_for_review: existing?.is_marked_for_review || false,
        time_spent_seconds: (existing?.time_spent_seconds || 0) + 1,
        visited: true,
        answered_at: new Date().toISOString(),
      };

      saveResponseAction({
        attemptId: attempt.id,
        questionId: currentQuestion.id,
        selectedOption: optionId,
        isMarkedForReview: updated.is_marked_for_review,
        timeSpentSeconds: updated.time_spent_seconds,
        visited: true,
      });

      return { ...prev, [currentQuestion.id]: updated };
    });
  };

  // Clear current response
  const handleClearResponse = () => {
    if (!currentQuestion) return;

    setResponses((prev) => {
      const existing = prev[currentQuestion.id];
      const updated: AttemptResponse = {
        attempt_id: attempt.id,
        question_id: currentQuestion.id,
        selected_option: null,
        is_marked_for_review: false,
        time_spent_seconds: existing?.time_spent_seconds || 0,
        visited: true,
      };

      saveResponseAction({
        attemptId: attempt.id,
        questionId: currentQuestion.id,
        selectedOption: null,
        isMarkedForReview: false,
        timeSpentSeconds: updated.time_spent_seconds,
        visited: true,
      });

      return { ...prev, [currentQuestion.id]: updated };
    });
  };

  // Mark for review & next
  const handleMarkForReviewAndNext = () => {
    if (!currentQuestion) return;

    setResponses((prev) => {
      const existing = prev[currentQuestion.id];
      const updated: AttemptResponse = {
        attempt_id: attempt.id,
        question_id: currentQuestion.id,
        selected_option: existing?.selected_option || null,
        is_marked_for_review: true,
        time_spent_seconds: existing?.time_spent_seconds || 0,
        visited: true,
      };

      saveResponseAction({
        attemptId: attempt.id,
        questionId: currentQuestion.id,
        selectedOption: updated.selected_option,
        isMarkedForReview: true,
        timeSpentSeconds: updated.time_spent_seconds,
        visited: true,
      });

      return { ...prev, [currentQuestion.id]: updated };
    });

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Save & Next
  const handleSaveAndNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Go to previous question
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Jump to first question of selected section
  const handleSelectSection = (sectionName: string) => {
    const targetIdx = questions.findIndex(
      (q) => (q.subject?.name || "General") === sectionName
    );
    if (targetIdx >= 0) {
      setCurrentIndex(targetIdx);
    }
  };

  // Submit test
  const handleSubmitTest = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const res = await submitAttemptAction({
        attemptId: attempt.id,
        totalTimeSeconds: totalTimeSpent,
      });
      if (res.success) {
        router.push(`/results/${attempt.id}`);
      }
    } catch (err) {
      console.error("Submission failed:", err);
      setIsSubmitting(false);
    }
  }, [attempt.id, totalTimeSpent, router]);

  // Timer tick
  const handleTimerTick = (secondsLeft: number) => {
    setTotalTimeSpent((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 select-none">
      {/* Top Exam Header */}
      <header className="h-14 bg-slate-900 text-white px-4 flex items-center justify-between border-b border-slate-800 flex-shrink-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-slate-100 truncate max-w-xs md:max-w-md">
              {attempt.test?.title || "CLAT Practice Exam"}
            </h1>
            <span className="text-[10px] text-slate-400">Computer Based Test (CBT) Interface</span>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto max-w-lg">
          {sectionNames.map((sec) => (
            <button
              key={sec}
              onClick={() => handleSelectSection(sec)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                activeSection === sec
                  ? "bg-compass-600 text-white shadow-xs"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {sec}
            </button>
          ))}
        </div>

        {/* Timer and Mobile Palette button */}
        <div className="flex items-center gap-3">
          <ExamTimer
            initialSeconds={initialTimeLeft}
            onTimeUp={handleSubmitTest}
            onTick={handleTimerTick}
          />

          <button
            onClick={() => setPaletteOpenMobile(!paletteOpenMobile)}
            className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700"
            title="Toggle Question Palette"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>

          <Button
            variant="gold"
            size="sm"
            onClick={() => setIsSubmitModalOpen(true)}
            className="font-bold shadow-md"
          >
            Submit Test
          </Button>
        </div>
      </header>

      {/* Main Split Screen Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Side: Passage */}
        <div className="w-1/2 hidden md:block h-full">
          <PassageViewer passage={currentQuestion?.passage} />
        </div>

        {/* Center / Right Side: Question & Options */}
        <div className="flex-1 h-full flex flex-col">
          {currentQuestion && (
            <QuestionCard
              question={currentQuestion}
              index={currentIndex}
              total={questions.length}
              selectedOption={responses[currentQuestion.id]?.selected_option || null}
              onSelectOption={handleSelectOption}
              sectionName={currentQuestion.subject?.name}
            />
          )}
        </div>

        {/* Right Palette: Desktop */}
        <div className="hidden xl:block h-full">
          <QuestionPalette
            questions={questions}
            responses={responses}
            currentIndex={currentIndex}
            onSelectIndex={setCurrentIndex}
            sectionNames={sectionNames}
            activeSection={activeSection}
            onSelectSection={handleSelectSection}
          />
        </div>

        {/* Mobile Palette Drawer Overlay */}
        {paletteOpenMobile && (
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-2xs flex justify-end xl:hidden">
            <div className="w-80 h-full bg-white shadow-2xl flex flex-col">
              <div className="p-3 border-b flex justify-between items-center bg-slate-100">
                <span className="font-bold text-sm">Question Palette</span>
                <button
                  onClick={() => setPaletteOpenMobile(false)}
                  className="text-xs font-semibold text-slate-700 hover:text-slate-800 px-2 py-1 bg-white rounded border"
                >
                  Close
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <QuestionPalette
                  questions={questions}
                  responses={responses}
                  currentIndex={currentIndex}
                  onSelectIndex={(idx) => {
                    setCurrentIndex(idx);
                    setPaletteOpenMobile(false);
                  }}
                  sectionNames={sectionNames}
                  activeSection={activeSection}
                  onSelectSection={handleSelectSection}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Footer Bar */}
      <footer className="h-16 bg-white border-t border-slate-200 px-4 flex items-center justify-between flex-shrink-0 z-20 shadow-md">
        {/* Left buttons: Mark for Review & Clear */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkForReviewAndNext}
            className="text-purple-700 border-purple-300 hover:bg-purple-50"
          >
            <Bookmark className="w-4 h-4 text-purple-600" />
            <span className="hidden sm:inline">Mark for Review & Next</span>
            <span className="sm:hidden">Review</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearResponse}
            className="text-slate-600 hover:text-rose-600 hover:bg-rose-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear Response</span>
            <span className="sm:hidden">Clear</span>
          </Button>
        </div>

        {/* Right buttons: Prev, Save & Next, Submit */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveAndNext}
          >
            Save & Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </footer>

      {/* Pre-Submission Summary Modal */}
      <SubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmit={handleSubmitTest}
        isSubmitting={isSubmitting}
        questions={questions}
        responses={responses}
      />
    </div>
  );
}
