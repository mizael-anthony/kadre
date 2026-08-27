import type { TemplateProps } from "./shared";
import { dateRange, fullName, visibleSections } from "./shared";
import { sectionLabel } from "@/lib/cv/i18n";
import type { SectionKey } from "@/lib/cv/types";

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-2 border-b border-paper-rule pb-1 text-[10.5pt] font-semibold uppercase tracking-[0.16em] text-paper-ink">
      {children}
    </h2>
  );
}

export function ClassicTemplate({ resume, lang }: TemplateProps) {
  const p = resume.profile;
  const contacts = [p.email, p.phone, p.location].filter(Boolean);

  const section = (key: SectionKey) => {
    switch (key) {
      case "summary":
        return <p className="text-[9.5pt] leading-[1.55] text-paper-ink">{resume.summary[lang]}</p>;
      case "experiences":
        return (
          <div className="space-y-3">
            {resume.experiences.map((e) => (
              <article key={e.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-[10pt] font-semibold text-paper-ink">
                    {e.role[lang]} · <span className="font-normal">{e.company}</span>
                  </h3>
                  <span className="shrink-0 text-[8.5pt] text-paper-muted">
                    {dateRange(e.start, e.end, e.current, lang)}
                  </span>
                </div>
                <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[9.5pt] leading-[1.5] text-paper-ink">
                  {e.bullets[lang].filter(Boolean).map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
                {e.tech.length > 0 && (
                  <p className="mt-1 text-[8.5pt] italic text-paper-muted">
                    <span className="font-semibold not-italic">{t("techLabel", lang)} : </span>
                    {e.tech.join(" · ")}
                  </p>
                )}
              </article>
            ))}
          </div>
        );
      case "educations":
        return (
          <div className="space-y-2">
            {resume.educations.map((d) => (
              <article key={d.id} className="flex items-baseline justify-between gap-4">
                <div>
                  <h3 className="text-[10pt] font-semibold text-paper-ink">{d.degree[lang]}</h3>
                  <p className="text-[9pt] text-paper-ink">
                    {[d.school, d.location].filter(Boolean).join(", ")}
                  </p>
                  <p className="text-[8.5pt] text-paper-muted">{d.field[lang]}</p>
                </div>
                <span className="shrink-0 text-[8.5pt] text-paper-muted">
                  {dateRange(d.start, d.end, false, lang)}
                </span>
              </article>
            ))}
          </div>
        );
      case "skills":
        return (
          <div className="space-y-1">
            {resume.skills.map((g) => (
              <p key={g.id} className="text-[9.5pt] text-paper-ink">
                <span className="font-semibold">{g.name[lang]} : </span>
                {g.items.join(", ")}
              </p>
            ))}
          </div>
        );
      case "languages":
        return (
          <p className="text-[9.5pt] text-paper-ink">
            {resume.languages.map((l) => `${l.name[lang]} (${l.level[lang]})`).join(" · ")}
          </p>
        );
      case "certifications":
        return (
          <div className="space-y-1">
            {resume.certifications.map((c) => (
              <p key={c.id} className="text-[9.5pt] text-paper-ink">
                <span className="font-semibold">{c.name[lang]}</span>
                {c.issuer ? ` — ${c.issuer}` : ""}
                {c.date ? ` (${c.date})` : ""}
              </p>
            ))}
          </div>
        );
      case "projects":
        return (
          <div className="space-y-2">
            {resume.projects.map((pr) => (
              <article key={pr.id}>
                <h3 className="text-[10pt] font-semibold text-paper-ink">{pr.name}</h3>
                <p className="text-[9.5pt] leading-[1.5] text-paper-ink">{pr.description[lang]}</p>
                {pr.tech.length > 0 && (
                  <p className="text-[8.5pt] italic text-paper-muted">{pr.tech.join(" · ")}</p>
                )}
              </article>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="font-serif text-paper-ink">
      <header className="mb-4 text-center">
        <h1 className="text-[20pt] font-bold uppercase tracking-[0.08em]">{fullName(resume)}</h1>
        <p className="mt-1 text-[10.5pt] text-paper-muted">{p.headline[lang]}</p>
        <p className="mt-1.5 text-[8.5pt] text-paper-muted">{contacts.join("  •  ")}</p>
        {p.links.length > 0 && (
          <p className="text-[8.5pt] text-paper-muted">
            {p.links.map((l) => l.label).join("  •  ")}
          </p>
        )}
      </header>
      <div className="space-y-4">
        {visibleSections(resume).map((key) => (
          <section key={key}>
            <Heading>{sectionLabel(key, lang)}</Heading>
            {section(key)}
          </section>
        ))}
      </div>
    </div>
  );
}
