"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { startAttemptAction } from "@/actions/attempts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_TESTS } from "@/lib/data/mock-data";
import {
  Compass,
  Clock,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

export default function TestInstructionPage({
  params,
}: {
  params: { testId: string };
}) {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [starting, setStarting] = useState(false);

  const test = MOCK_TESTS.find((t) => t.id === params.testId) || MOCK_TESTS[0];

  const handleStartExam = async () => {
    if (!agreed) return;
    setStarting(true);

    try {
      const res = await startAttemptAction({
        testId: test.id,
        mode: "mock",
      });
      router.push(`/attempts/${res.attemptId}`);
    } catch (err) {
      console.error("Failed to start attempt:", err);
      setStarting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Test Meta Header */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge variant="warning">Official Computer Based Test (CBT)</Badge>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-compass-700" />
            <span>Duration: {test.duration_minutes} Minutes</span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">{test.title}</h1>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">{test.description}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Marks</span>
            <span className="font-bold text-slate-800 text-sm">{test.total_marks} Marks</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
            <span className="text-emerald-700 block text-[10px] uppercase font-bold">Correct Answer</span>
            <span className="font-bold text-emerald-800 text-sm">+{test.positive_mark} Mark</span>
          </div>
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-100">
            <span className="text-rose-700 block text-[10px] uppercase font-bold">Negative Penalty</span>
            <span className="font-bold text-rose-800 text-sm">-{test.negative_mark} Mark</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Unattempted</span>
            <span className="font-bold text-slate-800 text-sm">0 Marks</span>
          </div>
        </div>
      </div>

      {/* General Examination Instructions */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-compass-700" />
          Examination Guidelines & CBT Navigation
        </h2>

        <div className="space-y-4 text-xs md:text-sm text-slate-700 leading-relaxed">
          <p>
            <strong>1. Exam Flow & Timer:</strong> Once you click &quot;Begin Examination&quot;, the countdown timer located in the top navigation bar will begin automatically. When the timer hits 00:00, your answers will be automatically submitted.
          </p>
          <p>
            <strong>2. Split-Screen Layout:</strong> For passage-based questions, the comprehension passage or legal scenario is displayed on the left pane with text resize controls. Questions and multiple-choice options are displayed on the right pane.
          </p>
          <p>
            <strong>3. Palette Status Legend:</strong> During the examination, questions will be categorized on the palette:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-2 pt-1 text-xs">
            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
              <span className="w-5 h-5 rounded bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">
                1
              </span>
              <span><strong>Answered:</strong> You have selected an answer.</span>
            </div>
            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-900">
              <span className="w-5 h-5 rounded bg-rose-500 text-white font-bold flex items-center justify-center text-[10px]">
                2
              </span>
              <span><strong>Not Answered:</strong> You have visited but not chosen an option.</span>
            </div>
            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-purple-50 border border-purple-200 text-purple-900">
              <span className="w-5 h-5 rounded bg-purple-600 text-white font-bold flex items-center justify-center text-[10px]">
                3
              </span>
              <span><strong>Marked for Review:</strong> You marked to review later.</span>
            </div>
            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
              <span className="w-5 h-5 rounded bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px]">
                4
              </span>
              <span><strong>Not Visited:</strong> You have not navigated to this question yet.</span>
            </div>
          </div>

          <p>
            <strong>4. Saving Responses:</strong> Click <em>&quot;Save &amp; Next&quot;</em> to save your selected option and move to the next question. Your answers are continuously synced to the cloud.
          </p>
        </div>

        {/* Declaration and Agreement Checkbox */}
        <div className="pt-6 border-t border-slate-100 space-y-4">
          <label className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-compass-700 focus:ring-compass-500"
            />
            <span className="text-xs font-medium text-slate-800 leading-normal">
              I have read and understood all the examination instructions above. I understand that the timer cannot be paused and results will be displayed upon final submission.
            </span>
          </label>

          <Button
            variant="primary"
            size="lg"
            disabled={!agreed || starting}
            onClick={handleStartExam}
            className="w-full font-bold shadow-md gap-2"
          >
            {starting ? "Launching CBT Exam Engine..." : "I am Ready to Begin"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
