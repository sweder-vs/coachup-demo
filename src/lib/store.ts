"use client";
import { useSyncExternalStore } from "react";
import type { Lang } from "./types";
import { LECTURES, courseLectures } from "./data";

export type QuizState = { answers: Record<number, string>; checked: boolean };
export type FlashState = { results: Record<number, boolean>; done: boolean };
export type ExamState = { answers: Record<number, string>; finished: boolean };
export type State = {
  lang: Lang;
  flash: Record<string, FlashState>;
  quiz: Record<string, QuizState>;
  summary: Record<string, boolean>;
  exam: Record<string, ExamState>;
  assess: Record<string, number>;
};

const KEY = "coachup-demo-v1";

// Sample progress so the dashboard is not empty on first visit ("Reset demo" restores this).
function seedState(): State {
  const s: State = { lang: "en", flash: {}, quiz: {}, summary: {}, exam: {}, assess: {} };
  const sample: Record<string, number> = { "ondrecht-1": 8, "ondrecht-2": 7, "ondrecht-3": 6, "polecon-1": 9 };
  for (const [id, correct] of Object.entries(sample)) {
    const l = LECTURES.find((x) => x.id === id);
    if (!l) continue;
    const answers: Record<number, string> = {};
    l.questions.forEach((q, i) => {
      answers[q.id] = i < correct ? q.correctLetter : (q.options.find((o) => o.letter !== q.correctLetter)?.letter ?? q.correctLetter);
    });
    s.quiz[id] = { answers, checked: true };
    const results: Record<number, boolean> = {};
    l.flashcards.forEach((c, i) => (results[c.id] = i % 5 !== 0));
    s.flash[id] = { results, done: true };
    if (id !== "ondrecht-3") s.summary[id] = true;
  }
  return s;
}

let state: State = seedState();
const listeners = new Set<() => void>();
let loaded = false;

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const t = localStorage.getItem(KEY);
    if (t) state = { ...seedState(), ...JSON.parse(t) };
  } catch { /* storage unavailable: run in memory */ }
}
function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
}
export function update(fn: (s: State) => State) {
  state = fn(state);
  persist();
  listeners.forEach((l) => l());
}
export function resetDemo() {
  state = seedState();
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
  listeners.forEach((l) => l());
}
export function useStore(): State {
  return useSyncExternalStore(
    (cb) => { load(); listeners.add(cb); return () => listeners.delete(cb); },
    () => { load(); return state; },
    () => state,
  );
}

// ---- derived progress ----
export const quizScore = (s: State, lid: string) => {
  const l = LECTURES.find((x) => x.id === lid);
  const q = s.quiz[lid];
  if (!l || !q?.checked || !l.questions.length) return null;
  return Math.round((l.questions.filter((x) => q.answers[x.id] === x.correctLetter).length / l.questions.length) * 100);
};
export const examScore = (s: State, eid: string) => {
  const l = LECTURES.find((x) => x.id === eid);
  const e = s.exam[eid];
  if (!l || !e?.finished) return null;
  return Math.round((l.questions.filter((x) => e.answers[x.id] === x.correctLetter).length / l.questions.length) * 100);
};
export const readiness = (s: State, cid: string) => {
  const ls = courseLectures(cid);
  return ls.length ? Math.round((ls.filter((l) => s.summary[l.id]).length / ls.length) * 100) : 0;
};
