import type { TemplateProps } from "./shared";
import { dateRange, fullName, visibleSections } from "./shared";
import { sectionLabel, t } from "@/lib/cv/i18n";
import type { SectionKey } from "@/lib/cv/types";

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-2 flex items-center gap-2 text-[9.5pt] font-bold uppercase tracking-[0.18em] text-paper-accent">
      {children}
      <span className="h-px flex-1 bg-paper-rule" />
    </h2>
  );
}

export function ModernTemplate({ resume, lang }: TemplateProps) {
  const p = resume.profile;

  const section = (key: SectionKey) => {
    switch (key) {
      case "summary":
        return <p className="text-[9.5pt] leading-[1.6] text-paper-ink">{resume.summary[lang]}</p>;
      case "experiences":
        return (
          <div className="space-y-3.5">
            {resume.experiences.map((e) => (
              <article key={e.id} className="border-l-2 border-paper-rule pl-3">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <h3 className="text-[10.5pt] font-semibold text-paper-ink">{e.role[lang]}</h3>
                  <span className="text-[8.5pt] font-medium text-paper-accent">
                    {dateRange(e.start, e.end, e.current, lang)}
                  </span>
                </div>
                <p className="text-[9pt] font-medium text-paper-muted">
                  {[e.company, e.location].filter(Boolean).join(" — ")}
                </p>
                <ul className="mt-1 space-y-0.5 text-[9.5pt] leading-[1.5] text-paper-ink">
                  {e.bullets[lang].filter(Boolean).map((b, i) => (
                    <li key={i} className="flex gap-1.5">
                      <span className="text-paper-accent">▸</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                {e.tech.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap items-center gap-1">
                    <span className="text-[7.5pt] font-bold uppercase tracking-wide text-paper-muted">
                      {t("techLabel", lang)}
                    </span>
                    {e.tech.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-sm bg-paper-tint px-1.5 py-[1px] text-[7.5pt] font-medium text-paper-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        );
      case "educations":
        return (
          <div className="space-y-2">
            {resume.educations.map((d) => (
              <article key={d.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <h3 className="text-[10pt] font-semibold text-paper-ink">{d.degree[lang]}</h3>
                  <span className="text-[8.5pt] font-medium text-paper-accent">
                    {dateRange(d.start, d.end, false, lang)}
                  </span>
                </div>
                <p className="text-[9pt] text-paper-muted">
                  {[d.school, d.location].filter(Boolean).join(", ")} · {d.field[lang]}
                </p>
              </article>
            ))}
          </div>
        );
      case "skills":
        return (
          <div className="grid grid-cols-2 gap-x-5 gap-y-1.5">
            {resume.skills.map((g) => (
              <div key={g.id}>
                <p className="text-[8.5pt] font-bold uppercase tracking-wide text-paper-muted">
                  {g.name[lang]}
                </p>
                <p className="text-[9.5pt] text-paper-ink">{g.items.join(", ")}</p>
              </div>
            ))}
          </div>
        );
      case "languages":
        return (
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            {resume.languages.map((l) => (
              <p key={l.id} className="text-[9.5pt] text-paper-ink">
                <span className="font-semibold">{l.name[lang]}</span>{" "}
                <span className="text-paper-muted">— {l.level[lang]}</span>
              </p>
            ))}
          </div>
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
                  <p className="text-[8.5pt] text-paper-muted">{pr.tech.join(" · ")}</p>
                )}
              </article>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="font-sans text-paper-ink">
      <header className="mb-5 border-b-2 border-paper-accent pb-3">
        <h1 className="text-[22pt] font-bold leading-tight tracking-tight">{fullName(resume)}</h1>
        <p className="text-[11pt] font-medium text-paper-accent">{p.headline[lang]}</p>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-[8.5pt] text-paper-muted">
          {[p.email, p.phone, p.location].filter(Boolean).map((c) => (
            <span key={c}>{c}</span>
          ))}
          {p.links.map((l) => (
            <span key={l.id} className="font-medium text-paper-accent">
              {l.label}
            </span>
          ))}
        </div>
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
