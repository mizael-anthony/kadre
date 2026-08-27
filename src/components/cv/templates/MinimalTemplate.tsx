import type { TemplateProps } from "./shared";
import { dateRange, fullName, visibleSections } from "./shared";
import { sectionLabel, t } from "@/lib/cv/i18n";
import type { SectionKey } from "@/lib/cv/types";

export function MinimalTemplate({ resume, lang }: TemplateProps) {
  const p = resume.profile;

  const section = (key: SectionKey) => {
    switch (key) {
      case "summary":
        return <p className="text-[9.5pt] leading-[1.6] text-paper-ink">{resume.summary[lang]}</p>;
      case "experiences":
        return (
          <div className="space-y-3">
            {resume.experiences.map((e) => (
              <article key={e.id}>
                <h3 className="text-[10pt] text-paper-ink">
                  <span className="font-semibold">{e.company}</span> — {e.role[lang]}
                </h3>
                <p className="text-[8.5pt] uppercase tracking-wide text-paper-muted">
                  {dateRange(e.start, e.end, e.current, lang)}
                </p>
                <ul className="mt-1 space-y-0.5 text-[9.5pt] leading-[1.5] text-paper-ink">
                  {e.bullets[lang].filter(Boolean).map((b, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-paper-muted">—</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                {e.tech.length > 0 && (
                  <p className="mt-1 text-[8.5pt] text-paper-muted">{e.tech.join(", ")}</p>
                )}
              </article>
            ))}
          </div>
        );
      case "educations":
        return (
          <div className="space-y-1.5">
            {resume.educations.map((d) => (
              <article key={d.id} className="text-[9.5pt] text-paper-ink">
                <span className="font-semibold">{d.degree[lang]}</span> —{" "}
                {[d.school, d.location].filter(Boolean).join(", ")}
                <span className="text-paper-muted"> · {dateRange(d.start, d.end, false, lang)}</span>
              </article>
            ))}
          </div>
        );
      case "skills":
        return (
          <div className="space-y-1">
            {resume.skills.map((g) => (
              <p key={g.id} className="text-[9.5pt] text-paper-ink">
                <span className="text-paper-muted">{g.name[lang]} — </span>
                {g.items.join(", ")}
              </p>
            ))}
          </div>
        );
      case "languages":
        return (
          <p className="text-[9.5pt] text-paper-ink">
            {resume.languages.map((l) => `${l.name[lang]} — ${l.level[lang]}`).join(" · ")}
          </p>
        );
      case "certifications":
        return (
          <div className="space-y-1">
            {resume.certifications.map((c) => (
              <p key={c.id} className="text-[9.5pt] text-paper-ink">
                {[c.name[lang], c.issuer, c.date].filter(Boolean).join(" · ")}
              </p>
            ))}
          </div>
        );
      case "projects":
        return (
          <div className="space-y-2">
            {resume.projects.map((pr) => (
              <article key={pr.id} className="text-[9.5pt] text-paper-ink">
                <span className="font-semibold">{pr.name}</span> — {pr.description[lang]}
                {pr.tech.length > 0 && (
                  <span className="text-paper-muted"> ({pr.tech.join(", ")})</span>
                )}
              </article>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="font-sans text-paper-ink">
      <header className="mb-6">
        <h1 className="text-[17pt] font-semibold tracking-tight">{fullName(resume)}</h1>
        <p className="text-[10pt] text-paper-muted">{p.headline[lang]}</p>
        <p className="mt-1 text-[8.5pt] text-paper-muted">
          {[p.email, p.phone, p.location, ...p.links.map((l) => l.label)]
            .filter(Boolean)
            .join(" / ")}
        </p>
      </header>
      <div className="space-y-5">
        {visibleSections(resume).map((key) => (
          <section key={key} className="grid grid-cols-[24mm_1fr] gap-4">
            <h2 className="pt-0.5 text-[8.5pt] font-semibold uppercase tracking-[0.12em] text-paper-muted">
              {sectionLabel(key, lang)}
            </h2>
            <div>{section(key)}</div>
          </section>
        ))}
      </div>
    </div>
  );
}
