import React from "react";
import Link from "next/link";
import { MOCK_QUESTIONS, MOCK_PASSAGES, MOCK_TESTS, MOCK_ATTEMPTS } from "@/lib/data/mock-data";
import { Button } from "@/components/ui/button";
import {
  FileText,
  BookOpen,
  Compass,
  Users,
  UploadCloud,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function AdminOverviewPage() {
  const stats = [
    { label: "Questions in Bank", value: MOCK_QUESTIONS.length, href: "/admin/questions", icon: BookOpen, color: "text-compass-700 bg-compass-50" },
    { label: "Reading Passages", value: MOCK_PASSAGES.length, href: "/admin/passages", icon: FileText, color: "text-amber-700 bg-amber-50" },
    { label: "Mock & PYQ Tests", value: MOCK_TESTS.length, href: "/admin/tests", icon: Compass, color: "text-purple-700 bg-purple-50" },
    { label: "Student Attempts", value: MOCK_ATTEMPTS.length, href: "/admin/users", icon: Users, color: "text-emerald-700 bg-emerald-50" },
  ];

  return (
    <div className="space-y-8">
      {/* Studio Banner */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
            Administrator Dashboard
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-2">
            CLAT Content Management Studio
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
            Manage question banks, curate dense legal comprehension passages, assemble mock tests, provision student credentials, and import curriculum datasets.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link href="/admin/import">
            <Button variant="outline" size="sm" className="font-bold gap-1.5">
              <UploadCloud className="w-4 h-4 text-slate-600" />
              Bulk JSON Import
            </Button>
          </Link>
          <Link href="/admin/questions">
            <Button variant="primary" size="sm" className="font-bold gap-1.5">
              <PlusCircle className="w-4 h-4" />
              Add Question
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((st) => {
          const Icon = st.icon;
          return (
            <Link
              key={st.label}
              href={st.href}
              className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${st.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900">{st.value}</span>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">{st.label}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Admin Modules Quick Launch */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Module 1: Questions & Passages */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-9 h-9 rounded-xl bg-compass-50 text-compass-700 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">Curate Question Bank</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Add individual questions, link to comprehension passages, set marking weights, and write solutions.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <Link href="/admin/questions">
              <Button variant="outline" size="sm" className="w-full justify-between font-bold text-xs">
                <span>Manage Questions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <Link href="/admin/passages">
              <Button variant="ghost" size="sm" className="w-full justify-between text-xs text-slate-600">
                <span>Passages Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Module 2: Test Assembler */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">Mock &amp; PYQ Assembler</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Bundle questions into full 120-minute mocks or sectional tests with custom negative marking.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/admin/tests">
              <Button variant="outline" size="sm" className="w-full justify-between font-bold text-xs">
                <span>Assemble Tests</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Module 3: Student Provisioning */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">Provision Student Accounts</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Private access control. Provision student logins, inspect their attempt scores, and manage passwords safely.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/admin/users">
              <Button variant="outline" size="sm" className="w-full justify-between font-bold text-xs">
                <span>Manage Students</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
