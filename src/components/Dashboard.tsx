"use client";
import { useEffect, useState } from "react";
import type { Lang } from "@/lib/types";
import { t } from "@/lib/i18n";
import { COURSES, courseLectures } from "@/lib/data";
import { useStore, readiness } from "@/lib/store";
import { Page, Card, Ring } from "./ui";

export function ExamTile({ days, lang }: { days: number; lang: Lang }) {
  const c = days <= 7 ? "bg-red-50 text-red-600" : days <= 14 ? "bg-amber-50 text-amber-600" : "bg-purple-50 text-purple-600";
  return (
    <div className={`rounded-xl px-3 py-2 text-center shrink-0 ${c}`}>
      <div className="text-xl font-extrabold leading-none">{days}</div>
      <div className="text-[10px] uppercase tracking-wider font-bold mt-1">{t(lang, "inDays")}</div>
    </div>
  );
}

export function Dashboard({ lang }: { lang: Lang }) {
  const s = useStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <Page>
      <div className="flex items-end justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900">{t(lang, "yourCourses")}</h1>
        <a href="#/upload" className="px-4 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-lg hover:bg-emerald-600">+ {t(lang, "newCourse")}</a>
      </div>
      <div className="grid gap-4">
        {COURSES.map((c) => {
          const n = courseLectures(c.id).length;
          const pct = mounted ? readiness(s, c.id) : 0;
          return (
            <a key={c.id} href={`#/course/${c.id}`} className="block">
              <Card className="p-5 flex items-center gap-4 hover:border-emerald-500 hover:shadow-md transition-all">
                <Ring pct={pct} />
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-slate-900 text-lg truncate">{c.icon} {c.name}</h2>
                  <p className="text-sm text-slate-500">{n} {t(lang, "lectures")} · {c.language === "nl" ? "Nederlands" : "English"}</p>
                  <p className="text-xs text-slate-400 mt-1 hidden sm:block">{c.blurb[lang]}</p>
                </div>
                <ExamTile days={c.examInDays} lang={lang} />
              </Card>
            </a>
          );
        })}
      </div>
    </Page>
  );
}
