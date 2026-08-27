import { ChevronDown, ChevronUp, Eye, EyeOff, GripVertical, Plus, Trash2 } from "lucide-react";
import type { Lang, Resume, SectionKey } from "@/lib/cv/types";
import { uid } from "@/lib/cv/types";
import { SECTION_LABELS } from "@/lib/cv/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { AiAssistButton, AiProBanner } from "@/components/cv/AiAssistButton";

type Update = (mutate: (draft: Resume) => Resume) => void;

function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea,
  rows = 3,
  ai,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
  rows?: number;
  /** Langue à assister ; affiche le bouton IA (Pro) à côté du libellé. */
  ai?: Lang;
}) {
  const id = `f-${label.replace(/\s+/g, "-").toLowerCase()}-${useIdSuffix()}`;
  return (
    <div className="space-y-1.5">
      <div className="flex min-h-6 items-center justify-between gap-2">
        <Label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </Label>
        {ai && <AiAssistButton fieldLabel={label} lang={ai} sample={value} />}
      </div>
      {textarea ? (
        <Textarea id={id} rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <Input id={id} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

let counter = 0;
function useIdSuffix() {
  counter = (counter + 1) % 100000;
  return counter;
}

function Card({
  title,
  actions,
  children,
}: {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-soft">
      <header className="mb-3 flex items-center justify-between gap-2">
        <h3 className="font-display text-sm font-semibold">{title}</h3>
        <div className="flex items-center gap-1">{actions}</div>
      </header>
      {children}
    </section>
  );
}

function ItemShell({
  title,
  onRemove,
  onUp,
  onDown,
  children,
}: {
  title: string;
  onRemove: () => void;
  onUp: () => void;
  onDown: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="mb-2 flex items-center gap-1">
        <GripVertical className="size-4 text-muted-foreground" aria-hidden />
        <p className="flex-1 truncate text-sm font-medium">{title}</p>
        <Button variant="ghost" size="icon" aria-label="Monter" onClick={onUp}>
          <ChevronUp className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Descendre" onClick={onDown}>
          <ChevronDown className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Supprimer" onClick={onRemove}>
          <Trash2 className="size-4 text-destructive" />
        </Button>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function move<T>(arr: T[], from: number, to: number) {
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  const [item] = next.splice(from, 1) as [T];
  next.splice(to, 0, item);
  return next;
}

export function BuilderForm({
  resume,
  lang,
  update,
}: {
  resume: Resume;
  lang: Lang;
  update: Update;
}) {
  const other: Lang = lang === "fr" ? "en" : "fr";
  const langTag = lang === "fr" ? "FR" : "EN";

  const toggleSection = (key: SectionKey) =>
    update((d) => {
      d.hiddenSections = d.hiddenSections.includes(key)
        ? d.hiddenSections.filter((s) => s !== key)
        : [...d.hiddenSections, key];
      return d;
    });

  const moveSection = (key: SectionKey, dir: -1 | 1) =>
    update((d) => {
      const i = d.sectionOrder.indexOf(key);
      d.sectionOrder = move(d.sectionOrder, i, i + dir);
      return d;
    });

  const sectionActions = (key: SectionKey) => (
    <>
      <Button variant="ghost" size="icon" aria-label="Monter la section" onClick={() => moveSection(key, -1)}>
        <ChevronUp className="size-4" />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Descendre la section" onClick={() => moveSection(key, 1)}>
        <ChevronDown className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label={resume.hiddenSections.includes(key) ? "Afficher la section" : "Masquer la section"}
        onClick={() => toggleSection(key)}
      >
        {resume.hiddenSections.includes(key) ? (
          <EyeOff className="size-4 text-muted-foreground" />
        ) : (
          <Eye className="size-4" />
        )}
      </Button>
    </>
  );

  const renderSection = (key: SectionKey) => {
    const title = `${SECTION_LABELS[key].fr} · ${SECTION_LABELS[key].en}`;
    switch (key) {
      case "summary":
        return (
          <Card key={key} title={title} actions={sectionActions(key)}>
            <Field
              label={`Résumé (${langTag})`}
              textarea
              rows={7}
              value={resume.summary[lang]}
              onChange={(v) => update((d) => ((d.summary[lang] = v), d))}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Version {other.toUpperCase()} : {resume.summary[other].slice(0, 90) || "vide"}…
            </p>
          </Card>
        );
      case "experiences":
        return (
          <Card
            key={key}
            title={title}
            actions={
              <>
                {sectionActions(key)}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    update((d) => {
                      d.experiences.unshift({
                        id: uid(),
                        company: "",
                        role: { fr: "", en: "" },
                        location: "",
                        start: "",
                        end: "",
                        current: false,
                        bullets: { fr: [""], en: [""] },
                        tech: [],
                      });
                      return d;
                    })
                  }
                >
                  <Plus className="size-4" /> Ajouter
                </Button>
              </>
            }
          >
            <div className="space-y-3">
              {resume.experiences.map((e, i) => (
                <ItemShell
                  key={e.id}
                  title={e.company || "Nouvelle expérience"}
                  onRemove={() => update((d) => ((d.experiences = d.experiences.filter((x) => x.id !== e.id)), d))}
                  onUp={() => update((d) => ((d.experiences = move(d.experiences, i, i - 1)), d))}
                  onDown={() => update((d) => ((d.experiences = move(d.experiences, i, i + 1)), d))}
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field
                      label="Entreprise"
                      value={e.company}
                      onChange={(v) => update((d) => ((d.experiences[i]!.company = v), d))}
                    />
                    <Field
                      label={`Poste (${langTag})`}
                      value={e.role[lang]}
                      onChange={(v) => update((d) => ((d.experiences[i]!.role[lang] = v), d))}
                    />
                    <Field
                      label="Début"
                      placeholder="Oct '25"
                      value={e.start}
                      onChange={(v) => update((d) => ((d.experiences[i]!.start = v), d))}
                    />
                    <Field
                      label="Fin (vide = aujourd'hui)"
                      value={e.end}
                      onChange={(v) => update((d) => ((d.experiences[i]!.end = v), (d.experiences[i]!.current = !v), d))}
                    />
                  </div>
                  <Field
                    label={`Réalisations (${langTag}) — une par ligne`}
                    textarea
                    rows={4}
                    value={e.bullets[lang].join("\n")}
                    onChange={(v) => update((d) => ((d.experiences[i]!.bullets[lang] = v.split("\n")), d))}
                  />
                  <Field
                    label="Technologies (séparées par des virgules)"
                    value={e.tech.join(", ")}
                    onChange={(v) =>
                      update((d) => ((d.experiences[i]!.tech = v.split(",").map((s) => s.trim()).filter(Boolean)), d))
                    }
                  />
                </ItemShell>
              ))}
            </div>
          </Card>
        );
      case "educations":
        return (
          <Card
            key={key}
            title={title}
            actions={
              <>
                {sectionActions(key)}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    update((d) => {
                      d.educations.unshift({
                        id: uid(),
                        school: "",
                        location: "",
                        degree: { fr: "", en: "" },
                        field: { fr: "", en: "" },
                        start: "",
                        end: "",
                      });
                      return d;
                    })
                  }
                >
                  <Plus className="size-4" /> Ajouter
                </Button>
              </>
            }
          >
            <div className="space-y-3">
              {resume.educations.map((d0, i) => (
                <ItemShell
                  key={d0.id}
                  title={d0.school || "Nouvelle formation"}
                  onRemove={() => update((d) => ((d.educations = d.educations.filter((x) => x.id !== d0.id)), d))}
                  onUp={() => update((d) => ((d.educations = move(d.educations, i, i - 1)), d))}
                  onDown={() => update((d) => ((d.educations = move(d.educations, i, i + 1)), d))}
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="École" value={d0.school} onChange={(v) => update((d) => ((d.educations[i]!.school = v), d))} />
                    <Field label="Lieu" value={d0.location} onChange={(v) => update((d) => ((d.educations[i]!.location = v), d))} />
                    <Field
                      label={`Diplôme (${langTag})`}
                      value={d0.degree[lang]}
                      onChange={(v) => update((d) => ((d.educations[i]!.degree[lang] = v), d))}
                    />
                    <Field
                      label={`Spécialité (${langTag})`}
                      value={d0.field[lang]}
                      onChange={(v) => update((d) => ((d.educations[i]!.field[lang] = v), d))}
                    />
                    <Field label="Début" value={d0.start} onChange={(v) => update((d) => ((d.educations[i]!.start = v), d))} />
                    <Field label="Fin" value={d0.end} onChange={(v) => update((d) => ((d.educations[i]!.end = v), d))} />
                  </div>
                </ItemShell>
              ))}
            </div>
          </Card>
        );
      case "skills":
        return (
          <Card
            key={key}
            title={title}
            actions={
              <>
                {sectionActions(key)}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    update((d) => (d.skills.push({ id: uid(), name: { fr: "", en: "" }, items: [] }), d))
                  }
                >
                  <Plus className="size-4" /> Ajouter
                </Button>
              </>
            }
          >
            <div className="space-y-3">
              {resume.skills.map((g, i) => (
                <ItemShell
                  key={g.id}
                  title={g.name[lang] || "Nouveau groupe"}
                  onRemove={() => update((d) => ((d.skills = d.skills.filter((x) => x.id !== g.id)), d))}
                  onUp={() => update((d) => ((d.skills = move(d.skills, i, i - 1)), d))}
                  onDown={() => update((d) => ((d.skills = move(d.skills, i, i + 1)), d))}
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field
                      label={`Catégorie (${langTag})`}
                      value={g.name[lang]}
                      onChange={(v) => update((d) => ((d.skills[i]!.name[lang] = v), d))}
                    />
                    <Field
                      label="Compétences (virgules)"
                      value={g.items.join(", ")}
                      onChange={(v) =>
                        update((d) => ((d.skills[i]!.items = v.split(",").map((s) => s.trim()).filter(Boolean)), d))
                      }
                    />
                  </div>
                </ItemShell>
              ))}
            </div>
          </Card>
        );
      case "languages":
        return (
          <Card
            key={key}
            title={title}
            actions={
              <>
                {sectionActions(key)}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    update(
                      (d) => (
                        d.languages.push({ id: uid(), name: { fr: "", en: "" }, level: { fr: "", en: "" } }), d
                      ),
                    )
                  }
                >
                  <Plus className="size-4" /> Ajouter
                </Button>
              </>
            }
          >
            <div className="space-y-3">
              {resume.languages.map((l, i) => (
                <ItemShell
                  key={l.id}
                  title={l.name[lang] || "Nouvelle langue"}
                  onRemove={() => update((d) => ((d.languages = d.languages.filter((x) => x.id !== l.id)), d))}
                  onUp={() => update((d) => ((d.languages = move(d.languages, i, i - 1)), d))}
                  onDown={() => update((d) => ((d.languages = move(d.languages, i, i + 1)), d))}
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field
                      label={`Langue (${langTag})`}
                      value={l.name[lang]}
                      onChange={(v) => update((d) => ((d.languages[i]!.name[lang] = v), d))}
                    />
                    <Field
                      label={`Niveau (${langTag})`}
                      value={l.level[lang]}
                      onChange={(v) => update((d) => ((d.languages[i]!.level[lang] = v), d))}
                    />
                  </div>
                </ItemShell>
              ))}
            </div>
          </Card>
        );
      case "certifications":
        return (
          <Card
            key={key}
            title={title}
            actions={
              <>
                {sectionActions(key)}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    update((d) => (d.certifications.push({ id: uid(), name: { fr: "", en: "" }, issuer: "", date: "" }), d))
                  }
                >
                  <Plus className="size-4" /> Ajouter
                </Button>
              </>
            }
          >
            <div className="space-y-3">
              {resume.certifications.map((c, i) => (
                <ItemShell
                  key={c.id}
                  title={c.name[lang] || "Nouvelle certification"}
                  onRemove={() => update((d) => ((d.certifications = d.certifications.filter((x) => x.id !== c.id)), d))}
                  onUp={() => update((d) => ((d.certifications = move(d.certifications, i, i - 1)), d))}
                  onDown={() => update((d) => ((d.certifications = move(d.certifications, i, i + 1)), d))}
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field
                      label={`Intitulé (${langTag})`}
                      value={c.name[lang]}
                      onChange={(v) => update((d) => ((d.certifications[i]!.name[lang] = v), d))}
                    />
                    <Field
                      label="Organisme"
                      value={c.issuer}
                      onChange={(v) => update((d) => ((d.certifications[i]!.issuer = v), d))}
                    />
                    <Field label="Date" value={c.date} onChange={(v) => update((d) => ((d.certifications[i]!.date = v), d))} />
                  </div>
                </ItemShell>
              ))}
            </div>
          </Card>
        );
      case "projects":
        return (
          <Card
            key={key}
            title={title}
            actions={
              <>
                {sectionActions(key)}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    update((d) => (d.projects.push({ id: uid(), name: "", description: { fr: "", en: "" }, tech: [], url: "" }), d))
                  }
                >
                  <Plus className="size-4" /> Ajouter
                </Button>
              </>
            }
          >
            <div className="space-y-3">
              {resume.projects.map((p, i) => (
                <ItemShell
                  key={p.id}
                  title={p.name || "Nouveau projet"}
                  onRemove={() => update((d) => ((d.projects = d.projects.filter((x) => x.id !== p.id)), d))}
                  onUp={() => update((d) => ((d.projects = move(d.projects, i, i - 1)), d))}
                  onDown={() => update((d) => ((d.projects = move(d.projects, i, i + 1)), d))}
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Nom" value={p.name} onChange={(v) => update((d) => ((d.projects[i]!.name = v), d))} />
                    <Field label="URL" value={p.url} onChange={(v) => update((d) => ((d.projects[i]!.url = v), d))} />
                  </div>
                  <Field
                    label={`Description (${langTag})`}
                    textarea
                    value={p.description[lang]}
                    onChange={(v) => update((d) => ((d.projects[i]!.description[lang] = v), d))}
                  />
                  <Field
                    label="Technologies (virgules)"
                    value={p.tech.join(", ")}
                    onChange={(v) =>
                      update((d) => ((d.projects[i]!.tech = v.split(",").map((s) => s.trim()).filter(Boolean)), d))
                    }
                  />
                </ItemShell>
              ))}
            </div>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-4">
      <Card title="Profil · Profile">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Prénom"
            value={resume.profile.firstName}
            onChange={(v) => update((d) => ((d.profile.firstName = v), d))}
          />
          <Field
            label="Nom"
            value={resume.profile.lastName}
            onChange={(v) => update((d) => ((d.profile.lastName = v), d))}
          />
          <Field
            label={`Titre (${langTag})`}
            value={resume.profile.headline[lang]}
            onChange={(v) => update((d) => ((d.profile.headline[lang] = v), d))}
          />
          <Field label="Email" value={resume.profile.email} onChange={(v) => update((d) => ((d.profile.email = v), d))} />
          <Field label="Téléphone" value={resume.profile.phone} onChange={(v) => update((d) => ((d.profile.phone = v), d))} />
          <Field
            label="Localisation"
            value={resume.profile.location}
            onChange={(v) => update((d) => ((d.profile.location = v), d))}
          />
        </div>
        <Separator className="my-4" />
        <div className="space-y-3">
          {resume.profile.links.map((l, i) => (
            <div key={l.id} className="grid gap-3 sm:grid-cols-[1fr_2fr_auto] sm:items-end">
              <Field label="Libellé" value={l.label} onChange={(v) => update((d) => ((d.profile.links[i]!.label = v), d))} />
              <Field label="URL" value={l.url} onChange={(v) => update((d) => ((d.profile.links[i]!.url = v), d))} />
              <Button
                variant="ghost"
                size="icon"
                aria-label="Supprimer le lien"
                onClick={() => update((d) => ((d.profile.links = d.profile.links.filter((x) => x.id !== l.id)), d))}
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          ))}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => update((d) => (d.profile.links.push({ id: uid(), label: "", url: "" }), d))}
          >
            <Plus className="size-4" /> Ajouter un lien
          </Button>
        </div>
      </Card>

      {resume.sectionOrder.map((key) => renderSection(key))}
    </div>
  );
}
