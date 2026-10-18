import React from "react";
import Link from "next/link";
import { MOCK_TESTS } from "@/lib/data/mock-data";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { Test } from "@/lib/types/clat";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Compass, Clock, Award, CheckCircle2, ArrowRight } from "lucide-react";

export default async function MocksPage({
  searchParams,
}: {
  searchParams?: { type?: string };
}) {
  let tests: Test[] = MOCK_TESTS;

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data } = await supabase
      .from("tests")
      .select("*")
      .order("created_at", { ascending: false });

    if (data && data.length > 0) {
      tests = data as Test[];
    }
  }

  const selectedType = searchParams?.type || "all";
  const filteredTests =
    selectedType === "all" ? tests : tests.filter((t) => t.type === selectedType);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
            <Compass className="w-4 h-4" />
            CBT Exam Simulator
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">
            CLAT Mock Tests
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Standard 120-minute computer-based test interface with split-screen reading and negative marking.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {[
            { label: "All Tests", value: "all" },
            { label: "Full Mocks", value: "full_mock" },
            { label: "Sectional", value: "sectional" },
            { label: "PYQ Papers", value: "pyq" },
          ].map((pill) => (
            <Link
              key={pill.value}
              href={`/mocks?type=${pill.value}`}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                selectedType === pill.value
                  ? "bg-compass-700 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {pill.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mocks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTests.map((test) => (
          <div
            key={test.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Badge
                  variant={
                    test.type === "full_mock"
                      ? "warning"
                      : test.type === "sectional"
                      ? "success"
                      : "purple"
                  }
                >
                  {test.type === "full_mock"
                    ? "Full-Length Mock"
                    : test.type === "sectional"
                    ? "Sectional Master"
                    : `CLAT PYQ ${test.pyq_year || ""}`}
                </Badge>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
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

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Marks</span>
                  <span className="font-bold text-slate-800">{test.total_marks} Marks</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Marking Scheme</span>
                  <span className="font-bold text-slate-800">+{test.positive_mark} / -{test.negative_mark}</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
              <Link href={`/mocks/${test.id}`} className="block">
                <Button variant="primary" size="md" className="w-full font-bold justify-between">
                  <span>Enter Examination</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
