"use client";

import React, { useEffect, useState } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { formatSecondsToTime } from "../../lib/utils/scoring";

interface ExamTimerProps {
  initialSeconds: number;
  onTimeUp?: () => void;
  onTick?: (secondsRemaining: number) => void;
}

export function ExamTimer({ initialSeconds, onTimeUp, onTick }: ExamTimerProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);

  useEffect(() => {
    if (secondsRemaining <= 0) {
      onTimeUp?.();
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        const next = prev - 1;
        onTick?.(next);
        if (next <= 0) {
          clearInterval(timer);
          onTimeUp?.();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsRemaining, onTimeUp, onTick]);

  const isLowTime = secondsRemaining <= 300; // < 5 minutes
  const isCriticalTime = secondsRemaining <= 60; // < 1 minute

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-sm font-bold transition-all ${
        isCriticalTime
          ? "bg-rose-100 text-rose-800 border-rose-300 animate-pulse"
          : isLowTime
          ? "bg-amber-100 text-amber-900 border-amber-300"
          : "bg-slate-100 text-slate-800 border-slate-200"
      }`}
    >
      {isLowTime ? (
        <AlertTriangle className="w-4 h-4 text-amber-600 animate-bounce" />
      ) : (
        <Clock className="w-4 h-4 text-slate-700" />
      )}
      <span>{formatSecondsToTime(secondsRemaining)}</span>
      <span className="text-[10px] font-sans font-medium uppercase text-slate-700">Left</span>
    </div>
  );
}
