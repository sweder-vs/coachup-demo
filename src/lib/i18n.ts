import type { Lang } from "./types";

const S = {
  en: {
    dashboard: "Dashboard", how: "How it works", reset: "Reset demo", demo: "Demo",
    banner: "Demo version: sample courses with pre-generated content. No account, no database, no live AI. Uploads and AI feedback are simulated, and nothing leaves your browser.",
    yourCourses: "Your courses", newCourse: "Add a course", lectures: "lectures", exam: "Exam", inDays: "days", days: "Days left", readiness: "Readiness",
    completed: "completed", ready: "Ready to start", quizDone: "Quiz done · Get your summary", allDone: "All stages complete · Summary earned", flashDone: "Flashcards done",
    practiceExams: "Practice exams", questions: "questions", start: "Start", retake: "Retake exam", share: "Share course", copied: "Link copied!",
    overview: "Overview", topics: "Topics", flashcards: "Flashcards", quiz: "Quiz", summary: "Summary",
    keyTakeaways: "Key takeaways", keyTerms: "Key terms", topic: "Topic", startDrill: "Start flashcard drill", tapReveal: "Tap the card to reveal the answer",
    knew: "Knew it", didnt: "Didn't know", results: "Results", correct: "correct", toQuiz: "Continue to quiz", card: "Card",
    check: "Check answers", scored: "You scored", getSummary: "Get summary sheet", question: "Question", of: "of",
    earned: "You earned your summary sheet", recall: "Active recall prompts", next: "Next", finish: "Finish", startExam: "Start exam", passed: "Passed (≥55%)",
    wellDone: "Well done!", passedT: "Passed!", keepStudying: "Keep studying", byTopic: "Results by topic", wrong: "Review your mistakes", yourAnswer: "Your answer", correctAnswer: "Correct answer",
    assessTitle: "Explain it yourself", assessHint: "Prototype feature: write what you know about this topic and get a gap analysis.", assessBtn: "Check my understanding",
    analysing: "Analysing your answer…", assessNote: "Demo: simple keyword-based sample feedback, not a live AI model.", solid: "Solid", partial: "Partial", missing: "Missing", understanding: "Your understanding",
    back: "Back", courseBack: "Back to course", codebook: "Tip: have your law code book ready, just like in the real exam.",
  },
  nl: {
    dashboard: "Dashboard", how: "Hoe het werkt", reset: "Demo resetten", demo: "Demo",
    banner: "Demoversie: voorbeeldvakken met vooraf gegenereerde inhoud. Geen account, geen database, geen live AI. Uploads en AI-feedback zijn gesimuleerd en er verlaat niets je browser.",
    yourCourses: "Jouw vakken", newCourse: "Vak toevoegen", lectures: "colleges", exam: "Tentamen", inDays: "dagen", days: "Dagen te gaan", readiness: "Voortgang",
    completed: "afgerond", ready: "Klaar om te starten", quizDone: "Quiz gedaan · Haal je samenvatting", allDone: "Alle stappen klaar · Samenvatting verdiend", flashDone: "Flashcards klaar",
    practiceExams: "Oefententamens", questions: "vragen", start: "Start", retake: "Opnieuw maken", share: "Vak delen", copied: "Link gekopieerd!",
    overview: "Overzicht", topics: "Onderwerpen", flashcards: "Flashcards", quiz: "Quiz", summary: "Samenvatting",
    keyTakeaways: "Belangrijkste punten", keyTerms: "Kernbegrippen", topic: "Onderwerp", startDrill: "Start flashcards", tapReveal: "Tik op de kaart voor het antwoord",
    knew: "Wist ik", didnt: "Wist ik niet", results: "Resultaat", correct: "goed", toQuiz: "Verder naar de quiz", card: "Kaart",
    check: "Controleer antwoorden", scored: "Je score", getSummary: "Haal samenvatting", question: "Vraag", of: "van",
    earned: "Je hebt je samenvatting verdiend", recall: "Actief herhalen", next: "Volgende", finish: "Afronden", startExam: "Start tentamen", passed: "Voldoende (≥55%)",
    wellDone: "Goed gedaan!", passedT: "Voldoende!", keepStudying: "Blijf oefenen", byTopic: "Resultaat per onderwerp", wrong: "Bekijk je fouten", yourAnswer: "Jouw antwoord", correctAnswer: "Goede antwoord",
    assessTitle: "Leg het zelf uit", assessHint: "Prototypefunctie: schrijf wat je weet over dit onderwerp en krijg een gapanalyse.", assessBtn: "Controleer mijn begrip",
    analysing: "Je antwoord wordt geanalyseerd…", assessNote: "Demo: eenvoudige voorbeeldfeedback op basis van trefwoorden, geen live AI-model.", solid: "Goed", partial: "Gedeeltelijk", missing: "Ontbreekt", understanding: "Jouw begrip",
    back: "Terug", courseBack: "Terug naar vak", codebook: "Tip: houd je wettenbundel bij de hand, net als bij het echte tentamen.",
  },
} as const;

export type Key = keyof typeof S.en;
export const t = (lang: Lang, k: Key): string => S[lang][k];
