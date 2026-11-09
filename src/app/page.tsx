"use client";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { Nav, useHash } from "@/components/ui";
import { Home } from "@/components/Home";
import { Dashboard } from "@/components/Dashboard";
import { Course } from "@/components/Course";
import { Lecture } from "@/components/Lecture";
import { Exam } from "@/components/Exam";
import { Upload } from "@/components/Upload";
import { How } from "@/components/How";

export default function App() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const s = useStore();
  const hash = useHash();
  if (!mounted) return <div className="min-h-screen" />;
  const [, view, a, b, c] = hash.split("/");
  const lang = s.lang;
  let body;
  switch (view) {
    case "dashboard": body = <Dashboard lang={lang} />; break;
    case "course": body = <Course id={a} lang={lang} />; break;
    case "lecture": body = <Lecture id={a} step={b || "overview"} extra={c} lang={lang} />; break;
    case "exam": body = <Exam key={a} id={a} lang={lang} />; break;
    case "upload": body = <Upload lang={lang} />; break;
    case "how": body = <How lang={lang} />; break;
    default: body = <Home lang={lang} />;
  }
  return (<><Nav lang={lang} />{body}</>);
}
