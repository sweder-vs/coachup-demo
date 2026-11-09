import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "CoachUp — AI study tool (demo)",
  description: "Interactive demo of CoachUp, an AI study tool: dashboard, flashcards, quizzes, practice exams and the generation pipeline. No login, no live AI.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (<html lang="en"><body className="min-h-screen bg-slate-50 antialiased" style={{ fontFamily: "system-ui, sans-serif" }}>{children}</body></html>);
}
