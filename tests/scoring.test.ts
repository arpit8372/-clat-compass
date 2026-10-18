import { describe, it, expect } from "vitest";
import { calculateExamScore, getPaletteStatus, formatSecondsToTime } from "../src/lib/utils/scoring";
import { Question, AttemptResponse } from "../src/lib/types/clat";

describe("CLAT Scoring System", () => {
  const mockQuestions: Question[] = [
    {
      id: "q1",
      subject_id: "sub-legal",
      question_text: "Legal question 1",
      options: [
        { id: "A", text: "Option A" },
        { id: "B", text: "Option B" },
      ],
      correct_option: "A",
      explanation: "A is correct",
      marks_positive: 1.0,
      marks_negative: 0.25,
      difficulty: "medium",
      subject: { id: "sub-legal", name: "Legal Reasoning", code: "legal", display_order: 1 },
    },
    {
      id: "q2",
      subject_id: "sub-legal",
      question_text: "Legal question 2",
      options: [
        { id: "A", text: "Option A" },
        { id: "B", text: "Option B" },
      ],
      correct_option: "B",
      explanation: "B is correct",
      marks_positive: 1.0,
      marks_negative: 0.25,
      difficulty: "medium",
      subject: { id: "sub-legal", name: "Legal Reasoning", code: "legal", display_order: 1 },
    },
    {
      id: "q3",
      subject_id: "sub-english",
      question_text: "English question 1",
      options: [
        { id: "A", text: "Option A" },
        { id: "B", text: "Option B" },
      ],
      correct_option: "A",
      explanation: "A is correct",
      marks_positive: 1.0,
      marks_negative: 0.25,
      difficulty: "easy",
      subject: { id: "sub-english", name: "English Language", code: "english", display_order: 2 },
    },
    {
      id: "q4",
      subject_id: "sub-english",
      question_text: "English question 2",
      options: [
        { id: "A", text: "Option A" },
        { id: "B", text: "Option B" },
      ],
      correct_option: "A",
      explanation: "A is correct",
      marks_positive: 1.0,
      marks_negative: 0.25,
      difficulty: "hard",
      subject: { id: "sub-english", name: "English Language", code: "english", display_order: 2 },
    },
  ];

  it("calculates perfect score correctly", () => {
    const responses: Record<string, AttemptResponse> = {
      q1: { attempt_id: "att-1", question_id: "q1", selected_option: "A", is_marked_for_review: false, time_spent_seconds: 30, visited: true },
      q2: { attempt_id: "att-1", question_id: "q2", selected_option: "B", is_marked_for_review: false, time_spent_seconds: 40, visited: true },
      q3: { attempt_id: "att-1", question_id: "q3", selected_option: "A", is_marked_for_review: false, time_spent_seconds: 25, visited: true },
      q4: { attempt_id: "att-1", question_id: "q4", selected_option: "A", is_marked_for_review: false, time_spent_seconds: 25, visited: true },
    };

    const result = calculateExamScore({ questions: mockQuestions, responses });
    expect(result.score).toBe(4.0);
    expect(result.correctCount).toBe(4);
    expect(result.incorrectCount).toBe(0);
    expect(result.unattemptedCount).toBe(0);
    expect(result.accuracy).toBe(100);
  });

  it("calculates negative marks (-0.25 per wrong answer) and unattempted (0)", () => {
    // 2 correct (+2.0), 1 wrong (-0.25), 1 unattempted (0) -> score = 1.75
    const responses: Record<string, AttemptResponse> = {
      q1: { attempt_id: "att-1", question_id: "q1", selected_option: "A", is_marked_for_review: false, time_spent_seconds: 30, visited: true }, // Correct (+1)
      q2: { attempt_id: "att-1", question_id: "q2", selected_option: "A", is_marked_for_review: false, time_spent_seconds: 40, visited: true }, // Incorrect (-0.25)
      q3: { attempt_id: "att-1", question_id: "q3", selected_option: "A", is_marked_for_review: false, time_spent_seconds: 25, visited: true }, // Correct (+1)
      // q4 unattempted
    };

    const result = calculateExamScore({ questions: mockQuestions, responses });
    expect(result.score).toBe(1.75);
    expect(result.correctCount).toBe(2);
    expect(result.incorrectCount).toBe(1);
    expect(result.unattemptedCount).toBe(1);
    // Accuracy = 2 / 3 = 66.67%
    expect(result.accuracy).toBe(66.67);

    // Section breakdown check
    expect(result.subjectBreakdown["Legal Reasoning"].score).toBe(0.75);
    expect(result.subjectBreakdown["Legal Reasoning"].correct).toBe(1);
    expect(result.subjectBreakdown["Legal Reasoning"].incorrect).toBe(1);

    expect(result.subjectBreakdown["English Language"].score).toBe(1.0);
    expect(result.subjectBreakdown["English Language"].correct).toBe(1);
    expect(result.subjectBreakdown["English Language"].unattempted).toBe(1);
  });

  it("resolves CBT palette statuses properly", () => {
    expect(getPaletteStatus(undefined, false)).toBe("not_visited");
    expect(getPaletteStatus({ attempt_id: "a", question_id: "q", selected_option: null, is_marked_for_review: false, time_spent_seconds: 0, visited: false }, false)).toBe("not_visited");
    expect(getPaletteStatus({ attempt_id: "a", question_id: "q", selected_option: null, is_marked_for_review: false, time_spent_seconds: 5, visited: true }, false)).toBe("not_answered");
    expect(getPaletteStatus({ attempt_id: "a", question_id: "q", selected_option: "A", is_marked_for_review: false, time_spent_seconds: 5, visited: true }, false)).toBe("answered");
    expect(getPaletteStatus({ attempt_id: "a", question_id: "q", selected_option: null, is_marked_for_review: true, time_spent_seconds: 5, visited: true }, false)).toBe("marked_for_review");
    expect(getPaletteStatus({ attempt_id: "a", question_id: "q", selected_option: "C", is_marked_for_review: true, time_spent_seconds: 5, visited: true }, false)).toBe("answered_and_marked");
  });

  it("formats time seconds to mm:ss and hh:mm:ss", () => {
    expect(formatSecondsToTime(75)).toBe("01:15");
    expect(formatSecondsToTime(3600)).toBe("01:00:00");
    expect(formatSecondsToTime(7225)).toBe("02:00:25");
  });
});
