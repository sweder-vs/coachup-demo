"use client";
import { useEffect, useRef, useState } from "react";
import type { Lang } from "@/lib/types";
import { Page, Card, Btn, BackLink, go } from "./ui";

const STEPS = {
  en: ["Extracting text from 3 files…", "Analysing content and building the topic map…", "Generating 18 flashcards…", "Writing a 12-question quiz…", "Composing the summary sheet…", "Saving to your course…"],
  nl: ["Tekst uit 3 bestanden halen…", "Inhoud analyseren en onderwerpenkaart maken…", "18 flashcards genereren…", "Quiz van 12 vragen schrijven…", "Samenvatting opstellen…", "Opslaan in je vak…"],
};

export function Upload({ lang }: { lang: Lang }) {
  const nl = lang === "nl";
  const [files, setFiles] = useState<string[]>([]);
  const [over, setOver] = useState(false);
  const [step, setStep] = useState(-1);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);
  const run = () => {
    setStep(0);
    let n = 0;
    timer.current = setInterval(() => {
      n++;
      setStep(n);
      if (n >= STEPS.en.length) { if (timer.current) clearInterval(timer.current); }
    }, 900);
  };
  const steps = STEPS[lang];
  const done = step >= steps.length;
  return (
    <Page>
      <BackLink href="#/dashboard">Dashboard</BackLink>
      <h1 className="text-2xl font-extrabold text-slate-900 mb-1">{nl ? "Nieuw vak toevoegen" : "Add a new course"}</h1>
      <p className="text-sm text-slate-500 mb-6">{nl ? "Simulatie: dit toont de stappen van de echte pipeline. Er wordt niets geüpload; bestanden blijven in je browser." : "Simulation: this shows the steps of the real pipeline. Nothing is uploaded; files stay in your browser."}</p>
      {step < 0 ? (
        <>
          <div onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)}
            onDrop={(e) => { e.preventDefault(); setOver(false); setFiles(Array.from(e.dataTransfer.files).map((f) => f.name)); }}
            className={`rounded-2xl border-2 border-dashed p-10 text-center transition-all ${over ? "border-emerald-500 bg-emerald-50" : "border-slate-300 bg-white"}`}>
            <p className="text-3xl">📄</p>
            <p className="font-semibold text-slate-800 mt-2">{nl ? "Sleep pdf, pptx of docx hierheen" : "Drop PDF, PPTX or DOCX files here"}</p>
            {files.length > 0 ? <ul className="text-sm text-slate-500 mt-3">{files.map((f) => <li key={f}>{f}</li>)}</ul> : <p className="text-xs text-slate-400 mt-1">{nl ? "of kies voorbeeldbestanden met de knop hieronder" : "or pick sample files with the button below"}</p>}
          </div>
          <div className="mt-5 flex gap-3"><Btn onClick={run}>{files.length ? (nl ? "Studiemateriaal maken" : "Build study materials") : (nl ? "Voorbeeldbestanden gebruiken" : "Use sample files")}</Btn></div>
        </>
      ) : (
        <Card className="p-6">
          <ul className="space-y-3">
            {steps.map((s, i) => (
              <li key={s} className={`flex items-center gap-3 text-sm transition-opacity ${i > step ? "opacity-30" : ""}`}>
                <span className={`w-5 h-5 rounded-full grid place-items-center text-[11px] ${i < step ? "bg-emerald-500 text-white" : i === step ? "border-2 border-emerald-500 animate-pulse" : "bg-slate-200"}`}>{i < step ? "✓" : ""}</span>
                <span className="text-slate-700">{s}</span>
              </li>
            ))}
          </ul>
          {done && (
            <div className="mt-6 pt-5 border-t border-slate-100">
              <p className="font-semibold text-slate-900">🎉 {nl ? "Klaar! Je studiemateriaal staat klaar." : "Done! Your study materials are ready."}</p>
              <p className="text-xs text-slate-400 mb-3">{nl ? "In de demo openen we een voorbeeldvak dat al is gegenereerd." : "In this demo we open a sample course that was already generated."}</p>
              <Btn onClick={() => go("/course/polecon")}>{nl ? "Open vak" : "Open course"} &rarr;</Btn>
            </div>
          )}
        </Card>
      )}
    </Page>
  );
}
