import { Question, AttemptResponse, SubjectScoreBreakdown } from "../types/clat";

export interface ScoreCalculationInput {
  questions: Question[];
  responses: Record<string, AttemptResponse>;
  positiveMark?: number;
  negativeMark?: number;
}

export interface ScoreSummaryResult {
  score: number;
  totalMarks: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  accuracy: number;
  subjectBreakdown: Record<string, SubjectScoreBreakdown>;
}

export function calculateExamScore({
  questions,
  responses,
  positiveMark = 1.0,
  negativeMark = 0.25,
}: ScoreCalculationInput): ScoreSummaryResult {
  let correctCount = 0;
  let incorrectCount = 0;
  let unattemptedCount = 0;
  let totalScore = 0;

  const subjectBreakdown: Record<string, SubjectScoreBreakdown> = {};

  questions.forEach((q) => {
    const subjectName = q.subject?.name || "General";
    if (!subjectBreakdown[subjectName]) {
      subjectBreakdown[subjectName] = {
        subject_name: subjectName,
        correct: 0,
        incorrect: 0,
        unattempted: 0,
        score: 0,
        total_marks: 0,
        total_questions: 0,
        time_spent_seconds: 0,
      };
    }

    const sub = subjectBreakdown[subjectName];
    sub.total_questions += 1;
    const qPosMark = q.marks_positive ?? positiveMark;
    const qNegMark = q.marks_negative ?? negativeMark;
    sub.total_marks += qPosMark;

    const resp = responses[q.id];
    if (resp?.time_spent_seconds) {
      sub.time_spent_seconds += resp.time_spent_seconds;
    }

    if (!resp || !resp.selected_option) {
      unattemptedCount++;
      sub.unattempted++;
    } else if (resp.selected_option === q.correct_option) {
      correctCount++;
      sub.correct++;
      totalScore += qPosMark;
      sub.score += qPosMark;
    } else {
      incorrectCount++;
      sub.incorrect++;
      totalScore -= qNegMark;
      sub.score -= qNegMark;
    }
  });

  const totalAttempted = correctCount + incorrectCount;
  const accuracy = totalAttempted > 0 ? (correctCount / totalAttempted) * 100 : 0;
  const totalMarks = questions.reduce((acc, q) => acc + (q.marks_positive ?? positiveMark), 0);

  // Round scores to 2 decimal places to avoid floating point issues
  const roundedScore = Math.round(totalScore * 100) / 100;

  Object.keys(subjectBreakdown).forEach((k) => {
    subjectBreakdown[k].score = Math.round(subjectBreakdown[k].score * 100) / 100;
  });

  return {
    score: roundedScore,
    totalMarks,
    totalQuestions: questions.length,
    correctCount,
    incorrectCount,
    unattemptedCount,
    accuracy: Math.round(accuracy * 100) / 100,
    subjectBreakdown,
  };
}

export function getPaletteStatus(
  resp: AttemptResponse | undefined,
  isCurrent: boolean
): 'not_visited' | 'not_answered' | 'answered' | 'marked_for_review' | 'answered_and_marked' {
  if (!resp || !resp.visited) {
    return 'not_visited';
  }

  const hasAnswer = Boolean(resp.selected_option);
  const isMarked = Boolean(resp.is_marked_for_review);

  if (hasAnswer && isMarked) {
    return 'answered_and_marked';
  }
  if (hasAnswer && !isMarked) {
    return 'answered';
  }
  if (!hasAnswer && isMarked) {
    return 'marked_for_review';
  }
  return 'not_answered';
}

export function formatSecondsToTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const hrs = Math.floor(mins / 60);
  const remainingMins = mins % 60;

  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${remainingMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
