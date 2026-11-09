"use client";
import { useState } from "react";
import type { Lang } from "@/lib/types";
import { t } from "@/lib/i18n";
import { getLecture, getCourse } from "@/lib/data";
import { useStore, update } from "@/lib/store";
import { Page, Card, Btn, Bar, BackLink, go, scoreTone, toneText } from "./ui";

export function Exam({ id, lang }: { id: string; lang: Lang }) {
  const s = useStore();
  const l = getLecture(id);
  const [started, setStarted] = useState(false);
  const [i, setI] = useState(0);
  if (!l) return <Page><p>Exam not found.</p></Page>;
  const course = getCourse(l.course)!;
  const st = s.exam[id] ?? { answers: {}, finished: false };
  const qs = l.questions;
  const setAns = (qid: number, letter: string) => update((x) => ({ ...x, exam: { ...x.exam, [id]: { ...st, answers: { ...st.answers, [qid]: letter } } } }));
  const finish = () => update((x) => ({ ...x, exam: { ...x.exam, [id]: { ...st, finished: true } } }));
  const restart = () => { update((x) => ({ ...x, exam: { ...x.exam, [id]: { answers: {}, finished: false } } })); setI(0); setStarted(true); };

  if (st.finished) {
    const correct = qs.filter((q) => st.answers[q.id] === q.correctLetter).length;
    const pct = Math.round((correct / qs.length) * 100);
    const head = pct >= 70 ? t(lang, "wellDone") : pct >= 55 ? t(lang, "passedT") : t(lang, "keepStudying");
    const byTopic: Record<string, { c: number; n: number }> = {};
    qs.forEach((q) => { const b = (byTopic[q.topic] ??= { c: 0, n: 0 }); b.n++; if (st.answers[q.id] === q.correctLetter) b.c++; });
    const wrong = qs.filter((q) => st.answers[q.id] !== q.correctLetter);
    return (
      <Page>
        <BackLink href={`#/course/${course.id}`}>{course.name}</BackLink>
        <Card className="p-8 text-center">
          <p className="text-3xl">{pct >= 70 ? "🎉" : pct >= 55 ? "✅" : "📚"}</p>
          <h1 className="text-xl font-extrabold text-slate-900 mt-1">{head}</h1>
          <p className={`text-6xl font-extrabold my-2 ${toneText[scoreTone(pct, 70, 55) as "emerald"]}`}>{pct}%</p>
          <p className="text-sm text-slate-500">{correct} {t(lang, "of")} {qs.length} {t(lang, "correct")} · {t(lang, "passed")}</p>
        </Card>
        <h2 className="font-bold text-slate-900 mt-8 mb-3">{t(lang, "byTopic")}</h2>
        <div className="space-y-3">
          {Object.entries(byTopic).map(([tp, b]) => {
            const p = Math.round((b.c / b.n) * 100);
            return (
              <div key={tp}>
                <div className="flex justify-between text-sm mb-1"><span className="text-slate-700 truncate pr-3">{tp}</span><span className="text-slate-500 shrink-0">{b.c}/{b.n}</span></div>
                <Bar pct={p} tone={scoreTone(p, 70, 50) as "emerald"} />
              </div>
            );
          })}
        </div>
        {wrong.length > 0 && (
          <>
            <h2 className="font-bold text-slate-900 mt-8 mb-3">{t(lang, "wrong")} ({wrong.length})</h2>
            <div className="space-y-3">
              {wrong.map((q) => {
                const mine = q.options.find((o) => o.letter === st.answers[q.id]);
                const right = q.options.find((o) => o.letter === q.correctLetter);
                return (
                  <div key={q.id} className="border-l-[3px] border-red-400 bg-white rounded-r-xl p-4 shadow-sm">
                    <p className="text-sm font-semibold text-slate-900">{q.question}</p>
                    <p className="text-xs text-red-600 mt-2">{t(lang, "yourAnswer")}: {mine ? `${mine.letter}. ${mine.text}` : "—"}</p>
                    <p className="text-xs text-emerald-700 mt-1">{t(lang, "correctAnswer")}: {right?.letter}. {right?.text}</p>
                    <p className="text-xs text-slate-500 mt-2">{q.explanation}</p>
                  </div>
                );
              })}
            </div>
          </>
        )}
        <div className="flex gap-3 mt-8"><Btn tone="purple" onClick={restart}>↺ {t(lang, "retake")}</Btn><Btn tone="white" onClick={() => go(`/course/${course.id}`)}>{t(lang, "courseBack")}</Btn></div>
      </Page>
    );
  }

  if (!started) {
    return (
      <Page>
        <BackLink href={`#/course/${course.id}`}>{course.name}</BackLink>
        <Card className="p-8 text-center max-w-lg mx-auto">
          <p className="text-4xl">📝</p>
          <h1 className="text-xl font-extrabold text-slate-900 mt-2">{l.name}</h1>
          <p className="text-sm text-slate-500 mt-1">{qs.length} {t(lang, "questions")} · ~{Math.round(qs.length * 1.5)} min · {lang === "nl" ? "geen feedback tot het einde" : "no feedback until the end"}</p>
          {course.discipline === "law" && <p className="mt-4 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">📚 {t(lang, "codebook")}</p>}
          <div className="mt-6"><Btn tone="purple" onClick={() => setStarted(true)}>{t(lang, "startExam")}</Btn></div>
        </Card>
      </Page>
    );
  }

  const q = qs[i];
  const last = i === qs.length - 1;
  return (
    <Page>
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between text-xs text-slate-500 mb-2"><span>{t(lang, "question")} {i + 1} {t(lang, "of")} {qs.length}</span><span>{Math.round(((i + 1) / qs.length) * 100)}%</span></div>
        <Bar pct={((i + 1) / qs.length) * 100} tone="purple" />
        <Card className="p-6 mt-5">
          <p className="text-xs text-purple-600 font-bold uppercase tracking-widest mb-2 truncate">{q.topic}</p>
          <p className="font-semibold text-slate-900 mb-4">{q.question}</p>
          <div className="space-y-2">
            {q.options.map((o) => {
              const sel = st.answers[q.id] === o.letter;
              return (
                <button key={o.letter} onClick={() => setAns(q.id, o.letter)} className={`w-full flex gap-3 items-start text-left text-sm px-3 py-2.5 rounded-xl border transition-all ${sel ? "border-purple-500 bg-purple-50" : "border-slate-200 hover:border-purple-300"}`}>
                  <span className={`w-6 h-6 rounded-full grid place-items-center text-xs font-bold shrink-0 ${sel ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-600"}`}>{o.letter}</span>
                  <span className="text-slate-800">{o.text}</span>
                </button>
              );
            })}
          </div>
        </Card>
        <div className="flex justify-end mt-5">
          <Btn tone="purple" disabled={!st.answers[q.id]} onClick={() => (last ? finish() : setI(i + 1))}>{last ? t(lang, "finish") : t(lang, "next")} &rarr;</Btn>
        </div>
      </div>
    </Page>
  );
}
