import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Copy, FileText, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useResumes } from "@/lib/cv/storage";
import { emptyResume, uid, type Resume } from "@/lib/cv/types";
import { demoResume } from "@/lib/cv/demo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Mes CV — Kadre" },
      {
        name: "description",
        content:
          "Retrouvez, dupliquez et exportez vos CV bilingues FR/EN enregistrés dans Kadre.",
      },
      { property: "og:title", content: "Mes CV — Kadre" },
      {
        property: "og:description",
        content: "Gérez tous vos CV bilingues au même endroit et exportez-les en PDF A4.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const TEMPLATE_LABEL: Record<Resume["template"], string> = {
  classic: "Classic",
  modern: "Modern",
  minimal: "Minimal",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Dashboard() {
  const { resumes, commit } = useResumes();
  const navigate = useNavigate();

  const create = () => {
    const r = emptyResume("Nouveau CV");
    commit([r, ...(resumes ?? [])]);
    navigate({ to: "/builder/$id", params: { id: r.id } });
  };

  const seedDemo = () => {
    const demo = { ...demoResume(), id: uid(), title: "CV de démonstration" };
    commit([demo, ...(resumes ?? [])]);
    toast.success("CV de démonstration ajouté");
  };

  const duplicate = (r: Resume) => {
    const now = new Date().toISOString();
    const copy: Resume = {
      ...structuredClone(r),
      id: uid(),
      title: `${r.title} (copie)`,
      createdAt: now,
      updatedAt: now,
    };
    commit([copy, ...(resumes ?? [])]);
    toast.success("CV dupliqué");
  };

  const remove = (r: Resume) => {
    commit((resumes ?? []).filter((x) => x.id !== r.id));
    toast.success("CV supprimé");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-card/50">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Accueil
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={seedDemo}>
              Ajouter le CV démo
            </Button>
            <Button size="sm" onClick={create}>
              <Plus className="h-4 w-4" />
              Nouveau CV
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-12">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Mes CV</h1>
        <p className="mt-2 text-muted-foreground">
          Vos CV sont enregistrés automatiquement dans ce navigateur.
        </p>

        {resumes === null ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-44 rounded-xl" />
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-border p-12 text-center">
            <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
            <h2 className="mt-4 font-display text-lg font-semibold">Aucun CV pour l'instant</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              Créez votre premier CV bilingue, ou partez du CV de démonstration pour explorer
              l'éditeur.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Button onClick={create}>
                <Plus className="h-4 w-4" />
                Créer un CV
              </Button>
              <Button variant="outline" onClick={seedDemo}>
                Charger la démo
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {resumes.map((r) => (
              <article
                key={r.id}
                className="flex flex-col rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-display text-lg font-semibold leading-snug">{r.title}</h2>
                  <Badge variant="secondary">{TEMPLATE_LABEL[r.template]}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {r.profile.firstName || r.profile.lastName
                    ? `${r.profile.firstName} ${r.profile.lastName}`.trim()
                    : "Sans nom"}
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  Modifié le {formatDate(r.updatedAt)} · {r.experiences.length} expérience(s)
                </p>
                <div className="mt-5 flex items-center gap-2">
                  <Button asChild size="sm" className="flex-1">
                    <Link to="/builder/$id" params={{ id: r.id }}>
                      Éditer
                    </Link>
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    aria-label="Dupliquer"
                    onClick={() => duplicate(r)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    aria-label="Supprimer"
                    onClick={() => remove(r)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
