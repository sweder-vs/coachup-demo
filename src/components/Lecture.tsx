"use client";
import { useEffect, useState } from "react";
import type { Lang, Lecture as L, Topic } from "@/lib/types";
import { t } from "@/lib/i18n";
import { getLecture, getCourse } from "@/lib/data";
import { useStore, update, quizScore } from "@/lib/store";
import { mockAssess, type Assessment } from "@/lib/mock";
import { Page, Card, Pill, Btn, BackLink, go, scoreTone, toneText } from "./ui";

const STEPS = ["overview", "topics", "flashcards", "quiz", "summary"] as const;
type Step = (typeof STEPS)[number];

export function Lecture({ id, step, extra, lang }: { id: string; step: string; extra?: string; lang: Lang }) {
  const l = getLecture(id);
  if (!l) return <Page><p>Lecture not found.</p></Page>;
  const course = getCourse(l.course)!;
  const cur = (STEPS.includes(step as Step) ? step : step === "assess" ? "topics" : "overview") as Step;
  return (
    <>
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-2 overflow-x-auto">
          {STEPS.map((s, i) => <StepDot key={s} lecture={l} step={s} index={i} current={cur} lang={lang} />)}
        </div>
      </div>
      <Page>
        <BackLink href={`#/course/${course.id}`}>{course.name}</BackLink>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-6">{l.name}</h1>
        {step === "assess" && extra ? <Assess l={l} topicId={Number(extra)} lang={lang} /> :
          cur === "overview" ? <Overview l={l} lang={lang} /> :
          cur === "topics" ? <Topics l={l} lang={lang} /> :
          cur === "flashcards" ? <Flashcards l={l} lang={lang} /> :
          cur === "quiz" ? <Quiz l={l} lang={lang} /> : <Summary l={l} lang={lang} />}
        {course.discipline === "law" && (cur === "flashcards" || cur === "quiz") && (
          <p className="mt-6 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">📚 {t(lang, "codebook")}</p>
        )}
      </Page>
    </>
  );
}

function StepDot({ lecture, step, index, current, lang }: { lecture: L; step: Step; index: number; current: Step; lang: Lang }) {
  const s = useStore();
  const ci = STEPS.indexOf(current);
  const done = index < ci || (step === "summary" && s.summary[lecture.id]) || (step === "quiz" && quizScore(s, lecture.id) !== null) || (step === "flashcards" && s.flash[lecture.id]?.done);
  const isCur = step === current;
  return (
    <a href={`#/lecture/${lecture.id}/${step}`} className="flex items-center gap-2 shrink-0">
      <span className={`w-3.5 h-3.5 rounded-full border-2 ${isCur ? "border-emerald-500 bg-white shadow-[0_0_8px_rgba(16,185,129,0.5)]" : done ? "bg-emerald-500 border-emerald-500" : "bg-slate-100 border-slate-300"}`} />
      <span className={`text-xs font-semibold ${isCur ? "text-emerald-700" : "text-slate-500"}`}>{t(lang, step)}</span>
      {index < STEPS.length - 1 && <span className="w-6 sm:w-10 h-px bg-slate-200 ml-1" />}
    </a>
  );
}

