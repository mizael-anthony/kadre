export type Lang = "fr" | "en";

/** A field with one value per language. */
export type Loc = { fr: string; en: string };
/** A list field with one list per language. */
export type LocList = { fr: string[]; en: string[] };

export const emptyLoc = (): Loc => ({ fr: "", en: "" });
export const emptyLocList = (): LocList => ({ fr: [""], en: [""] });

export type LinkItem = { id: string; label: string; url: string };

export type Profile = {
  firstName: string;
  lastName: string;
  headline: Loc;
  email: string;
  phone: string;
  location: string;
  links: LinkItem[];
};

export type Experience = {
  id: string;
  company: string;
  role: Loc;
  location: string;
  start: string;
  end: string;
  current: boolean;
  bullets: LocList;
  tech: string[];
};

export type Education = {
  id: string;
  school: string;
  location: string;
  degree: Loc;
  field: Loc;
  start: string;
  end: string;
};

export type SkillGroup = { id: string; name: Loc; items: string[] };
export type LanguageSkill = { id: string; name: Loc; level: Loc };
export type Certification = { id: string; name: Loc; issuer: string; date: string };
export type Project = { id: string; name: string; description: Loc; tech: string[]; url: string };

export type SectionKey =
  | "summary"
  | "experiences"
  | "educations"
  | "skills"
  | "languages"
  | "certifications"
  | "projects";

export const SECTION_KEYS: SectionKey[] = [
  "summary",
  "experiences",
  "educations",
  "skills",
  "languages",
  "certifications",
  "projects",
];

export type TemplateKey = "classic" | "modern" | "minimal";
export type ExportMode = "fr" | "en" | "bilingual";

export type Resume = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  template: TemplateKey;
  sectionOrder: SectionKey[];
  hiddenSections: SectionKey[];
  profile: Profile;
  summary: Loc;
  experiences: Experience[];
  educations: Education[];
  skills: SkillGroup[];
  languages: LanguageSkill[];
  certifications: Certification[];
  projects: Project[];
};

export const uid = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

export function emptyResume(title = "Nouveau CV"): Resume {
  const now = new Date().toISOString();
  return {
    id: uid(),
    title,
    createdAt: now,
    updatedAt: now,
    template: "modern",
    sectionOrder: [...SECTION_KEYS],
    hiddenSections: [],
    profile: {
      firstName: "",
      lastName: "",
      headline: emptyLoc(),
      email: "",
      phone: "",
      location: "",
      links: [],
    },
    summary: emptyLoc(),
    experiences: [],
    educations: [],
    skills: [],
    languages: [],
    certifications: [],
    projects: [],
  };
}
