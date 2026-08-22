import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Printer } from "lucide-react";
import { toast } from "sonner";
import { useResume } from "@/lib/cv/storage";
import type { ExportMode, Lang, TemplateKey } from "@/lib/cv/types";
import { BuilderForm } from "@/components/cv/BuilderForm";
import { PrintDocument, ScaledPreview } from "@/components/cv/ResumePaper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/builder/$id")({
  head: () => ({
    meta: [
      { title: "Éditeur de CV bilingue — Kadre" },
      {
        name: "description",
        content:
          "Éditez votre CV en français et en anglais, réordonnez les sections, changez de modèle et exportez en PDF A4.",
      },
      { property: "og:title", content: "Éditeur de CV bilingue — Kadre" },
      {
        property: "og:description",
        content: "Aperçu A4 temps réel, bascule FR/EN et export PDF compatible ATS.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Builder,
});

const TEMPLATES: { key: TemplateKey; label: string }[] = [
  { key: "classic", label: "Classic" },
  { key: "modern", label: "Modern" },
  { key: "minimal", label: "Minimal" },
];

function Builder() {
  const { id } = Route.useParams();
  const { resume, update } = useResume(id);
  const [lang, setLang] = useState<Lang>("fr");
  const [exportMode, setExportMode] = useState<ExportMode>("fr");
  const [printing, setPrinting] = useState(false);

  const handlePrint = (mode: ExportMode) => {
    setExportMode(mode);
    setPrinting(true);
    // Let the print portal mount before opening the browser print dialog.
    window.setTimeout(() => {
      window.print();
      setPrinting(false);
    }, 350);
  };

  if (resume === undefined) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 px-5 py-16">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[60vh] w-full" />
      </div>
    );
  }

  if (resume === null) {
    return (
      <div className="flex min-h-screen items-center justify-center px-5">
        <div className="text-center">
          <h1 className="font-display text-2xl font-semibold">CV introuvable</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Ce CV n'existe pas ou a été supprimé de ce navigateur.
          </p>
          <Button asChild className="mt-6">
            <Link to="/dashboard">Retour à mes CV</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur print:hidden">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-3 px-5 py-3">
          <Button asChild variant="ghost" size="sm">
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Mes CV
            </Link>
          </Button>

          <Input
            aria-label="Titre du CV"
            value={resume.title}
            onChange={(e) =>
              update((d) => {
                d.title = e.target.value;
                return d;
              })
            }
            className="h-9 w-full max-w-[260px] font-medium"
          />

          <Tabs value={lang} onValueChange={(v) => setLang(v as Lang)}>
            <TabsList>
              <TabsTrigger value="fr">Français</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
            </TabsList>
          </Tabs>

          <Select
            value={resume.template}
            onValueChange={(v) =>
              update((d) => {
                d.template = v as TemplateKey;
                return d;
              })
            }
          >
            <SelectTrigger className="h-9 w-[140px]" aria-label="Modèle">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TEMPLATES.map((t) => (
                <SelectItem key={t.key} value={t.key}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="ml-auto flex items-center gap-2">
            <Select value={exportMode} onValueChange={(v) => setExportMode(v as ExportMode)}>
              <SelectTrigger className="h-9 w-[170px]" aria-label="Contenu de l'export">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">PDF français</SelectItem>
                <SelectItem value="en">PDF anglais</SelectItem>
                <SelectItem value="bilingual">PDF bilingue (2 pages)</SelectItem>
              </SelectContent>
            </Select>
            <Button
              size="sm"
              disabled={printing}
              onClick={() => {
                handlePrint(exportMode);
                toast.info("Choisissez « Enregistrer au format PDF » dans la boîte de dialogue.");
              }}
            >
              {printing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Printer className="h-4 w-4" />
              )}
              Exporter PDF
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1600px] gap-8 px-5 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] print:hidden">
        <section className="min-w-0">
          <BuilderForm resume={resume} lang={lang} update={update} />
        </section>

        <section className="min-w-0">
          <div className="sticky top-24">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Aperçu {lang === "fr" ? "français" : "anglais"}
              </h2>
              <span className="text-xs text-muted-foreground">A4 · 210 × 297 mm</span>
            </div>
            <div className="rounded-xl bg-surface p-4 shadow-soft">
              <ScaledPreview resume={resume} lang={lang} />
            </div>
          </div>
        </section>
      </main>

      {printing && <PrintDocument resume={resume} mode={exportMode} />}
    </div>
  );
}
