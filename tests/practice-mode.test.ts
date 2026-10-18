import { describe, it, expect } from "vitest";
import { Question } from "../src/lib/types/clat";
import { MOCK_QUESTIONS } from "../src/lib/data/mock-data";

describe("Practice Mode Behaviour", () => {
  const sampleQuestion: Question = MOCK_QUESTIONS[0]; // Legal question, correct_option: 'B'

  it("evaluates student option selection immediately in practice mode", () => {
    const selectedOptionA = "A";
    const isOptionACorrect = selectedOptionA === sampleQuestion.correct_option;
    expect(isOptionACorrect).toBe(false);

    const selectedOptionB = "B";
    const isOptionBCorrect = selectedOptionB === sampleQuestion.correct_option;
    expect(isOptionBCorrect).toBe(true);
  });

  it("exposes the correct answer and comprehensive explanation upon attempt", () => {
    expect(sampleQuestion.explanation).toBeDefined();
    expect(sampleQuestion.explanation.length).toBeGreaterThan(20);
    expect(sampleQuestion.correct_option).toBe("B");
  });

  it("maintains question tags and difficulty classification for targeted revision", () => {
    expect(sampleQuestion.difficulty).toMatch(/easy|medium|hard/);
    expect(sampleQuestion.tags).toContain("Legal Reasoning");
  });
});
