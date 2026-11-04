import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { analyzeJob } from "@/lib/cv/job.functions";
import { createVariant, resumeDigest } from "@/lib/cv/variant";
import { loadResumes, saveResumes } from "@/lib/cv/storage";
import type { JobAnalysis, Lang, Resume } from "@/lib/cv/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function JobAnalysisDialog({ resume, lang }: { resume: Resume; lang: Lang }) {
  const navigate = useNavigate();
  const run = useServerFn(analyzeJob);
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JobAnalysis | null>(null);

  const analyze = async () => {
    if (!url.trim() && !text.trim()) {
      toast.error("Ajoutez un lien ou le texte de l'offre.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const r = await run({ data: { url: url.trim(), text, resumeSummary: resumeDigest(resume, lang), lang } });
      if (r.ok) setResult(r.analysis);
      else toast.error(r.error);
    } catch {
      toast.error("L'analyse a échoué. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const makeVariant = () => {
    if (!result) return;
    const v = createVariant(resume, result);
    saveResumes([v, ...loadResumes()]);
    toast.success("Variante créée");
    setOpen(false);
    navigate({ to: "/builder/$id", params: { id: v.id } });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Search className="h-4 w-4" />
          Analyser une offre
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Analyser une offre d'emploi</DialogTitle>
          <DialogDescription>
            Collez le lien de l'annonce. Si le site bloque la lecture, collez directement le texte.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Input placeholder="https://…" value={url} onChange={(e) => setUrl(e.target.value)} />
          <Textarea
            placeholder="…ou collez le texte de l'offre ici (optionnel)"
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button onClick={analyze} disabled={loading} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Analyse en cours…" : "Analyser"}
          </Button>
        </div>

        {result && (
          <div className="mt-4 space-y-4 border-t border-border pt-4">
            <div>
              <h3 className="font-display text-lg font-semibold">{result.title || "Poste"}</h3>
              {result.company && <p className="text-sm text-muted-foreground">{result.company}</p>}
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span>Correspondance avec votre CV</span>
                <span className="font-semibold">{result.score}%</span>
              </div>
              <Progress value={result.score} />
            </div>
            <Chips title="Compétences présentes" items={result.matched} variant="default" />
            <Chips title="Compétences manquantes" items={result.missing} variant="outline" />
            <Chips title="Mots-clés ATS" items={result.keywords} variant="secondary" />
            {result.suggestions.length > 0 && (
              <div>
                <p className="mb-1 text-sm font-medium">Suggestions</p>
                <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {result.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
            <Button onClick={makeVariant} className="w-full">
              Créer une variante pour cette offre
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Chips({ title, items, variant }: { title: string; items: string[]; variant: "default" | "outline" | "secondary" }) {
  if (!items.length) return null;
  return (
    <div>
      <p className="mb-1 text-sm font-medium">{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((k) => (
          <Badge key={k} variant={variant}>
            {k}
          </Badge>
        ))}
      </div>
    </div>
  );
}
