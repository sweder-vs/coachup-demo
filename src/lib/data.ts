import raw from "../data/lectures.json";
import type { Course, Lecture, Question } from "./types";

export const COURSES: Course[] = [
  {
    id: "ondrecht", name: "Ondernemingsrecht", discipline: "law", language: "nl", icon: "⚖️", examInDays: 9,
    blurb: { en: "Dutch company law: partnerships, NV/BV, associations, bankruptcy. Content in Dutch.", nl: "Rechtsvormen, NV en BV, vereniging, stichting en faillissement." },
  },
  {
    id: "polecon", name: "Political Economics", discipline: "economics", language: "en", icon: "📊", examInDays: 24,
    blurb: { en: "How politics shapes economic outcomes: corruption, institutions, voting, fiscal policy.", nl: "Hoe politiek economische uitkomsten bepaalt (Engelstalige stof)." },
  },
];

const all: Lecture[] = (raw as unknown as Lecture[]).map((l) => ({
  ...l,
  questions: (l.questions || []).filter((q: Question) => Array.isArray(q.options) && q.options.length > 1),
}));

// Political Economics has no stored exam row, so build a practice exam from the four lectures' quiz questions.
const polEcon = all.filter((l) => l.course === "polecon");
const polEconExam: Lecture = {
  id: "polecon-exam", course: "polecon", order: 99, name: "Practice exam — Lectures 1–4", isExam: true,
  overview: { introduction: "", keyTakeaways: [], sections: [], keyTerms: [] },
  topics: [], flashcards: [], summary: null,
  questions: polEcon.flatMap((l) => l.questions.map((q) => ({ ...q, id: l.order * 100 + q.id, topic: l.name }))),
};

export const LECTURES: Lecture[] = [...all, polEconExam];
export const getLecture = (id: string) => LECTURES.find((l) => l.id === id);
export const getCourse = (id: string) => COURSES.find((c) => c.id === id);
export const courseLectures = (cid: string) => LECTURES.filter((l) => l.course === cid && !l.isExam).sort((a, b) => a.order - b.order);
export const courseExam = (cid: string) => LECTURES.find((l) => l.course === cid && l.isExam);
