import React from "react";
import Link from "next/link";
import { getCurrentUserProfile } from "@/actions/auth";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import {
  ShieldCheck,
  BookOpen,
  FileText,
  Compass,
  UploadCloud,
  Users,
  LayoutDashboard,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentUserProfile();

  // If supabase is configured, verify admin role
  if (isSupabaseConfigured() && profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const adminNav = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Questions Bank", href: "/admin/questions", icon: HelpCircleIcon },
    { label: "Passages", href: "/admin/passages", icon: FileText },
    { label: "Mock Tests & PYQs", href: "/admin/tests", icon: Compass },
    { label: "Bulk Import", href: "/admin/import", icon: UploadCloud },
    { label: "Provision Students", href: "/admin/users", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      {/* Admin Studio Top Bar */}
      <div className="bg-slate-900 border-b border-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm tracking-tight text-slate-100">
                CLAT Compass <span className="text-amber-400 font-semibold">• Admin Studio</span>
              </span>
            </div>

            <Link
              href="/dashboard"
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              ← Back to Student View
            </Link>
          </div>

          {/* Admin Navigation Pills */}
          <div className="flex items-center gap-1 overflow-x-auto py-2 -mx-1 border-t border-slate-800/80">
            {adminNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors whitespace-nowrap"
                >
                  <Icon className="w-3.5 h-3.5 text-amber-400" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {children}
      </div>
    </div>
  );
}

function HelpCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return <BookOpen {...props} />;
}
