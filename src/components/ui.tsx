"use client";
import { useEffect, useState, type ReactNode } from "react";
import type { Lang } from "@/lib/types";
import { t } from "@/lib/i18n";
import { resetDemo, update } from "@/lib/store";

export function useHash() {
  const [h, setH] = useState("/");
  useEffect(() => {
    const f = () => setH(location.hash.replace(/^#/, "") || "/");
    f();
    addEventListener("hashchange", f);
    return () => removeEventListener("hashchange", f);
  }, []);
  return h;
}
export const go = (p: string) => { location.hash = p; window.scrollTo(0, 0); };

export function Wordmark() {
  return (
    <a href="#/" className="text-sm font-bold tracking-widest text-white uppercase">
      Coach<span className="text-emerald-400">Up</span>
    </a>
  );
}

export function Nav({ lang }: { lang: Lang }) {
  return (
    <header className="sticky top-0 z-20">
      <nav className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-4 sm:gap-6">
            <Wordmark />
            <a href="#/dashboard" className="text-sm text-slate-300 hover:text-white">{t(lang, "dashboard")}</a>
            <a href="#/how" className="text-sm text-slate-300 hover:text-white">{t(lang, "how")}</a>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex rounded-lg overflow-hidden border border-slate-700 text-xs font-semibold">
              {(["en", "nl"] as Lang[]).map((l) => (
                <button key={l} onClick={() => update((s) => ({ ...s, lang: l }))}
                  className={`px-2.5 py-1 uppercase ${lang === l ? "bg-emerald-500 text-white" : "text-slate-300 hover:text-white"}`}>{l}</button>
              ))}
            </div>
          </div>
        </div>
      </nav>
      <div className="bg-amber-50 border-b border-amber-200 text-amber-900 text-xs sm:text-[13px]">
        <p className="max-w-4xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center gap-x-3">
          <span className="font-bold uppercase tracking-wider text-[11px] bg-amber-200 rounded px-1.5 py-0.5">{t(lang, "demo")}</span>
          <span className="flex-1 min-w-[220px]">{t(lang, "banner")}</span>
          <button onClick={() => { resetDemo(); go("/dashboard"); }} className="underline underline-offset-2 hover:text-amber-700">{t(lang, "reset")}</button>
        </p>
      </div>
    </header>
  );
}

export function Page({ children, wide }: { children: ReactNode; wide?: boolean }) {
  return <main className={`${wide ? "max-w-5xl" : "max-w-4xl"} mx-auto px-4 sm:px-6 py-8 sm:py-10`}>{children}</main>;
}
export const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`bg-white border border-slate-200 rounded-2xl shadow-sm ${className}`}>{children}</div>
);
export const Pill = ({ children, tone = "emerald" }: { children: ReactNode; tone?: "emerald" | "slate" | "blue" | "amber" | "purple" }) => {
  const c = { emerald: "text-emerald-700 bg-emerald-50", slate: "text-slate-600 bg-slate-100", blue: "text-blue-700 bg-blue-50", amber: "text-amber-700 bg-amber-50", purple: "text-purple-700 bg-purple-50" }[tone];
  return <span className={`text-[10px] font-bold tracking-widest uppercase rounded-full px-2.5 py-0.5 ${c}`}>{children}</span>;
};
export const scoreTone = (n: number, hi = 70, mid = 40) => (n >= hi ? "emerald" : n >= mid ? "amber" : "red");
export const toneText = { emerald: "text-emerald-600", amber: "text-amber-600", red: "text-red-600" } as const;
export const toneBg = { emerald: "bg-emerald-500", amber: "bg-amber-500", red: "bg-red-500" } as const;

export function Ring({ pct, size = 64 }: { pct: number; size?: number }) {
  const r = 28, c = 2 * Math.PI * r;
  const tone = scoreTone(pct, 70, 30);
  const col = { emerald: "#10b981", amber: "#f59e0b", red: "#ef4444" }[tone];
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 64 64" width={size} height={size} className="-rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#e2e8f0" strokeWidth="6" />
        <circle cx="32" cy="32" r={r} fill="none" stroke={col} strokeWidth="6" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} style={{ transition: "stroke-dashoffset .6s" }} />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-sm font-bold text-slate-800">{pct}%</span>
    </div>
  );
}

export function Bar({ pct, tone }: { pct: number; tone?: "emerald" | "amber" | "red" | "purple" }) {
  const col = tone === "purple" ? "bg-purple-500" : toneBg[(tone as "emerald" | "amber" | "red") ?? scoreTone(pct)];
  return (
    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
      <div className={`h-full rounded-full ${col}`} style={{ width: `${pct}%`, transition: "width .5s" }} />
    </div>
  );
}
export const BackLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-5">&larr; {children}</a>
);
export const Btn = ({ onClick, children, disabled, tone = "emerald", className = "" }: { onClick?: () => void; children: ReactNode; disabled?: boolean; tone?: "emerald" | "purple" | "white"; className?: string }) => {
  const c = { emerald: "bg-emerald-500 hover:bg-emerald-600 text-white", purple: "bg-purple-600 hover:bg-purple-700 text-white", white: "bg-white border border-slate-200 text-slate-700 hover:border-slate-300" }[tone];
  return <button onClick={onClick} disabled={disabled} className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${c} ${className}`}>{children}</button>;
};
