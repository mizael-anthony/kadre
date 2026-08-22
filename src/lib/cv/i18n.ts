import type { Lang, SectionKey } from "./types";

type Dict = Record<string, Loc2>;
type Loc2 = { fr: string; en: string };

export const SECTION_LABELS: Record<SectionKey, Loc2> = {
  summary: { fr: "Résumé", en: "Summary" },
  experiences: { fr: "Expériences", en: "Experience" },
  educations: { fr: "Formations", en: "Education" },
  skills: { fr: "Compétences", en: "Skills" },
  languages: { fr: "Langues", en: "Languages" },
  certifications: { fr: "Certifications", en: "Certifications" },
  projects: { fr: "Projets", en: "Projects" },
};

export const UI: Dict = {
  present: { fr: "Aujourd'hui", en: "Present" },
  profile: { fr: "Profil", en: "Profile" },
  links: { fr: "Liens", en: "Links" },
  contact: { fr: "Contact", en: "Contact" },
  technologies: { fr: "Technologies", en: "Technologies" },
};

export const t = (key: keyof typeof UI, lang: Lang) => UI[key]![lang];
export const sectionLabel = (key: SectionKey, lang: Lang) => SECTION_LABELS[key][lang];
