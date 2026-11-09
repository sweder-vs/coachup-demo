"use client";
import { useState } from "react";
import type { Lang } from "@/lib/types";
import { t } from "@/lib/i18n";
import { getCourse, courseLectures, courseExam } from "@/lib/data";
import { useStore, quizScore, readiness, examScore } from "@/lib/store";
import { Page, Card, Bar, BackLink, scoreTone, toneText } from "./ui";

export function Course({ id, lang }: { id: string; lang: Lang }) {
  const s = useStore();
  const [copied, setCopied] = useState(false);
  const c = getCourse(id);
  if (!c) return <Page><p>Course not found.</p></Page>;
  const ls = courseLectures(id);
  const exam = courseExam(id);
  const done = ls.filter((l) => s.summary[l.id]).length;
  const es = exam ? examScore(s, exam.id) : null;
  return (
    <Page>
      <BackLink href="#/dashboard">{t(lang, "dashboard")}</BackLink>
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border-b-[3px] border-emerald-500 p-6 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">{c.icon} {c.name}</h1>
          <p className="text-slate-300 text-sm mt-1">{ls.length} {t(lang, "lectures")} · {done} {t(lang, "completed")}</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white/10 rounded-xl px-4 py-2 text-center"><div className="text-2xl font-extrabold text-emerald-400">{readiness(s, id)}%</div><div className="text-[10px] uppercase tracking-wider text-slate-300">{t(lang, "readiness")}</div></div>
          <div className="bg-white/10 rounded-xl px-4 py-2 text-center"><div className="text-2xl font-extrabold text-purple-300">{c.examInDays}</div><div className="text-[10px] uppercase tracking-wider text-slate-300">{t(lang, "days")}</div></div>
        </div>
      </div>

      <h2 className="text-xs font-bold tracking-widest uppercase text-slate-400 mt-8 mb-3">{t(lang, "lectures")}</h2>
      <div className="grid gap-3">
        {ls.map((l) => {
          const qs = quizScore(s, l.id);
          const earned = !!s.summary[l.id];
          const flashDone = s.flash[l.id]?.done;
          const status = earned ? t(lang, "allDone") : qs !== null ? t(lang, "quizDone") : flashDone ? t(lang, "flashDone") : t(lang, "ready");
          const tint = earned ? "bg-emerald-50 text-emerald-600" : qs !== null || flashDone ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-500";
          return (
            <a key={l.id} href={`#/lecture/${l.id}/overview`}>
              <Card className="p-4 flex items-center gap-4 hover:border-emerald-500 hover:shadow-md transition-all">
                <span className={`w-10 h-10 rounded-xl grid place-items-center font-bold shrink-0 ${tint}`}>{l.order}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 truncate">{l.name}</p>
                  <p className="text-xs text-slate-500">{status}</p>
                </div>
                {qs !== null && (
                  <div className="w-24 hidden sm:block">
                    <div className={`text-xs font-bold text-right mb-1 ${toneText[scoreTone(qs) as "emerald"]}`}>{qs}%</div>
                    <Bar pct={qs} />
                  </div>
                )}
              </Card>
            </a>
          );
        })}
      </div>

      {exam && (
        <>
          <h2 className="text-xs font-bold tracking-widest uppercase text-slate-400 mt-8 mb-3">{t(lang, "practiceExams")}</h2>
          <a href={`#/exam/${exam.id}`}>
            <div className="rounded-2xl bg-gradient-to-br from-purple-700 to-purple-600 text-white p-5 flex items-center justify-between gap-4 hover:shadow-lg hover:shadow-purple-500/25 transition-all">
              <div>
                <p className="font-bold">📝 {exam.name}</p>
                <p className="text-purple-200 text-sm">{exam.questions.length} {t(lang, "questions")} · ~{Math.round(exam.questions.length * 1.5)} min</p>
              </div>
              {es !== null ? (
                <span className={`rounded-xl px-4 py-2 font-extrabold ${es >= 70 ? "bg-emerald-400 text-emerald-950" : es >= 55 ? "bg-amber-300 text-amber-950" : "bg-red-300 text-red-950"}`}>{es}%</span>
              ) : (
                <span className="bg-white text-purple-700 rounded-lg px-4 py-2 text-sm font-bold">{t(lang, "start")}</span>
              )}
            </div>
          </a>
        </>
      )}

      <div className="flex justify-end mt-8">
        <button onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1800); }} className="text-sm text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg px-3 py-1.5 bg-white">
          {copied ? t(lang, "copied") : `🔗 ${t(lang, "share")}`}
        </button>
      </div>
    </Page>
  );
}
