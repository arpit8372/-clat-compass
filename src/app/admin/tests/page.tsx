"use client";

import React, { useState } from "react";
import { MOCK_TESTS, MOCK_QUESTIONS } from "@/lib/data/mock-data";
import { Test } from "@/lib/types/clat";
import { createTestAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Compass, PlusCircle, Clock, X, CheckCircle2 } from "lucide-react";

export default function AdminTestsPage() {
  const [tests, setTests] = useState<Test[]>(MOCK_TESTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"full_mock" | "sectional" | "pyq">("full_mock");
  const [duration, setDuration] = useState(120);
  const [totalMarks, setTotalMarks] = useState(120);
  const [pyqYear, setPyqYear] = useState(2024);
  const [submitting, setSubmitting] = useState(false);

  const handleCreateTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const res = await createTestAction({
      title,
      description,
      type,
      duration_minutes: duration,
      total_marks: totalMarks,
      positive_mark: 1.0,
      negative_mark: 0.25,
      pyq_year: type === "pyq" ? pyqYear : null,
      is_published: true,
      questionIds: MOCK_QUESTIONS.map((q) => q.id),
    });

    if (res.success) {
      setTests((prev) => [
        {
          id: `test-${Date.now()}`,
          title,
          slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          description,
          type,
          duration_minutes: duration,
          total_marks: totalMarks,
          positive_mark: 1.0,
          negative_mark: 0.25,
          is_published: true,
          pyq_year: type === "pyq" ? pyqYear : null,
          question_count: MOCK_QUESTIONS.length,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
      setIsModalOpen(false);
      setTitle("");
      setDescription("");
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900">
            Mock Tests &amp; PYQs Studio
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Assemble full-length examinations, sectional sets, and official PYQ papers.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsModalOpen(true)}
          className="gap-2 font-bold shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Mock
        </Button>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((t) => (
          <div
            key={t.id}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge
                  variant={
                    t.type === "full_mock"
                      ? "warning"
                      : t.type === "sectional"
                      ? "success"
                      : "purple"
                  }
                >
                  {t.type}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{t.duration_minutes} Mins</span>
                </div>
              </div>

              <h3 className="font-bold text-base text-slate-900">{t.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {t.description}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>
                Total Marks: <strong className="text-slate-800">{t.total_marks}</strong>
              </span>
              <span>
                Marking: <strong className="text-slate-800">+{t.positive_mark} / -{t.negative_mark}</strong>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Test Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-lg text-slate-900">Create Mock Examination</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTest} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Test Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. CLAT All India Mock 2"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Test Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as "full_mock" | "sectional" | "pyq")}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  >
                    <option value="full_mock">Full-Length Mock</option>
                    <option value="sectional">Sectional Mock</option>
                    <option value="pyq">Official PYQ Paper</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    required
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              {type === "pyq" && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Exam Year</label>
                  <input
                    type="number"
                    value={pyqYear}
                    onChange={(e) => setPyqYear(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Instructions / Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Exam instructions for students..."
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
                  {submitting ? "Creating Test..." : "Create Test"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
