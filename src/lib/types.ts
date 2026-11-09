export type Option = { text: string; letter: string };
export type Question = { id: number; topic: string; question: string; options: Option[]; correctLetter: string; explanation: string };
export type Card = { id: number; front: string; back: string; topic: string; priority?: string };
export type Topic = { id: number; name: string; description: string; subtopics: string[] };
export type Overview = {
  introduction: string;
  keyTakeaways: string[];
  sections: { heading: string; content: string }[];
  keyTerms: { term: string; definition: string }[];
};
export type SummarySection = { heading: string; type: string; items?: string[]; headers?: string[]; rows?: string[][] };
export type Summary = { title: string; sections: SummarySection[]; recallPrompts?: string[] };
export type Lecture = {
  id: string; course: string; order: number; name: string; isExam: boolean;
  overview: Overview; topics: Topic[]; flashcards: Card[]; questions: Question[]; summary: Summary | null;
};
export type Lang = "en" | "nl";
export type Course = {
  id: string; name: string; discipline: "economics" | "law"; language: Lang; icon: string;
  examInDays: number; blurb: Record<Lang, string>;
};
