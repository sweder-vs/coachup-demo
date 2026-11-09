import type { Topic } from "./types";

export type Gap = { status: "solid" | "partial" | "missing"; title: string; explanation: string };
export type Assessment = { gaps: Gap[]; score: number; encouragement: string };

const words = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter((w) => w.length > 3);

// Demo-only: keyword coverage of the topic's subtopics. Clearly labelled in the UI as sample feedback.
export function mockAssess(topic: Topic, answer: string): Assessment {
  const a = answer.toLowerCase();
  const subs = topic.subtopics.length ? topic.subtopics : [topic.name];
  const gaps: Gap[] = subs.map((sub) => {
    const ws = words(sub);
    const hit = ws.length ? ws.filter((w) => a.includes(w.slice(0, Math.max(4, w.length - 2)))).length / ws.length : 0;
    if (hit >= 0.6) return { status: "solid", title: sub, explanation: "You covered this point clearly." };
    if (hit > 0) return { status: "partial", title: sub, explanation: "You touched on this but it needs more precision or detail." };
    return { status: "missing", title: sub, explanation: `Not mentioned. Hint: ${topic.description}` };
  });
  const pts = gaps.reduce((n, g) => n + (g.status === "solid" ? 1 : g.status === "partial" ? 0.5 : 0), 0);
  const score = Math.round((pts / gaps.length) * 100);
  const encouragement = score >= 70 ? "Strong grasp of this topic. Tidy up the partial points and move on." : score >= 40 ? "A solid start. Fill the gaps below, then try again." : "Plenty to build on. Re-read the overview, then write it out again in your own words.";
  return { gaps, score, encouragement };
}
