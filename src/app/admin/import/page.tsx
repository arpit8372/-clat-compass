"use client";

import React, { useState } from "react";
import { bulkImportAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { UploadCloud, CheckCircle2, ShieldAlert, Copy, Download, Code } from "lucide-react";

const SAMPLE_IMPORT_TEMPLATE = `[
  {
    "subject_id": "sub-legal",
    "question_text": "Sample Legal Principle Question: Is force justified in necessity?",
    "options": [
      { "id": "A", "text": "Yes, if to prevent a greater evil." },
      { "id": "B", "text": "No, never under any circumstance." },
      { "id": "C", "text": "Only with prior police permission." },
      { "id": "D", "text": "Only in contract disputes." }
    ],
    "correct_option": "A",
    "explanation": "Under the doctrine of necessity, harm caused to prevent an imminent greater harm is justified.",
    "difficulty": "medium",
    "is_pyq": true,
    "pyq_year": 2024,
    "tags": ["Legal Reasoning", "Necessity", "Tort"]
  }
]`;

export default function AdminImportPage() {
  const [jsonText, setJsonText] = useState("");
  const [status, setStatus] = useState<{ error?: string; count?: number } | null>(null);
  const [importing, setImporting] = useState(false);

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setImporting(true);

    const res = await bulkImportAction(jsonText);
    if (res.success) {
      setStatus({ count: res.count });
      setJsonText("");
    } else {
      setStatus({ error: res.error });
    }
    setImporting(false);
  };

  const copyTemplate = () => {
    setJsonText(SAMPLE_IMPORT_TEMPLATE);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-compass-700 mb-1">
          <UploadCloud className="w-4 h-4" />
          Bulk Data Uploader
        </div>
        <h1 className="text-xl md:text-2xl font-black text-slate-900">
          Bulk Import CLAT Questions
        </h1>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Upload whole exam papers or question banks instantly using structured JSON data.
        </p>
      </div>

      {status?.count !== undefined && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="font-bold">
            Successfully imported {status.count} question{status.count === 1 ? "" : "s"} into the question bank!
          </span>
        </div>
      )}

      {status?.error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2.5">
          <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{status.error}</span>
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Code className="w-4 h-4 text-slate-500" />
            Paste JSON Payload
          </span>
          <button
            type="button"
            onClick={copyTemplate}
            className="inline-flex items-center gap-1 text-xs font-bold text-compass-700 hover:text-compass-800 bg-compass-50 px-2.5 py-1 rounded-md"
          >
            <Copy className="w-3.5 h-3.5" />
            Load Sample Template
          </button>
        </div>

        <form onSubmit={handleImport} className="space-y-4">
          <textarea
            required
            rows={14}
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder='[ { "subject_id": "sub-legal", "question_text": "...", "options": [...], "correct_option": "A", "explanation": "..." } ]'
            className="w-full text-xs font-mono p-4 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-compass-500 leading-relaxed"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={importing || !jsonText.trim()}
            className="w-full font-bold gap-2"
          >
            {importing ? "Validating & Importing..." : "Validate & Commit Questions"}
          </Button>
        </form>
      </div>
    </div>
  );
}
