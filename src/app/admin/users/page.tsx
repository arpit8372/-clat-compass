"use client";

import React, { useState, useEffect } from "react";
import { createStudentUserAction, listUsersAction } from "@/actions/admin";
import { UserProfile } from "@/lib/types/clat";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  UserPlus,
  Mail,
  Lock,
  User,
  ShieldCheck,
  CheckCircle2,
  ShieldAlert,
  KeyRound,
  Info,
} from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [status, setStatus] = useState<{ error?: string; success?: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await listUsersAction();
      setUsers(data);
    }
    load();
  }, []);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setSubmitting(true);

    const res = await createStudentUserAction({
      email,
      password,
      fullName,
    });

    if (res.success && res.user) {
      setStatus({ success: `Account for ${res.user.email} provisioned successfully!` });
      setUsers((prev) => [res.user!, ...prev]);
      setEmail("");
      setPassword("");
      setFullName("");
    } else {
      setStatus({ error: res.error || "Failed to provision user." });
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-700 mb-1">
            <Users className="w-4 h-4" />
            Access Provisioning
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900">
            Student Account Provisioning
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            CLAT Compass uses strict private provisioning. Public signup is disabled; students must be created here.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Provision New Student Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <UserPlus className="w-5 h-5 text-compass-700" />
            <h2 className="font-bold text-base text-slate-900">Provision Student</h2>
          </div>

          {status?.success && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>{status.success}</span>
            </div>
          )}

          {status?.error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{status.error}</span>
            </div>
          )}

          <form onSubmit={handleCreateStudent} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Student Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Temporary Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={submitting}
              className="w-full font-bold shadow-sm"
            >
              {submitting ? "Provisioning..." : "Provision Student"}
            </Button>
          </form>

          {/* Security Note */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 leading-relaxed flex items-start gap-2">
            <Info className="w-4 h-4 text-compass-600 flex-shrink-0 mt-0.5" />
            <span>
              The student will be assigned the <strong>student</strong> role and can immediately log in from the login screen.
            </span>
          </div>
        </div>

        {/* Right Column: Existing Provisioned Accounts & First-Time Setup Instructions */}
        <div className="lg:col-span-2 space-y-6">
          {/* First Admin Instructions Callout */}
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <KeyRound className="w-4 h-4 text-amber-600" />
              <span>Safe First Administrator Provisioning Guide</span>
            </div>
            <p className="leading-relaxed">
              When deploying to Supabase for the first time, create your initial administrator account safely using the Supabase SQL editor:
            </p>
            <pre className="p-3 rounded-lg bg-amber-100/70 font-mono text-[11px] text-amber-900 overflow-x-auto select-all">
{`-- Step 1: Create user in Supabase Auth -> Users (e.g. admin@yourdomain.com)
-- Step 2: Elevate their role to admin:
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'admin@yourdomain.com';`}
            </pre>
          </div>

          {/* Provisioned Accounts Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
            <h2 className="font-bold text-base text-slate-900 mb-4">Provisioned Accounts</h2>
            <div className="divide-y divide-slate-100">
              {users.map((u) => (
                <div key={u.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800 text-sm block">
                      {u.full_name || "CLAT User"}
                    </span>
                    <span className="text-slate-500 font-mono">{u.email}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={u.role === "admin" ? "warning" : "default"}>
                      {u.role}
                    </Badge>
                    <span className="text-slate-400 text-[11px]">
                      {new Date(u.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
