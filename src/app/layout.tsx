import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { getCurrentUserProfile } from "@/actions/auth";

export const metadata: Metadata = {
  title: "CLAT Compass | Personal Practice & CBT Mock Exam Portal",
  description: "Private personal CLAT examination platform with split-screen CBT simulator, passage analysis, and instant practice mode.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUserProfile();

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-100 flex flex-col text-slate-900 antialiased font-sans">
        <Navbar user={user} />
        <div className="flex-1">
          {children}
        </div>
      </body>
    </html>
  );
}
