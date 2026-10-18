"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getBookmarksAction, toggleBookmarkAction, updateBookmarkNotesAction } from "@/actions/bookmarks";
import { Bookmark, Question } from "@/lib/types/clat";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookmarkCheck,
  RotateCcw,
  Trash2,
  Edit3,
  Check,
  Tag,
  BookOpen,
  HelpCircle,
  FileText,
} from "lucide-react";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSubject, setFilterSubject] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState("");
  const [editTag, setEditTag] = useState("");

  useEffect(() => {
    async function load() {
      const data = await getBookmarksAction();
      setBookmarks(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleRemove = async (questionId: string) => {
    setBookmarks((prev) => prev.filter((b) => b.question_id !== questionId));
    await toggleBookmarkAction({ questionId });
  };

  const handleStartEdit = (bm: Bookmark) => {
    setEditingId(bm.id);
    setEditNote(bm.notes || "");
    setEditTag(bm.tag || "");
  };

  const handleSaveEdit = async (bmId: string) => {
    setBookmarks((prev) =>
      prev.map((b) => (b.id === bmId ? { ...b, notes: editNote, tag: editTag } : b))
    );
    setEditingId(null);
    await updateBookmarkNotesAction({ bookmarkId: bmId, notes: editNote, tag: editTag });
  };

  const subjects = Array.from(
    new Set(bookmarks.map((b) => b.question?.subject?.name).filter(Boolean))
  );

  const filteredBookmarks =
    filterSubject === "all"
      ? bookmarks
      : bookmarks.filter((b) => b.question?.subject?.name === filterSubject);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
            <BookmarkCheck className="w-4 h-4" />
            Personal Repository
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">
            Saved Bookmarks & Notes
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review critical legal principles, tricky questions, and personal annotations saved across devices.
          </p>
        </div>

        {bookmarks.length > 0 && (
          <Link href="/revision">
            <Button variant="gold" size="md" className="gap-2 font-bold shadow-sm">
              <RotateCcw className="w-4 h-4" />
              Practice Bookmarked Questions
            </Button>
          </Link>
        )}
      </div>

      {/* Filter and Count */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Subject:</span>
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none"
          >
            <option value="all">All Saved ({bookmarks.length})</option>
            {subjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs font-semibold text-slate-500">
          Showing {filteredBookmarks.length} question{filteredBookmarks.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* Bookmarks List */}
      <div className="space-y-6">
        {filteredBookmarks.map((bm) => {
          const q = bm.question;
          const isEditing = editingId === bm.id;

          return (
            <div
              key={bm.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              {/* Question Header */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{q?.subject?.name || "General"}</Badge>
                  {bm.tag && <Badge variant="purple">#{bm.tag}</Badge>}
                  <span className="text-[11px] text-slate-400">
                    Saved {new Date(bm.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStartEdit(bm)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
                    title="Edit Note"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRemove(bm.question_id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                    title="Remove Bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Personal Notes Card */}
              <div className="p-4 bg-amber-50/60 border-b border-amber-100/80">
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block mb-1">
                        Personal Study Note
                      </label>
                      <textarea
                        value={editNote}
                        onChange={(e) => setEditNote(e.target.value)}
                        rows={2}
                        className="w-full text-xs p-2.5 rounded-lg border border-amber-300 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={editTag}
                          onChange={(e) => setEditTag(e.target.value)}
                          placeholder="Tag (e.g. important-principle, tricky)"
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-amber-300 bg-white"
                        />
                      </div>
                      <Button
                        variant="gold"
                        size="sm"
                        onClick={() => handleSaveEdit(bm.id)}
                        className="gap-1 font-bold text-xs"
                      >
                        <Check className="w-3.5 h-3.5" /> Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-amber-900 leading-relaxed">
                    <span className="font-bold text-amber-950 block mb-0.5">My Note:</span>
                    {bm.notes || "No notes added yet. Click edit to add study notes."}
                  </div>
                )}
              </div>

              {/* Passage citation if present */}
              {q?.passage && (
                <div className="p-4 bg-slate-50/40 border-b border-slate-100 text-xs text-slate-600 font-serif leading-relaxed line-clamp-2">
                  <span className="font-sans font-bold text-slate-700 block mb-0.5">
                    Passage: {q.passage.title}
                  </span>
                  {q.passage.content}
                </div>
              )}

              {/* Question Statement & Correct Option */}
              <div className="p-6 space-y-4">
                <h3 className="text-sm md:text-base font-semibold text-slate-900 leading-relaxed">
                  {q?.question_text}
                </h3>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                  <span className="font-bold">Correct Option: {q?.correct_option}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans">
                  <span className="font-bold text-slate-900 block mb-1">Analytical Solution:</span>
                  {q?.explanation}
                </div>
              </div>
            </div>
          );
        })}

        {filteredBookmarks.length === 0 && !loading && (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800">No Bookmarks Saved Yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              While solving in Practice Mode or reviewing mock tests, click the Bookmark icon to save challenging questions and legal principles here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
