"use client";
import type { Lang } from "@/lib/types";
import { Page, Card } from "./ui";

const features = [
  { i: "🧠", h: "Flashcards with scoring", p: "Flip, self-rate, and see a results grid per lecture." },
  { i: "📝", h: "Quizzes & practice exams", p: "Exam mode with a per-topic breakdown and mistake review." },
  { i: "📄", h: "Summary sheets", p: "A one-page cheat sheet you earn by finishing the quiz." },
  { i: "🌍", h: "Subject-aware & bilingual", p: "Economics and law flows, in English and Dutch." },
];

export function Home({ lang }: { lang: Lang }) {
  const nl = lang === "nl";
  return (
    <Page>
      <section className="text-center pt-6 sm:pt-12 pb-10">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
          {nl ? "Upload je colleges." : "Upload your lectures."} <span className="text-emerald-600">{nl ? "Test jezelf." : "Test yourself."}</span>
        </h1>
        <p className="text-slate-500 text-lg mt-5 max-w-xl mx-auto">
          {nl ? "Een AI-studietool die collegestof omzet in flashcards, quizzes, samenvattingen en oefententamens." : "An AI study tool that turns lecture material into flashcards, quizzes, summary sheets and practice exams."}
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <a href="#/dashboard" className="px-7 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/25 transition-all">{nl ? "Open de demo" : "Open the demo"} &rarr;</a>
          <a href="#/how" className="px-7 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:border-slate-300">{nl ? "Hoe het werkt" : "How it works"}</a>
        </div>
        <p className="text-xs text-slate-400 mt-5">{nl ? "Gebouwd door Sweder van Spanje · Next.js, Supabase, Claude API" : "Built by Sweder van Spanje · Next.js, Supabase, Claude API"}</p>
      </section>
      <section className="grid sm:grid-cols-2 gap-4">
        {features.map((f) => (
          <Card key={f.h} className="p-5 flex gap-4">
            <span className="text-2xl">{f.i}</span>
            <div><h3 className="font-bold text-slate-900">{f.h}</h3><p className="text-sm text-slate-500 mt-1">{f.p}</p></div>
          </Card>
        ))}
      </section>
      <p className="text-center text-sm text-slate-500 mt-10 max-w-lg mx-auto">
        {nl ? "Dit was een persoonlijk project om zelf voor tentamens te studeren. " : "This started as a personal project to study for my own exams. "}
        <a href="#/how" className="text-emerald-700 underline underline-offset-2">{nl ? "Lees het verhaal" : "Read the story"}</a>.
      </p>
    </Page>
  );
}
