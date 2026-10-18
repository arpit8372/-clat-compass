import React from "react";
import Link from "next/link";
import { MOCK_TESTS, MOCK_QUESTIONS } from "@/lib/data/mock-data";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { Test } from "@/lib/types/clat";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Clock, HelpCircle, ArrowRight, BookOpen, Compass } from "lucide-react";

export default async function PyqPage() {
  let pyqTests: Test[] = MOCK_TESTS.filter((t) => t.type === "pyq");

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data } = await supabase
      .from("tests")
      .select("*")
      .eq("type", "pyq")
      .order("pyq_year", { ascending: false });

    if (data && data.length > 0) {
      pyqTests = data as Test[];
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-700 mb-1">
          <Award className="w-4 h-4" />
          Official Archives
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900">
          Previous Year Questions (PYQs)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Real questions administered by the Consortium of National Law Universities. Solve in real exam CBT conditions or step-by-step practice.
        </p>
      </div>

      {/* PYQ Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pyqTests.map((test) => (
          <div
            key={test.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="purple">CLAT {test.pyq_year || "Official"}</Badge>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{test.duration_minutes} Mins</span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg text-slate-900 leading-snug">{test.title}</h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                  {test.description}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>
                  Marking: <strong className="text-slate-800">+{test.positive_mark} / -{test.negative_mark}</strong>
                </span>
                <span>
                  Total: <strong className="text-slate-800">{test.total_marks} Marks</strong>
                </span>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
              <Link href={`/mocks/${test.id}`} className="flex-1">
                <Button variant="primary" size="sm" className="w-full font-bold gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  CBT Mock
                </Button>
              </Link>

              <Link href={`/practice?pyq=true`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full font-bold gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Practice
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
