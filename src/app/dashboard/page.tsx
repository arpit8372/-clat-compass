import React from "react";
import Link from "next/link";
import { getCurrentUserProfile } from "@/actions/auth";
import { MOCK_ATTEMPTS, MOCK_TESTS, MOCK_SUBJECTS } from "@/lib/data/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Compass,
  BookOpen,
  Award,
  RotateCcw,
  TrendingUp,
  Target,
  Clock,
  ArrowRight,
  Sparkles,
  BarChart2,
  Calendar,
} from "lucide-react";

export default async function DashboardPage() {
  const user = await getCurrentUserProfile();

  const attempts = MOCK_ATTEMPTS;
  const recentTests = MOCK_TESTS;

  const totalAttempts = attempts.length;
  const avgScore = totalAttempts > 0 ? (attempts.reduce((a, b) => a + b.score, 0) / totalAttempts).toFixed(1) : 0;
  const avgAccuracy = totalAttempts > 0 ? Math.round(attempts.reduce((a, b) => a + b.accuracy, 0) / totalAttempts) : 0;
  const totalMinutes = Math.round(attempts.reduce((a, b) => a + b.time_spent_seconds, 0) / 60);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-compass-950 to-slate-900 text-white p-8 md:p-10 shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            CLAT Preparation Track
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
            Welcome back, {user?.full_name?.split(" ")[0] || "Aspirant"}!
          </h1>
          <p className="mt-2 text-sm md:text-base text-slate-300 leading-relaxed font-sans">
            Ready to sharpen your legal reasoning and comprehension speed? Choose between full simulated CBT mock tests or focused topic practice.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/mocks">
              <Button variant="gold" size="md" className="font-bold gap-2">
                <Compass className="w-4 h-4" />
                Launch Mock Exam
              </Button>
            </Link>
            <Link href="/practice">
              <Button variant="outline" size="md" className="bg-white/10 hover:bg-white/20 text-white border-white/20 gap-2">
                <BookOpen className="w-4 h-4" />
                Start Instant Practice
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative Compass watermark */}
        <div className="absolute -right-8 -bottom-8 text-white/5 pointer-events-none">
          <Compass className="w-80 h-80 stroke-[0.8]" />
        </div>
      </div>

      {/* 4 Core Quick Access Modes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Practice Mode */}
        <Link
          href="/practice"
          className="group p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-compass-400 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-compass-50 text-compass-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 group-hover:text-compass-800 transition-colors">
            Practice Mode
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Immediate feedback, step-by-step legal solutions, and zero time pressure.
          </p>
          <div className="mt-4 flex items-center text-xs font-bold text-compass-700">
            Start Solving <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Mock Tests */}
        <Link
          href="/mocks"
          className="group p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-compass-400 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 group-hover:text-compass-800 transition-colors">
            Mock Tests (CBT)
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Split-screen Testbook-style exam interface with countdown timer and palette.
          </p>
          <div className="mt-4 flex items-center text-xs font-bold text-amber-700">
            Explore Mocks <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* PYQs */}
        <Link
          href="/pyq"
          className="group p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-compass-400 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 group-hover:text-compass-800 transition-colors">
            Official PYQs
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Official past papers from CLAT 2024, 2023, and previous consortium cycles.
          </p>
          <div className="mt-4 flex items-center text-xs font-bold text-purple-700">
            View Archives <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Revision */}
        <Link
          href="/revision"
          className="group p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-compass-400 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <RotateCcw className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 group-hover:text-compass-800 transition-colors">
            Targeted Revision
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Re-solve previously missed questions and personal bookmarked principles.
          </p>
          <div className="mt-4 flex items-center text-xs font-bold text-emerald-700">
            Review Weak Areas <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <BarChart2 className="w-4 h-4 text-compass-700" />
            <span className="text-xs font-semibold">Tests Completed</span>
          </div>
          <span className="text-2xl font-black text-slate-900">{totalAttempts}</span>
          <p className="text-[11px] text-slate-400 mt-0.5">Mock & PYQ attempts</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold">Average Score</span>
          </div>
          <span className="text-2xl font-black text-slate-900">{avgScore}</span>
          <p className="text-[11px] text-slate-400 mt-0.5">Across completed papers</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Target className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-semibold">Overall Accuracy</span>
          </div>
          <span className="text-2xl font-black text-slate-900">{avgAccuracy}%</span>
          <p className="text-[11px] text-slate-400 mt-0.5">Positive accuracy index</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Clock className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-semibold">Study Investment</span>
          </div>
          <span className="text-2xl font-black text-slate-900">{totalMinutes}m</span>
          <p className="text-[11px] text-slate-400 mt-0.5">Active exam solve time</p>
        </div>
      </div>

      {/* Recent Attempts and Featured Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Attempts Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-base text-slate-900">Recent Test Attempts</h2>
            <Link href="/mocks" className="text-xs font-bold text-compass-700 hover:text-compass-800">
              View All Mocks →
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {attempts.map((att) => (
              <div key={att.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm text-slate-900">
                    {att.test?.title || "CLAT Practice Mock"}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="capitalize">{att.mode}</span>
                    <span>•</span>
                    <span>{new Date(att.started_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="font-bold text-sm text-slate-900 block">{att.score} Marks</span>
                    <span className="text-[11px] text-emerald-600 font-medium">{att.accuracy}% Accuracy</span>
                  </div>

                  <Link href={`/results/${att.id}`}>
                    <Button variant="outline" size="sm" className="text-xs font-bold">
                      Scorecard
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CLAT 5 Sections Directory */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-base text-slate-900">CLAT Subject Areas</h2>
          <div className="space-y-2.5">
            {MOCK_SUBJECTS.map((sub) => (
              <Link
                key={sub.id}
                href={`/practice?subject=${sub.code}`}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors group"
              >
                <div>
                  <span className="text-xs font-bold text-slate-800 block group-hover:text-compass-800">
                    {sub.name}
                  </span>
                  <span className="text-[11px] text-slate-500 line-clamp-1">{sub.description}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-compass-700 group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
