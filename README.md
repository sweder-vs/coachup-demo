# CoachUp — interactive demo

Static demo of **CoachUp**, an AI study tool I built for my own exam preparation: lecture material goes in; an overview, flashcards, quizzes, summary sheets and practice exams come out.

**Live demo:** https://sweder-vs.github.io/coachup-demo/

What the demo shows (two sample courses, in English and Dutch):
- dashboard with progress rings and exam countdowns, course pages
- lecture flow: overview, topics, scored flashcards, quiz, summary sheet "earned" by finishing the quiz
- timed practice exam with per-topic results and mistake review
- a simulated upload → generation pipeline, and a "How it works" page

This demo is **fully static**: no accounts, no database, no live AI. Content is pre-generated study material; uploads and the self-assessment are simulated. Progress is kept in the browser's localStorage.

Stack of the full product: Next.js, TypeScript, Tailwind, Supabase, Clerk, Claude API.
