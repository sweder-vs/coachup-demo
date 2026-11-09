"use client";

import { useState } from "react";
import data from "./lecture.json";

type Tab = "overview" | "flashcards" | "quiz" | "summary";
const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "flashcards", label: "Flashcards" },
  { id: "quiz", label: "Quiz" },
  { id: "summary", label: "Summary" },
];

export default function Demo() {
  const [tab, setTab] = useState<Tab>("overview");
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-sm font-bold tracking-widest text-white uppercase">
            Coach<span className="text-emerald-400">Up</span>
          </span>
          <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Demo</span>
        </div>
      </nav>
      <div className="bg-amber-50 border-b border-amber-200 text-amber-900 text-sm">
        <p className="max-w-4xl mx-auto px-6 py-3">
          <strong>Demo version.</strong> One sample lecture (Political Economics, Lecture 1) with pre-generated content.
          No account needed. Uploading your own material and the AI self-assessment are disabled in this demo.
        </p>
      </div>
      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-6">{data.name}</h1>
        <div className="flex gap-2 mb-8 flex-wrap">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold border transition-all ${tab === t.id ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-slate-200 text-slate-600 hover:border-emerald-400"}`}>
              {t.label}
            </button>
          ))}
          <button disabled title="Disabled in the demo"
            className="px-4 py-1.5 rounded-lg text-sm font-semibold border border-dashed border-slate-300 text-slate-400 cursor-not-allowed">
            AI self-assessment (disabled)
          </button>
        </div>
        {tab === "overview" && <Overview />}
        {tab === "flashcards" && <Flashcards />}
        {tab === "quiz" && <Quiz />}
        {tab === "summary" && <Summary />}
      </main>
    </div>
  );
}

function Overview() {
  const o = data.overview;
  return (
    <div className="space-y-6">
      <p className="text-slate-700 leading-relaxed">{o.introduction}</p>
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="font-bold text-slate-900 mb-3">Key takeaways</h2>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-700 text-sm">
          {o.keyTakeaways.map((k: string) => <li key={k}>{k}</li>)}
        </ul>
      </div>
      {o.sections.map((s: { heading: string; content: string }) => (
        <div key={s.heading} className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-2">{s.heading}</h3>
          <p className="text-sm text-slate-700 leading-relaxed">{s.content}</p>
        </div>
      ))}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="font-bold text-slate-900 mb-3">Key terms</h2>
        <dl className="space-y-2 text-sm">
          {o.keyTerms.map((k: { term: string; definition: string }) => (
            <div key={k.term}><dt className="font-semibold text-slate-900 inline">{k.term}: </dt><dd className="inline text-slate-600">{k.definition}</dd></div>
          ))}
        </dl>
      </div>
    </div>
  );
}

function Flashcards() {
  const cards = data.flashcards.cards;
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const go = (d: number) => { setI((i + d + cards.length) % cards.length); setFlipped(false); };
  return (
    <div className="max-w-xl mx-auto text-center">
      <p className="text-xs text-slate-500 mb-3">Card {i + 1} of {cards.length} · {cards[i].topic}</p>
      <button onClick={() => setFlipped(!flipped)}
        className="w-full min-h-[220px] bg-white border border-slate-200 rounded-2xl p-8 text-lg font-semibold text-slate-900 hover:border-emerald-400 transition-all">
        {flipped ? <span className="text-emerald-700">{cards[i].back}</span> : cards[i].front}
      </button>
      <p className="text-xs text-slate-400 mt-2">Click the card to flip it</p>
      <div className="flex justify-between mt-6">
        <button onClick={() => go(-1)} className="text-sm text-slate-600 hover:text-slate-900">&larr; Previous</button>
        <button onClick={() => go(1)} className="text-sm text-slate-600 hover:text-slate-900">Next &rarr;</button>
      </div>
    </div>
  );
}

function Quiz() {
  const qs = data.quiz.questions;
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [done, setDone] = useState(false);
  const correct = qs.filter((q) => answers[q.id] === q.correctLetter).length;
  return (
    <div className="space-y-6">
      {qs.map((q, n) => (
        <div key={q.id} className="bg-white border border-slate-200 rounded-2xl p-6">
          <p className="font-semibold text-slate-900 mb-3">{n + 1}. {q.question}</p>
          <div className="space-y-2">
            {q.options.map((o) => {
              const sel = answers[q.id] === o.letter;
              const right = done && o.letter === q.correctLetter;
              const wrong = done && sel && !right;
              return (
                <button key={o.letter} disabled={done} onClick={() => setAnswers({ ...answers, [q.id]: o.letter })}
                  className={`block w-full text-left text-sm px-4 py-2.5 rounded-lg border transition-all ${right ? "border-emerald-500 bg-emerald-50" : wrong ? "border-red-400 bg-red-50" : sel ? "border-emerald-400 bg-emerald-50/50" : "border-slate-200 hover:border-emerald-300"}`}>
                  <strong>{o.letter}.</strong> {o.text}
                </button>
              );
            })}
          </div>
          {done && <p className="text-xs text-slate-500 mt-3">{q.explanation}</p>}
        </div>
      ))}
      {!done ? (
        <button disabled={Object.keys(answers).length < qs.length} onClick={() => setDone(true)}
          className="px-6 py-2.5 bg-emerald-500 text-white font-bold rounded-xl disabled:opacity-40">Check answers</button>
      ) : (
        <div className="flex items-center gap-4">
          <p className="font-bold text-slate-900">Score: {correct} / {qs.length}</p>
          <button onClick={() => { setAnswers({}); setDone(false); }} className="text-sm text-slate-600 hover:text-slate-900">Try again</button>
        </div>
      )}
    </div>
  );
}

type Section = { heading: string; type: string; items?: string[]; headers?: string[]; rows?: string[][] };
function Summary() {
  const s = data.summary as { title: string; sections: Section[]; recallPrompts: string[] };
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900">{s.title}</h2>
      {s.sections.map((sec) => (
        <div key={sec.heading} className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-3">{sec.heading}</h3>
          {sec.type === "bullets" && (
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-700">{sec.items?.map((x) => <li key={x}>{x}</li>)}</ul>
          )}
          {sec.type === "table" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead><tr>{sec.headers?.map((h) => <th key={h} className="py-1.5 pr-4 font-semibold text-slate-900 border-b border-slate-200">{h}</th>)}</tr></thead>
                <tbody>{sec.rows?.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className="py-1.5 pr-4 text-slate-700 border-b border-slate-100">{c}</td>)}</tr>)}</tbody>
              </table>
            </div>
          )}
        </div>
      ))}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h3 className="font-bold text-slate-900 mb-3">Recall prompts</h3>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-700">{s.recallPrompts.map((p) => <li key={p}>{p}</li>)}</ul>
      </div>
    </div>
  );
}
