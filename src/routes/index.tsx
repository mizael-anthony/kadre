import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  FileDown,
  Languages,
  LayoutTemplate,
  MoveVertical,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kadre — Créez un CV bilingue FR/EN en quelques minutes" },
      {
        name: "description",
        content:
          "Saisissez votre CV une fois, basculez français/anglais et exportez un PDF A4 compatible ATS avec 3 modèles professionnels.",
      },
      { property: "og:title", content: "Kadre — CV bilingue FR/EN, export PDF ATS" },
      {
        property: "og:description",
        content:
          "Un seul contenu, deux langues, trois modèles. Kadre génère des CV professionnels prêts à envoyer.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  {
    icon: Languages,
    title: "Un contenu, deux langues",
    body: "Chaque champ possède sa version FR et EN. Basculez d'une langue à l'autre sans jamais ressaisir votre parcours.",
  },
  {
    icon: LayoutTemplate,
    title: "3 modèles ATS-friendly",
    body: "Classic, Modern et Minimal : typographie soignée, structure lisible par les robots de recrutement.",
  },
  {
    icon: MoveVertical,
    title: "Sections réordonnables",
    body: "Montez, descendez ou masquez chaque bloc pour adapter le CV à l'offre visée.",
  },
  {
    icon: FileDown,
    title: "Export PDF A4",
    body: "Impression pixel-perfect au format A4, en français, en anglais ou les deux dans un seul document.",
  },
  {
    icon: ShieldCheck,
    title: "Vos données restent chez vous",
    body: "Sauvegarde automatique dans votre navigateur. Aucun compte requis pour commencer.",
  },
  {
    icon: Sparkles,
    title: "Aperçu temps réel",
    body: "Le rendu se met à jour à chaque frappe, à l'échelle exacte de la page imprimée.",
  },
] as const;

const STEPS = [
  { n: "01", t: "Saisissez", d: "Profil, expériences, compétences, formations — en FR et EN." },
  { n: "02", t: "Composez", d: "Choisissez un modèle, réordonnez les sections, masquez le superflu." },
  { n: "03", t: "Exportez", d: "Générez le PDF A4 dans la langue attendue par le recruteur." },
] as const;

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary font-display text-sm font-bold text-primary-foreground">
              K
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">Kadre</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/dashboard">Mes CV</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/dashboard">
                Créer mon CV
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 -top-40 h-80 bg-[radial-gradient(60%_60%_at_50%_50%,var(--accent),transparent)] opacity-60" />
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:py-28 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <Badge variant="secondary" className="mb-5 rounded-full px-3 py-1">
                FR / EN · Export PDF A4 · Sans inscription
              </Badge>
              <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
                Votre CV, en français
                <span className="block text-primary">et en anglais.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                Kadre vous fait saisir votre parcours une seule fois, puis génère des CV
                professionnels bilingues prêts à être envoyés — sans mise en page à refaire.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg">
                  <Link to="/dashboard">
                    Commencer gratuitement
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/builder/$id" params={{ id: "demo-anthony" }}>
                    Voir un exemple
                  </Link>
                </Button>
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                {["Compatible ATS", "Aperçu temps réel", "Sauvegarde automatique"].map((x) => (
                  <li key={x} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <div className="rounded-2xl border border-border bg-card p-4 shadow-xl">
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                  <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                  <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                  <span className="ml-auto rounded-md bg-secondary px-2 py-0.5 text-xs font-semibold">
                    FR
                  </span>
                  <span className="rounded-md px-2 py-0.5 text-xs text-muted-foreground">EN</span>
                </div>
                <div className="space-y-3 rounded-xl bg-paper p-6 text-paper-ink shadow-inner">
                  <p className="font-display text-xl font-bold tracking-tight">
                    Anthony RAKOTOMANGA
                  </p>
                  <p className="text-sm text-paper-muted">
                    Développeur Ruby on Rails · Antananarivo
                  </p>
                  <div className="h-px bg-paper-rule" />
                  {[
                    ["Expériences", "92%"],
                    ["Compétences", "70%"],
                    ["Formations", "55%"],
                  ].map(([label, w]) => (
                    <div key={label} className="space-y-1.5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em]">
                        {label}
                      </p>
                      <div className="h-2 rounded bg-paper-rule" style={{ width: w }} />
                      <div className="h-2 w-2/3 rounded bg-paper-rule" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border/60 bg-card/40">
          <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
            <h2 className="font-display text-3xl font-semibold tracking-tight">
              Tout ce qu'il faut, rien de superflu
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f) => (
                <article
                  key={f.title}
                  className="rounded-xl border border-border bg-background p-6 transition-shadow hover:shadow-md"
                >
                  <f.icon className="h-5 w-5 text-primary" />
                  <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <h2 className="font-display text-3xl font-semibold tracking-tight">
            Trois étapes, un CV prêt à envoyer
          </h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n} className="rounded-xl border border-border p-6">
                <span className="font-display text-3xl font-bold text-primary/25">{s.n}</span>
                <h3 className="mt-3 font-display text-lg font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-t border-border/60 bg-primary text-primary-foreground">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-5 py-16 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-tight">
                Prêt à candidater dans les deux langues ?
              </h2>
              <p className="mt-2 text-primary-foreground/80">
                Commencez avec un CV de démonstration, puis remplacez-le par le vôtre.
              </p>
            </div>
            <Button asChild size="lg" variant="secondary">
              <Link to="/dashboard">
                Ouvrir mes CV
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Kadre — CV bilingue FR/EN.</p>
          <p>Vos données sont stockées localement dans votre navigateur.</p>
        </div>
      </footer>
    </div>
  );
}
