"use client";
import type { Lang } from "@/lib/types";
import { Page, Card, Pill } from "./ui";

const pipeline = [
  { n: "1", h: "Extract", p: "PDF, PPTX or DOCX in. Slides are converted to PDF and compressed, then Claude Haiku reads each file and returns the raw text." },
  { n: "2", h: "Analyse", p: "One call condenses the material and builds the structure: overview, key terms and a topic map. Names of staff and students are stripped." },
  { n: "3", h: "Generate", p: "Small follow-up calls produce 18 flashcards, a 12-question quiz and a summary sheet from the condensed text." },
  { n: "4", h: "Store", p: "Everything is saved as JSON in Supabase. The web app only reads it." },
];
const stack = ["Next.js 16", "React 19", "Tailwind CSS 4", "TypeScript", "Supabase (Postgres)", "Clerk (auth)", "Claude API (Haiku 4.5)", "Vercel"];

export function How({ lang }: { lang: Lang }) {
  const nl = lang === "nl";
  return (
    <Page>
      <Pill>{nl ? "Achter de schermen" : "Behind the scenes"}</Pill>
      <h1 className="text-3xl font-extrabold text-slate-900 mt-3">{nl ? "Hoe CoachUp werkt" : "How CoachUp works"}</h1>
      <p className="text-slate-500 mt-2 max-w-2xl">{nl ? "Een generatiepijplijn die collegestof omzet in oefenmateriaal, en een web-app die het alleen nog hoeft te tonen." : "A generation pipeline that turns lecture material into study content, and a web app that only has to display it."}</p>

      <h2 className="font-bold text-slate-900 mt-10 mb-4">{nl ? "De pijplijn" : "The pipeline"}</h2>
      <div className="grid sm:grid-cols-4 gap-3">
        {pipeline.map((s, i) => (
          <div key={s.n} className="relative">
            <Card className="p-4 h-full">
              <span className="w-7 h-7 rounded-full bg-emerald-500 text-white text-sm font-bold grid place-items-center">{s.n}</span>
              <h3 className="font-bold text-slate-900 mt-3">{s.h}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{s.p}</p>
            </Card>
            {i < pipeline.length - 1 && <span className="hidden sm:block absolute -right-2.5 top-1/2 -translate-y-1/2 text-slate-300 z-10">›</span>}
          </div>
        ))}
      </div>
      <Card className="p-5 mt-4 bg-emerald-50 border-emerald-100">
        <p className="text-sm text-emerald-900"><strong>{nl ? "Ontwerpkeuze:" : "Design choice:"}</strong> {nl ? "alle AI-inhoud wordt vooraf gegenereerd. De web-app is een pure lezer zonder AI-aanroepen, dus de AI-kosten per gebruiker zijn nul en de app is snel." : "all AI content is pre-generated. The web app is a pure reader with no AI calls, so there is no per-user AI cost and pages load instantly."}</p>
      </Card>

      <h2 className="font-bold text-slate-900 mt-10 mb-3">{nl ? "Wat ik heb gebouwd" : "What I built"}</h2>
      <ul className="text-sm text-slate-700 space-y-2 list-disc pl-5">
        <li>{nl ? "Uploadpijplijn (CLI) met retries bij overbelaste API en robuuste JSON-verwerking." : "Upload pipeline (CLI) with retries for overloaded API calls and tolerant JSON parsing."}</li>
        <li>{nl ? "Dashboard, vakpagina, college-flow en oefententamens met per-onderwerp analyse." : "Dashboard, course page, lecture flow and practice exams with a per-topic breakdown."}</li>
        <li>{nl ? "Vakspecifieke flows (economie, recht, geneeskunde, …) en volledige NL/EN-ondersteuning." : "Subject-specific flows (economics, law, medicine, …) and full NL/EN support."}</li>
        <li>{nl ? "Datamodel in Postgres: vakken, colleges, voortgang." : "Postgres data model: courses, lectures, progress."}</li>
      </ul>
      <div className="flex flex-wrap gap-2 mt-4">{stack.map((s) => <Pill key={s} tone="slate">{s}</Pill>)}</div>

      <h2 className="font-bold text-slate-900 mt-10 mb-3">{nl ? "Verhaal en privacy" : "Background & privacy"}</h2>
      <Card className="p-5 space-y-3 text-sm text-slate-700 leading-relaxed">
        <p>{nl ? "CoachUp was een persoonlijk project: ik bouwde het om zelf voor mijn tentamens te studeren en liet het alleen aan een paar mensen in mijn omgeving zien. Het is nooit als publiek product gelanceerd." : "CoachUp was a personal project: I built it to study for my own exams and only showed it to a few people I know. It was never launched as a public product."}</p>
        <p>{nl ? "Een paar weken nadat ik het had gebouwd, lanceerde Studeersnel zijn eigen AI-studiefunctie. Daarmee was het idee al gedekt, en dit project dient nu vooral om te laten zien hoe ik het heb gebouwd." : "A few weeks after I built it, Studeersnel launched its own AI study feature. That covered the same idea, so this project now mainly shows how I built it."}</p>
        <p>{nl ? "Het uploaden van collegemateriaal roept vragen op over privacy en auteursrecht. Daarom bevat deze publieke demo geen uploads, accounts, tracking of database: alleen gegenereerde samenvattingen van twee voorbeeldvakken, zonder namen." : "Uploading course material raises privacy and copyright questions. That is why this public demo has no uploads, accounts, tracking or database: only generated study summaries of two sample courses, with names removed."}</p>
        <p className="text-slate-500">{nl ? "Ik onderzocht ook een verdienmodel (studeren gratis, oefententamens betaald). Dat bleef een ontwerp op papier." : "I also explored a business model (studying free, practice exams paid). That stayed a design on paper."}</p>
      </Card>
      <p className="text-sm text-slate-500 mt-6">
        {nl ? "Broncode van deze demo: " : "Source of this demo: "}<a className="text-emerald-700 underline" href="https://github.com/sweder-vs/coachup-demo">github.com/sweder-vs/coachup-demo</a>
      </p>
    </Page>
  );
}
