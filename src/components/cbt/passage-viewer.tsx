"use client";

import React, { useState } from "react";
import { Passage } from "../../lib/types/clat";
import { BookOpen, ZoomIn, ZoomOut, FileText } from "lucide-react";

interface PassageViewerProps {
  passage?: Passage | null;
}

export function PassageViewer({ passage }: PassageViewerProps) {
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg">("md");

  if (!passage) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-700 bg-slate-50 border-r border-slate-200">
        <FileText className="w-12 h-12 text-slate-700 mb-3" />
        <h3 className="font-semibold text-slate-700">Standalone Question</h3>
        <p className="text-xs text-slate-700 mt-1 max-w-xs">
          This question does not reference a passage. Read the problem statement on the right to solve.
        </p>
      </div>
    );
  }

  const fontSizeClass = {
    sm: "text-sm leading-relaxed",
    md: "text-base leading-relaxed",
    lg: "text-lg leading-loose",
  }[fontSize];

  return (
    <div className="h-full flex flex-col bg-white border-r border-slate-200 overflow-hidden">
      {/* Passage Header / Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100 border-b border-slate-200 text-xs text-slate-700">
        <div className="flex items-center gap-2 truncate">
          <BookOpen className="w-4 h-4 text-compass-700 flex-shrink-0" />
          <span className="font-semibold text-slate-800 truncate">{passage.title}</span>
        </div>

        {/* Font size toggles */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded px-1.5 py-0.5 shadow-2xs">
          <button
            onClick={() => setFontSize("sm")}
            title="Smaller font"
            className={`px-1 text-xs font-semibold rounded ${
              fontSize === "sm" ? "bg-compass-100 text-compass-800" : "text-slate-700 hover:text-slate-800"
            }`}
          >
            A-
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={() => setFontSize("md")}
            title="Normal font"
            className={`px-1 text-xs font-semibold rounded ${
              fontSize === "md" ? "bg-compass-100 text-compass-800" : "text-slate-700 hover:text-slate-800"
            }`}
          >
            A
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={() => setFontSize("lg")}
            title="Larger font"
            className={`px-1 text-xs font-semibold rounded ${
              fontSize === "lg" ? "bg-compass-100 text-compass-800" : "text-slate-700 hover:text-slate-800"
            }`}
          >
            A+
          </button>
        </div>
      </div>

      {/* Passage Content Body */}
      <div className="flex-1 overflow-y-auto passage-scroll p-6">
        {passage.source && (
          <div className="mb-4 text-xs font-medium text-slate-700 italic border-l-2 border-compass-400 pl-2.5 py-0.5 bg-slate-50">
            Source: {passage.source}
          </div>
        )}

        {passage.image_url && (
          <div className="mb-4 rounded-lg overflow-hidden border border-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={passage.image_url} alt={passage.title} className="w-full object-contain max-h-72" />
          </div>
        )}

        <div className={`space-y-4 text-slate-800 font-serif ${fontSizeClass}`}>
          {passage.content.split("\n\n").map((paragraph, index) => (
            <p key={index} className="text-justify leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
