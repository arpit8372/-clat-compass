"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, BookOpen, Layers, Award, BookmarkCheck, RotateCcw, ShieldCheck, LogOut, Menu, X, User } from "lucide-react";
import { UserProfile } from "../lib/types/clat";
import { logoutAction } from "../actions/auth";

interface NavbarProps {
  user?: UserProfile | null;
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide regular navbar during active CBT mock attempts to maintain distraction-free exam conditions
  if (pathname.startsWith("/attempts/")) {
    return null;
  }

  const navLinks = [
    { label: "Dashboard", href: "/dashboard", icon: Layers },
    { label: "Practice", href: "/practice", icon: BookOpen },
    { label: "PYQs", href: "/pyq", icon: Award },
    { label: "Mocks", href: "/mocks", icon: Compass },
    { label: "Bookmarks", href: "/bookmarks", icon: BookmarkCheck },
    { label: "Revision", href: "/revision", icon: RotateCcw },
  ];

  const isAdmin = user?.role === "admin";

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-compass-900 flex items-center justify-center text-amber-400 shadow-sm group-hover:scale-105 transition-transform">
                <Compass className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-slate-900 tracking-tight leading-none group-hover:text-compass-800 transition-colors">
                  CLAT Compass
                </span>
                <span className="text-[11px] font-medium text-slate-700 tracking-wide mt-0.5">
                  Private Law Prep
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-compass-50 text-compass-800 font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User actions / Admin link */}
          <div className="hidden md:flex items-center gap-3">
            {isAdmin && (
              <Link
                href="/admin"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                  pathname.startsWith("/admin")
                    ? "bg-amber-100 text-amber-900 border border-amber-300"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                Admin Studio
              </Link>
            )}

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 text-sm">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">
                <User className="w-3.5 h-3.5 text-slate-700" />
                <span className="text-xs font-medium text-slate-700 max-w-[120px] truncate">
                  {user?.full_name || user?.email || "Student"}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase bg-compass-100 text-compass-800">
                  {user?.role || "student"}
                </span>
              </div>

              <form action={logoutAction}>
                <button
                  type="submit"
                  title="Sign out"
                  className="p-2 rounded-lg text-slate-700 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-base font-medium ${
                  isActive
                    ? "bg-compass-50 text-compass-800 font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}

          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-base font-semibold text-amber-900 bg-amber-50"
            >
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              Admin Studio
            </Link>
          )}

          <div className="pt-3 mt-2 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-700" />
              <span className="text-xs font-medium text-slate-700">{user?.email || "Student"}</span>
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
