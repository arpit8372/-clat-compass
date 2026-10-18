import React from "react";
import { getAttemptDetails } from "@/actions/attempts";
import { PracticeInterface } from "@/components/practice/practice-interface";
import { notFound } from "next/navigation";

export default async function PracticeAttemptPage({
  params,
}: {
  params: { attemptId: string };
}) {
  const { attempt, questions } = await getAttemptDetails(params.attemptId);

  if (!attempt && questions.length === 0) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900">
          {attempt?.test?.title || "Targeted Practice Session"}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Practice mode: immediate answers and explanations.
        </p>
      </div>

      <PracticeInterface questions={questions} />
    </div>
  );
}
