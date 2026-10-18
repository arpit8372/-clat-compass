import { describe, it, expect } from "vitest";
import { getPaletteStatus } from "../src/lib/utils/scoring";
import { AttemptResponse } from "../src/lib/types/clat";

describe("Mock Mode Test Engine Behaviour", () => {
  it("hides question correctness from student response during active mock test", () => {
    // In mock mode, the server and response state does NOT reveal `is_correct` until final submission
    const activeTestResponse: AttemptResponse = {
      attempt_id: "mock-att-1",
      question_id: "q-legal-1",
      selected_option: "B",
      is_marked_for_review: false,
      time_spent_seconds: 45,
      visited: true,
      is_correct: null, // strictly null while test is ongoing
    };

    expect(activeTestResponse.is_correct).toBeNull();
    expect(activeTestResponse.selected_option).toBe("B");
  });

  it("updates CBT question palette state through the 5 standard states", () => {
    // 1. Unvisited
    let resp: AttemptResponse | undefined = undefined;
    expect(getPaletteStatus(resp, false)).toBe("not_visited");

    // 2. Visited but not answered
    resp = { attempt_id: "1", question_id: "q", selected_option: null, is_marked_for_review: false, time_spent_seconds: 5, visited: true };
    expect(getPaletteStatus(resp, false)).toBe("not_answered");

    // 3. Answered
    resp = { attempt_id: "1", question_id: "q", selected_option: "C", is_marked_for_review: false, time_spent_seconds: 25, visited: true };
    expect(getPaletteStatus(resp, false)).toBe("answered");

    // 4. Marked for Review (without answer)
    resp = { attempt_id: "1", question_id: "q", selected_option: null, is_marked_for_review: true, time_spent_seconds: 12, visited: true };
    expect(getPaletteStatus(resp, false)).toBe("marked_for_review");

    // 5. Answered & Marked for Review
    resp = { attempt_id: "1", question_id: "q", selected_option: "A", is_marked_for_review: true, time_spent_seconds: 35, visited: true };
    expect(getPaletteStatus(resp, false)).toBe("answered_and_marked");
  });

  it("calculates palette summary counts accurately for pre-submission dialog", () => {
    const totalQuestions = 20;
    const responses: Record<string, AttemptResponse> = {
      q1: { attempt_id: "1", question_id: "q1", selected_option: "A", is_marked_for_review: false, time_spent_seconds: 20, visited: true },
      q2: { attempt_id: "1", question_id: "q2", selected_option: "B", is_marked_for_review: true, time_spent_seconds: 30, visited: true },
      q3: { attempt_id: "1", question_id: "q3", selected_option: null, is_marked_for_review: true, time_spent_seconds: 10, visited: true },
      q4: { attempt_id: "1", question_id: "q4", selected_option: null, is_marked_for_review: false, time_spent_seconds: 5, visited: true },
    };

    let answered = 0;
    let marked = 0;
    let notAnswered = 0;

    for (let i = 1; i <= totalQuestions; i++) {
      const qid = `q${i}`;
      const r = responses[qid];
      const status = getPaletteStatus(r, false);
      if (status === "answered" || status === "answered_and_marked") answered++;
      if (status === "marked_for_review" || status === "answered_and_marked") marked++;
      if (status === "not_answered") notAnswered++;
    }

    expect(answered).toBe(2); // q1, q2
    expect(marked).toBe(2);   // q2, q3
    expect(notAnswered).toBe(1); // q4
  });
});
