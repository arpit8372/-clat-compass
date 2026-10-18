import React from "react";
import Link from "next/link";
import { getCurrentUserProfile } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Compass,
  BookOpen,
  Award,
  RotateCcw,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default async function HomePage() {
  const user = await getCurrentUserProfile();

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            Dedicated Law Entrance Examination Platform
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
            CLAT Compass
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-sans">
            A private, full-stack personal CLAT preparation system. Practice with immediate answer explanations, or test under real-time split-screen CBT exam conditions with negative marking.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link href={user ? "/dashboard" : "/login"}>
              <Button variant="gold" size="lg" className="font-bold gap-2 shadow-lg">
                <span>{user ? "Open Dashboard" : "Sign In to Compass"}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/practice">
              <Button variant="outline" size="lg" className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-bold gap-2">
                <BookOpen className="w-4 h-4" />
                Explore Practice Mode
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Engineered for Precision &amp; Speed
          </h2>
          <p className="text-xs text-slate-500 mt-2">
            Built specifically to reflect the reading-dense passage format of the CLAT Consortium.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-compass-50 text-compass-700 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">
              Realistic CBT Exam Engine
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Desktop split-screen view with synchronized passage navigation, font resizer, countdown timer, and NTA/Testbook 5-state question palette.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">
              Instant Feedback Practice
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Instant correctness revelation with comprehensive legal arguments and reasoning explanations for every multiple-choice option.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">
              Personal Bookmarks &amp; Revision
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Save tricky principles with custom study notes, tag repeated mistakes, and launch targeted revision drills at any time.
            </p>
          </div>
        </div>

        {/* Security & Access Box */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-compass-900 text-amber-400 flex items-center justify-center flex-shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Private Single-Student &amp; Administrator Setup</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Protected by PostgreSQL Row Level Security (RLS) and Supabase Auth. Public signup is disabled.
              </p>
            </div>
          </div>

          <Link href="/login">
            <Button variant="outline" size="sm" className="font-bold text-xs whitespace-nowrap">
              Sign In to Portal
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-400">
        CLAT Compass • Dedicated Law Entrance Prep Portal
      </footer>
    </div>
  );
}
