import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "CoachUp (demo) — AI study tool",
  description: "Demo of CoachUp, an AI-powered study tool: one sample lecture with flashcards, quiz and summary.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (<html lang="en"><body className="min-h-screen bg-slate-50 antialiased" style={{ fontFamily: "system-ui, sans-serif" }}>{children}</body></html>);
}