function Overview({ l, lang }: { l: L; lang: Lang }) {
  const o = l.overview;
  return (
    <div className="space-y-5">
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-slate-800 leading-relaxed">{o.introduction}</div>
      <Card className="p-6">
        <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs grid place-items-center">!</span>{t(lang, "keyTakeaways")}</h2>
        <ol className="space-y-2.5">
          {o.keyTakeaways.map((k, i) => (
            <li key={i} className="flex gap-3 text-sm text-slate-700"><span className="font-bold text-emerald-600 w-5 shrink-0">{i + 1}.</span><span>{k}</span></li>
          ))}
        </ol>
      </Card>
      {o.sections.map((sec) => (
        <Card key={sec.heading} className="p-6">
          <h3 className="font-bold text-slate-900 pb-2 mb-3 border-b border-slate-100">{sec.heading}</h3>
          <p className="text-sm text-slate-700 leading-relaxed">{sec.content}</p>
        </Card>
      ))}
      {o.keyTerms.length > 0 && (
        <div>
          <h2 className="font-bold text-slate-900 mb-3">{t(lang, "keyTerms")}</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {o.keyTerms.map((k) => (
              <div key={k.term} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="font-semibold text-emerald-700 text-sm">{k.term}</p>
                <p className="text-sm text-slate-600 mt-1">{k.definition}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex justify-end"><Btn onClick={() => go(`/lecture/${l.id}/topics`)}>{t(lang, "topics")} &rarr;</Btn></div>
    </div>
  );
}

function Topics({ l, lang }: { l: L; lang: Lang }) {
  const s = useStore();
  return (
    <div>
      {l.flashcards.length > 0 && (
        <button onClick={() => go(`/lecture/${l.id}/flashcards`)} className="w-full mb-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all">{t(lang, "startDrill")} &rarr;</button>
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        {l.topics.map((tp) => {
          const sc = s.assess[`${l.id}:${tp.id}`];
          return (
            <Card key={tp.id} className="p-5 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <Pill>{t(lang, "topic")} {tp.id}</Pill>
                {sc !== undefined && <span className={`text-xs font-bold ${toneText[scoreTone(sc) as "emerald"]}`}>{sc}%</span>}
              </div>
              <h3 className="font-bold text-slate-900">{tp.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{tp.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">{tp.subtopics.map((x) => <span key={x} className="text-xs bg-slate-100 text-slate-600 rounded-full px-2 py-0.5">{x}</span>)}</div>
              {l.topics.length > 1 && (
                <a href={`#/lecture/${l.id}/assess/${tp.id}`} className="mt-4 text-xs font-semibold text-emerald-700 hover:underline">✍️ {t(lang, "assessTitle")} &rarr;</a>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Assess({ l, topicId, lang }: { l: L; topicId: number; lang: Lang }) {
  const tp = l.topics.find((x) => x.id === topicId) as Topic | undefined;
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<Assessment | null>(null);
  useEffect(() => { setText(""); setRes(null); }, [topicId]);
  if (!tp) return <p>Topic not found.</p>;
  const run = () => {
    setBusy(true);
    setTimeout(() => {
      const r = mockAssess(tp, text);
      setRes(r); setBusy(false);
      update((s) => ({ ...s, assess: { ...s.assess, [`${l.id}:${tp.id}`]: r.score } }));
    }, 1400);
  };
  const mark = { solid: ["✓", "border-emerald-500 text-emerald-600"], partial: ["~", "border-amber-500 text-amber-600"], missing: ["✕", "border-red-500 text-red-600"] } as const;
  return (
    <div className="max-w-2xl">
      <BackLink href={`#/lecture/${l.id}/topics`}>{t(lang, "topics")}</BackLink>
      <Pill tone="amber">Prototype</Pill>
      <h2 className="text-xl font-bold text-slate-900 mt-2">{tp.name}</h2>
      <p className="text-sm text-slate-500 mb-4">{t(lang, "assessHint")}</p>
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-sm text-slate-700 mb-3">{lang === "nl" ? `Leg in je eigen woorden uit: ${tp.name}.` : `Explain in your own words: ${tp.name}.`}</div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} placeholder={lang === "nl" ? "Schrijf hier je uitleg…" : "Write your explanation here…"}
        className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:outline-none focus:border-emerald-500" />
      <div className="flex items-center gap-3 mt-3">
        <Btn onClick={run} disabled={busy || text.trim().length < 10}>{busy ? t(lang, "analysing") : t(lang, "assessBtn")}</Btn>
        <button onClick={() => setText(tp.subtopics.join(". ") + ".")} className="text-xs text-slate-500 underline">{lang === "nl" ? "Voorbeeldantwoord invullen" : "Fill example answer"}</button>
      </div>
      {res && (
        <div className="mt-6">
          <p className="font-bold text-slate-900">{t(lang, "understanding")}: <span className={toneText[scoreTone(res.score) as "emerald"]}>{res.score}%</span></p>
          <p className="text-sm text-slate-500 mb-3">{res.encouragement}</p>
          <div className="space-y-2">
            {res.gaps.map((g) => (
              <div key={g.title} className={`border-l-[3px] bg-white rounded-r-xl px-4 py-3 flex gap-3 ${mark[g.status][1].split(" ")[0]}`}>
                <span className={`font-bold ${mark[g.status][1].split(" ")[1]}`}>{mark[g.status][0]}</span>
                <div><p className="text-sm font-semibold text-slate-900">{g.title} <span className="text-[10px] uppercase tracking-wider text-slate-400 ml-1">{t(lang, g.status)}</span></p><p className="text-xs text-slate-500">{g.explanation}</p></div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-4">{t(lang, "assessNote")}</p>
        </div>
      )}
    </div>
  );
}

function Flashcards({ l, lang }: { l: L; lang: Lang }) {
  const s = useStore();
  const st = s.flash[l.id] ?? { results: {}, done: false };
  const [flipped, setFlipped] = useState(false);
  const [review, setReview] = useState(false);
  const cards = l.flashcards;
  if (!cards.length) return <p className="text-slate-500">No flashcards for this lecture.</p>;
  const idx = cards.findIndex((c) => st.results[c.id] === undefined);
  const mark = (knew: boolean) => {
    const c = cards[idx];
    const results = { ...st.results, [c.id]: knew };
    const done = Object.keys(results).length === cards.length;
    update((x) => ({ ...x, flash: { ...x.flash, [l.id]: { results, done } } }));
    setFlipped(false);
  };
  if ((st.done && !review) || idx === -1) {
    const ok = cards.filter((c) => st.results[c.id]).length;
    const pct = Math.round((ok / cards.length) * 100);
    return (
      <div className="text-center max-w-xl mx-auto">
        <p className="text-xs uppercase tracking-widest font-bold text-slate-400">{t(lang, "results")}</p>
        <p className={`text-5xl font-extrabold mt-1 ${toneText[scoreTone(pct) as "emerald"]}`}>{pct}%</p>
        <p className="text-slate-500 text-sm mt-1">{ok} {t(lang, "of")} {cards.length} {t(lang, "correct")}</p>
        <div className="grid grid-cols-6 gap-2 mt-6">
          {cards.map((c) => <div key={c.id} title={c.front} className={`aspect-square rounded-lg ${st.results[c.id] ? "bg-emerald-400" : "bg-red-400"}`} />)}
        </div>
        <div className="flex justify-center gap-3 mt-8">
          <Btn tone="white" onClick={() => { update((x) => ({ ...x, flash: { ...x.flash, [l.id]: { results: {}, done: false } } })); setReview(true); }}>↺ {lang === "nl" ? "Opnieuw" : "Redo"}</Btn>
          <Btn onClick={() => go(`/lecture/${l.id}/quiz`)}>{t(lang, "toQuiz")} &rarr;</Btn>
        </div>
      </div>
    );
  }
  const c = cards[idx];
  const done = Object.keys(st.results).length;
  return (
    <div className="max-w-xl mx-auto text-center">
      <div className="flex items-center justify-between text-xs text-slate-500 mb-2"><span>{t(lang, "card")} {done + 1} {t(lang, "of")} {cards.length}</span><span>{c.topic}</span></div>
      <div className="h-1.5 rounded-full bg-slate-200 mb-5"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${(done / cards.length) * 100}%`, transition: "width .3s" }} /></div>
      <button onClick={() => setFlipped(true)} className={`w-full min-h-[240px] rounded-2xl border p-8 text-left transition-all ${flipped ? "bg-emerald-50 border-emerald-300" : "bg-white border-slate-200 hover:border-emerald-400 shadow-sm"}`}>
        <div className="flex gap-2 mb-3 min-h-[20px]">{c.priority === "intuition" && <Pill tone="blue">intuition</Pill>}{c.priority === "depth" && <Pill tone="slate">depth</Pill>}</div>
        <p className={`${flipped ? "text-emerald-900" : "text-slate-900 font-semibold text-lg"} leading-relaxed`}>{flipped ? c.back : c.front}</p>
        {!flipped && <p className="text-xs text-slate-400 mt-6">{t(lang, "tapReveal")}</p>}
      </button>
      <div className={`grid grid-cols-2 gap-3 mt-5 transition-opacity ${flipped ? "opacity-100" : "opacity-30 pointer-events-none"}`}>
        <button onClick={() => mark(false)} className="py-3 rounded-xl bg-red-50 text-red-600 font-semibold border border-red-200 hover:bg-red-100">✕ {t(lang, "didnt")}</button>
        <button onClick={() => mark(true)} className="py-3 rounded-xl bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 hover:bg-emerald-100">✓ {t(lang, "knew")}</button>
      </div>
    </div>
  );
}

function Quiz({ l, lang }: { l: L; lang: Lang }) {
  const s = useStore();
  const st = s.quiz[l.id] ?? { answers: {}, checked: false };
  const qs = l.questions;
  const setAns = (qid: number, letter: string) => update((x) => ({ ...x, quiz: { ...x.quiz, [l.id]: { ...st, answers: { ...st.answers, [qid]: letter } } } }));
  const check = () => update((x) => ({ ...x, quiz: { ...x.quiz, [l.id]: { ...st, checked: true } } }));
  const retry = () => update((x) => ({ ...x, quiz: { ...x.quiz, [l.id]: { answers: {}, checked: false } } }));
  const answered = qs.filter((q) => st.answers[q.id]).length;
  const correct = qs.filter((q) => st.answers[q.id] === q.correctLetter).length;
  const pct = qs.length ? Math.round((correct / qs.length) * 100) : 0;
  return (
    <div className="space-y-5">
      {st.checked && (
        <Card className="p-6 text-center">
          <p className="text-xs uppercase tracking-widest font-bold text-slate-400">{t(lang, "scored")}</p>
          <p className={`text-5xl font-extrabold ${toneText[scoreTone(pct) as "emerald"]}`}>{pct}%</p>
          <p className="text-sm text-slate-500">{correct} {t(lang, "of")} {qs.length} {t(lang, "correct")}</p>
          <div className="flex justify-center gap-3 mt-4">
            <Btn tone="white" onClick={retry}>↺ {lang === "nl" ? "Opnieuw" : "Retry"}</Btn>
            <Btn onClick={() => { update((x) => ({ ...x, summary: { ...x.summary, [l.id]: true } })); go(`/lecture/${l.id}/summary`); }}>{t(lang, "getSummary")} &rarr;</Btn>
          </div>
        </Card>
      )}
      {qs.map((q, n) => (
        <Card key={q.id} className="p-5">
          <div className="flex items-center gap-2 mb-2"><Pill>{t(lang, "question")} {n + 1}</Pill><span className="text-xs text-slate-400 truncate">{q.topic}</span></div>
          <p className="font-semibold text-slate-900 mb-3">{q.question}</p>
          <div className="space-y-2">
            {q.options.map((o) => {
              const sel = st.answers[q.id] === o.letter;
              const right = st.checked && o.letter === q.correctLetter;
              const wrong = st.checked && sel && !right;
              return (
                <button key={o.letter} disabled={st.checked} onClick={() => setAns(q.id, o.letter)}
                  className={`w-full flex gap-3 items-start text-left text-sm px-3 py-2.5 rounded-xl border transition-all ${right ? "border-emerald-500 bg-emerald-50" : wrong ? "border-red-400 bg-red-50" : sel ? "border-slate-700 bg-slate-50" : "border-slate-200 hover:border-slate-400"}`}>
                  <span className={`w-6 h-6 rounded-full grid place-items-center text-xs font-bold shrink-0 ${right ? "bg-emerald-500 text-white" : wrong ? "bg-red-500 text-white" : sel ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-600"}`}>{o.letter}</span>
                  <span className="text-slate-800">{o.text}</span>
                </button>
              );
            })}
          </div>
          {st.checked && <p className={`mt-3 text-xs border-l-[3px] px-3 py-2 rounded-r-lg ${st.answers[q.id] === q.correctLetter ? "border-emerald-500 bg-emerald-50 text-emerald-900" : "border-red-400 bg-red-50 text-red-900"}`}>{q.explanation}</p>}
        </Card>
      ))}
      {!st.checked && <Btn onClick={check} disabled={answered < qs.length}>{t(lang, "check")} ({answered}/{qs.length})</Btn>}
    </div>
  );
}

function Summary({ l, lang }: { l: L; lang: Lang }) {
  const s = useStore();
  const sm = l.summary;
  const earned = !!s.summary[l.id];
  if (!sm) return null;
  if (!earned) {
    return (
      <Card className="p-8 text-center">
        <p className="text-3xl">🔒</p>
        <p className="font-bold text-slate-900 mt-2">{lang === "nl" ? "Maak eerst de quiz om je samenvatting te verdienen" : "Finish the quiz to earn your summary sheet"}</p>
        <div className="mt-4"><Btn onClick={() => go(`/lecture/${l.id}/quiz`)}>{t(lang, "quiz")} &rarr;</Btn></div>
      </Card>
    );
  }
  const qs = quizScore(s, l.id);
  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-5 text-center"><p className="text-2xl">⭐</p><p className="font-bold text-emerald-800">{t(lang, "earned")}</p></div>
      <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b-[3px] border-emerald-500 px-6 py-5 text-white flex items-center justify-between gap-3">
          <h2 className="font-bold">{sm.title}</h2>
          {qs !== null && <span className="text-xs bg-white/10 rounded-full px-3 py-1">Quiz {qs}%</span>}
        </div>
        <div className="p-6 space-y-6">
          {sm.sections.map((sec) => (
            <section key={sec.heading}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-600 pb-1.5 mb-3 border-b border-slate-100">{sec.heading}</h3>
              {sec.type === "table" ? (
                <div className="overflow-x-auto"><table className="w-full text-sm text-left">
                  <thead><tr>{sec.headers?.map((h) => <th key={h} className="py-1.5 pr-4 text-[11px] uppercase tracking-wider text-emerald-700 border-b border-emerald-200">{h}</th>)}</tr></thead>
                  <tbody>{sec.rows?.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className="py-2 pr-4 align-top text-slate-700 border-b border-slate-100">{c}</td>)}</tr>)}</tbody>
                </table></div>
              ) : (
                <ul className="space-y-1.5">{sec.items?.map((x) => <li key={x} className={`flex gap-2.5 text-sm text-slate-700 ${sec.type === "equations" ? "font-mono" : ""}`}><span className="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" /><span>{x}</span></li>)}</ul>
              )}
            </section>
          ))}
          {sm.recallPrompts && sm.recallPrompts.length > 0 && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-600 pb-1.5 mb-3 border-b border-slate-100">{t(lang, "recall")}</h3>
              <ul className="space-y-1.5">{sm.recallPrompts.map((x) => <li key={x} className="text-sm text-slate-700">❓ {x}</li>)}</ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
