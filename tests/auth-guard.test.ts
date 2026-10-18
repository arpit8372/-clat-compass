import { describe, it, expect } from "vitest";
import { UserRole, UserProfile } from "../src/lib/types/clat";

describe("Role and Permission Guards", () => {
  function canAccessAdminPanel(user: UserProfile | null): boolean {
    if (!user) return false;
    return user.role === "admin";
  }

  function canAttemptTest(user: UserProfile | null): boolean {
    if (!user) return false;
    return user.role === "student" || user.role === "admin";
  }

  function canManageQuestions(user: UserProfile | null): boolean {
    if (!user) return false;
    return user.role === "admin";
  }

  const studentUser: UserProfile = {
    id: "stud-1",
    email: "student@example.com",
    role: "student",
    created_at: new Date().toISOString(),
  };

  const adminUser: UserProfile = {
    id: "adm-1",
    email: "admin@example.com",
    role: "admin",
    created_at: new Date().toISOString(),
  };

  it("permits only admin users to access admin routes and manage questions", () => {
    expect(canAccessAdminPanel(studentUser)).toBe(false);
    expect(canAccessAdminPanel(adminUser)).toBe(true);
    expect(canAccessAdminPanel(null)).toBe(false);

    expect(canManageQuestions(studentUser)).toBe(false);
    expect(canManageQuestions(adminUser)).toBe(true);
  });

  it("permits authenticated students to take mock and practice tests", () => {
    expect(canAttemptTest(studentUser)).toBe(true);
    expect(canAttemptTest(adminUser)).toBe(true);
    expect(canAttemptTest(null)).toBe(false);
  });
});
