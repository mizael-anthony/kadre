import type { Lang, Resume, SectionKey } from "@/lib/cv/types";

export type TemplateProps = { resume: Resume; lang: Lang };

export function visibleSections(resume: Resume): SectionKey[] {
  return resume.sectionOrder.filter((s) => !resume.hiddenSections.includes(s) && hasContent(resume, s));
}

export function hasContent(resume: Resume, key: SectionKey): boolean {
  switch (key) {
    case "summary":
      return Boolean(resume.summary.fr || resume.summary.en);
    case "experiences":
      return resume.experiences.length > 0;
    case "educations":
      return resume.educations.length > 0;
    case "skills":
      return resume.skills.length > 0;
    case "languages":
      return resume.languages.length > 0;
    case "certifications":
      return resume.certifications.length > 0;
    case "projects":
      return resume.projects.length > 0;
  }
}

export function dateRange(start: string, end: string, current: boolean, lang: Lang) {
  const present = lang === "fr" ? "Aujourd'hui" : "Present";
  const right = current || !end ? present : end;
  return [start, right].filter(Boolean).join(" — ");
}

export const fullName = (resume: Resume) =>
  `${resume.profile.firstName} ${resume.profile.lastName}`.trim();
