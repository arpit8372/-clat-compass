import React from "react";
import { redirect, notFound } from "next/navigation";
import { getAttemptDetails } from "@/actions/attempts";
import { SplitScreenCbt } from "@/components/cbt/split-screen-cbt";

export default async function AttemptPage({
  params,
}: {
  params: { attemptId: string };
}) {
  const { attempt, questions, responses } = await getAttemptDetails(params.attemptId);

  if (!attempt) {
    notFound();
  }

  // If already submitted, redirect to result scorecard
  if (attempt.status === "completed") {
    redirect(`/results/${attempt.id}`);
  }

  return (
    <main className="h-screen w-screen overflow-hidden">
      <SplitScreenCbt
        attempt={attempt}
        questions={questions}
        initialResponses={responses}
      />
    </main>
  );
}
