"use client";

import React, { useState } from "react";
import { MOCK_QUESTIONS, MOCK_SUBJECTS, MOCK_PASSAGES } from "@/lib/data/mock-data";
import { Question } from "@/lib/types/clat";
import { createQuestionAction, deleteQuestionAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  PlusCircle,
  Trash2,
  Filter,
  CheckCircle2,
  X,
  HelpCircle,
} from "lucide-react";

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS);
  const [filterSubject, setFilterSubject] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New Question Form state
  const [subjectId, setSubjectId] = useState(MOCK_SUBJECTS[0].id);
  const [passageId, setPassageId] = useState<string>("");
  const [questionText, setQuestionText] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctOption, setCorrectOption] = useState<"A" | "B" | "C" | "D">("A");
  const [explanation, setExplanation] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [isPyq, setIsPyq] = useState(false);
  const [pyqYear, setPyqYear] = useState<number>(2024);
  const [tags, setTags] = useState("");

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    await deleteQuestionAction(id);
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const newQ: Partial<Question> = {
      subject_id: subjectId,
      passage_id: passageId || null,
      question_text: questionText,
      options: [
        { id: "A", text: optionA },
        { id: "B", text: optionB },
        { id: "C", text: optionC },
        { id: "D", text: optionD },
      ],
      correct_option: correctOption,
      explanation,
      difficulty,
      marks_positive: 1.0,
      marks_negative: 0.25,
      is_pyq: isPyq,
      pyq_year: isPyq ? pyqYear : null,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    const res = await createQuestionAction(newQ);
    if (res.success) {
      setQuestions((prev) => [
        {
          ...newQ,
          id: `q-${Date.now()}`,
          subject: MOCK_SUBJECTS.find((s) => s.id === subjectId),
          passage: MOCK_PASSAGES.find((p) => p.id === passageId),
        } as Question,
        ...prev,
      ]);
      setIsModalOpen(false);
      // Reset form
      setQuestionText("");
      setOptionA("");
      setOptionB("");
      setOptionC("");
      setOptionD("");
      setExplanation("");
      setTags("");
    }
    setSubmitting(false);
  };

  const filtered =
    filterSubject === "all"
      ? questions
      : questions.filter(
          (q) => q.subject_id === filterSubject || q.subject?.name === filterSubject
        );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900">
            CLAT Question Bank
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Author and organise multiple-choice questions across all 5 CLAT syllabus domains.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsModalOpen(true)}
          className="gap-2 font-bold shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          Create Question
        </Button>
      </div>

      {/* Filter and Count Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Subject:</span>
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800"
          >
            <option value="all">All Subjects ({questions.length})</option>
            {MOCK_SUBJECTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs font-semibold text-slate-500">
          Total: {filtered.length} questions
        </span>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filtered.map((q, idx) => (
          <div
            key={q.id}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-400">#{idx + 1}</span>
                <Badge variant="outline">{q.subject?.name || "Subject"}</Badge>
                <Badge
                  variant={
                    q.difficulty === "easy"
                      ? "success"
                      : q.difficulty === "medium"
                      ? "warning"
                      : "danger"
                  }
                >
                  {q.difficulty}
                </Badge>
                {q.is_pyq && <Badge variant="purple">CLAT {q.pyq_year || "PYQ"}</Badge>}
              </div>

              <button
                onClick={() => handleDelete(q.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                title="Delete Question"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm font-semibold text-slate-900 leading-relaxed">
              {q.question_text}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700 pt-2 border-t border-slate-100">
              {q.options.map((opt) => (
                <div
                  key={opt.id}
                  className={`p-2 rounded-lg border flex items-center gap-2 ${
                    opt.id === q.correct_option
                      ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-bold"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <span className="w-5 h-5 rounded flex items-center justify-center bg-white border border-slate-200 text-[10px]">
                    {opt.id}
                  </span>
                  <span className="truncate">{opt.text}</span>
                  {opt.id === q.correct_option && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-auto flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>

            <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg leading-relaxed">
              <span className="font-bold text-slate-700 block mb-0.5">Explanation:</span>
              {q.explanation}
            </div>
          </div>
        ))}
      </div>

      {/* Create Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto passage-scroll shadow-2xl border border-slate-200 p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-lg text-slate-900">Add New CLAT Question</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Subject</label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  >
                    {MOCK_SUBJECTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Link Passage (Optional)
                  </label>
                  <select
                    value={passageId}
                    onChange={(e) => setPassageId(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  >
                    <option value="">None (Standalone Question)</option>
                    {MOCK_PASSAGES.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Question Text</label>
                <textarea
                  required
                  rows={3}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Enter the question problem statement..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              {/* 4 Options */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Multiple Choice Options</label>
                {(["A", "B", "C", "D"] as const).map((letter) => {
                  const val = letter === "A" ? optionA : letter === "B" ? optionB : letter === "C" ? optionC : optionD;
                  const setter = letter === "A" ? setOptionA : letter === "B" ? setOptionB : letter === "C" ? setOptionC : setOptionD;

                  return (
                    <div key={letter} className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded bg-slate-100 font-bold text-xs flex items-center justify-center border">
                        {letter}
                      </span>
                      <input
                        type="text"
                        required
                        value={val}
                        onChange={(e) => setter(e.target.value)}
                        placeholder={`Option ${letter} text...`}
                        className="flex-1 text-xs p-2 rounded-lg border border-slate-300"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Correct Option</label>
                  <select
                    value={correctOption}
                    onChange={(e) => setCorrectOption(e.target.value as "A" | "B" | "C" | "D")}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  >
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as "easy" | "medium" | "hard")}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">PYQ Paper?</label>
                  <label className="flex items-center gap-2 mt-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPyq}
                      onChange={(e) => setIsPyq(e.target.checked)}
                      className="rounded"
                    />
                    <span>Is Official PYQ</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Detailed Explanation &amp; Solution
                </label>
                <textarea
                  required
                  rows={3}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Explain why the option is legally or logically sound..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md" disabled={submitting}>
                  {submitting ? "Saving Question..." : "Save Question"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
