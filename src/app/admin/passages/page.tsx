"use client";

import React, { useState } from "react";
import { MOCK_PASSAGES, MOCK_SUBJECTS } from "@/lib/data/mock-data";
import { Passage } from "@/lib/types/clat";
import { createPassageAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, PlusCircle, BookOpen, X, Sparkles } from "lucide-react";

export default function AdminPassagesPage() {
  const [passages, setPassages] = useState<Passage[]>(MOCK_PASSAGES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState(MOCK_SUBJECTS[0].id);
  const [source, setSource] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleCreatePassage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const res = await createPassageAction({
      title,
      subject_id: subjectId,
      source,
      content,
    });

    if (res.success) {
      setPassages((prev) => [
        {
          id: res.passageId || `p-${Date.now()}`,
          title,
          subject_id: subjectId,
          source,
          content,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
      setIsModalOpen(false);
      setTitle("");
      setSource("");
      setContent("");
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900">
            Passages Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            CLAT reading comprehension, legal doctrines, editorial excerpts, and DI caselets.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsModalOpen(true)}
          className="gap-2 font-bold shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          Create Passage
        </Button>
      </div>

      {/* Passages List */}
      <div className="space-y-4">
        {passages.map((p) => {
          const subject = MOCK_SUBJECTS.find((s) => s.id === p.subject_id);
          const wordCount = p.content.split(/\s+/).length;

          return (
            <div
              key={p.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{subject?.name || "Legal Reasoning"}</Badge>
                  <span className="text-xs font-semibold text-slate-400">
                    ~{wordCount} words
                  </span>
                </div>

                {p.source && (
                  <span className="text-[11px] text-slate-500 italic max-w-sm truncate">
                    Source: {p.source}
                  </span>
                )}
              </div>

              <h3 className="font-bold text-base text-slate-900">{p.title}</h3>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 font-serif text-xs md:text-sm text-slate-700 leading-relaxed max-h-40 overflow-y-auto passage-scroll space-y-2">
                {p.content.split("\n\n").map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Passage Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto passage-scroll shadow-2xl border border-slate-200 p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-lg text-slate-900">Add New Passage</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePassage} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Passage Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Doctrine of Promissory Estoppel"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Subject</label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  >
                    {MOCK_SUBJECTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Source Citation</label>
                  <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="e.g. Adapted from Supreme Court Observer"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Passage Text (approx 350-450 words)
                </label>
                <textarea
                  required
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste or write the legal passage, caselet, or editorial text..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-serif"
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
                  {submitting ? "Saving..." : "Save Passage"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
