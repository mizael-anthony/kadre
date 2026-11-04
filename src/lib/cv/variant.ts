import { SECTION_KEYS, uid, type JobAnalysis, type Resume, type SectionKey } from "./types";

/** Plain-text digest of a resume, used as AI context. */
export function resumeDigest(r: Resume, lang: "fr" | "en"): string {
  const L = (x: { fr: string; en: string }) => x[lang] || x.fr || x.en;
  return [
    `${r.profile.firstName} ${r.profile.lastName} — ${L(r.profile.headline)}`,
    L(r.summary),
    ...r.experiences.map(
      (e) => `${L(e.role)} @ ${e.company} (${e.start}-${e.current ? "now" : e.end}): ${(e.bullets[lang].length ? e.bullets[lang] : e.bullets.fr).join("; ")} | tech: ${e.tech.join(", ")}`,
    ),
    "Skills: " + r.skills.map((s) => `${L(s.name)}: ${s.items.join(", ")}`).join(" / "),
    "Education: " + r.educations.map((e) => `${L(e.degree)} ${e.school}`).join(" / "),
    "Projects: " + r.projects.map((p) => `${p.name}: ${L(p.description)} (${p.tech.join(", ")})`).join(" / "),
  ].join("\n");
}

const norm = (s: string) => s.toLowerCase().trim();

function rankBy<T>(items: T[], score: (t: T) => number): T[] {
  return items
    .map((t, i) => ({ t, i, s: score(t) }))
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .map((x) => x.t);
}

/**
 * Build a variant (sub-CV) from a parent. Only reorders existing content —
 * never adds new achievements. The parent is not mutated.
 */
export function createVariant(parent: Resume, job?: JobAnalysis): Resume {
  const now = new Date().toISOString();
  const v: Resume = structuredClone(parent);
  v.id = uid();
  v.parentId = parent.parentId ?? parent.id;
  v.createdAt = now;
  v.updatedAt = now;
  if (!job) {
    v.title = `${parent.title} — variante`;
    delete v.jobTarget;
    return v;
  }
  v.jobTarget = job;
  v.title = `CV — ${[job.title, job.company].filter(Boolean).join(" @ ") || "Offre"}`;

  const valid = job.sectionOrder.filter((s): s is SectionKey => (SECTION_KEYS as string[]).includes(s));
  if (valid.length) {
    v.sectionOrder = [...new Set([...valid, ...parent.sectionOrder])];
  }

  const wanted = new Set([...job.priorityTech, ...job.keywords, ...job.matched].map(norm));
  const hit = (s: string) => (wanted.has(norm(s)) ? 1 : 0);
  v.experiences.forEach((e) => (e.tech = rankBy(e.tech, hit)));
  v.projects.forEach((p) => (p.tech = rankBy(p.tech, hit)));
  v.skills.forEach((g) => (g.items = rankBy(g.items, hit)));
  v.skills = rankBy(v.skills, (g) => g.items.reduce((n, i) => n + hit(i), 0));
  return v;
}
