import { useState } from "react";
import { Check, Lock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import type { Lang } from "@/lib/cv/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const BENEFITS = [
  "Reformulation avec des verbes d'action et des résultats chiffrés",
  "Ton professionnel et vocabulaire optimisé pour les filtres ATS",
  "Variantes courtes ou détaillées, adaptées à l'offre visée",
];

/**
 * Bouton d'aide à la rédaction IA. Fonctionnalité Pro : le clic ouvre un
 * paywall d'information, aucun contenu n'est généré ni modifié.
 */
export function AiAssistButton({
  fieldLabel,
  lang,
  sample,
}: {
  fieldLabel: string;
  lang: Lang;
  sample?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        aria-label={`Aide à la rédaction IA — ${fieldLabel} (Pro)`}
        className="h-6 gap-1 px-1.5 text-[11px] font-semibold text-primary hover:bg-primary/10"
      >
        <Sparkles className="size-3.5" aria-hidden />
        IA
        <Lock className="size-3 opacity-60" aria-hidden />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mb-1 flex items-center gap-2">
              <Badge className="gap-1">
                <Sparkles className="size-3" aria-hidden /> Pro
              </Badge>
              <span className="text-xs text-muted-foreground">
                {lang === "fr" ? "Rédaction française" : "Rédaction anglaise"}
              </span>
            </div>
            <DialogTitle className="font-display">Assistant de rédaction</DialogTitle>
            <DialogDescription>
              L'IA améliore le champ « {fieldLabel} » sans changer vos faits, dans la langue en
              cours d'édition.
            </DialogDescription>
          </DialogHeader>

          <ul className="space-y-2 text-sm">
            {BENEFITS.map((b) => (
              <li key={b} className="flex gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="relative overflow-hidden rounded-lg border border-border bg-surface p-3">
            <p className="select-none text-sm leading-relaxed text-muted-foreground blur-[3px]">
              {sample?.trim()
                ? sample
                : "Conception et déploiement d'une API Rails traitant 12 000 requêtes/min, réduisant la latence médiane de 38 %."}
            </p>
            <div className="absolute inset-0 flex items-center justify-center bg-background/40">
              <span className="flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-xs font-semibold shadow-soft">
                <Lock className="size-3.5" aria-hidden /> Réservé aux comptes Pro
              </span>
            </div>
          </div>

          <DialogFooter className="sm:justify-between">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Plus tard
            </Button>
            <Button
              onClick={() => {
                setOpen(false);
                toast.info("Kadre Pro arrive bientôt — vous serez prévenu au lancement.");
              }}
            >
              <Sparkles className="size-4" aria-hidden /> Passer à Pro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/** Bandeau de présentation de l'assistant IA, masquable. */
export function AiProBanner() {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3">
      <Sparkles className="size-4 text-primary" aria-hidden />
      <p className="min-w-0 flex-1 text-sm">
        <span className="font-semibold">Assistant de rédaction IA</span> — cherchez le bouton{" "}
        <span className="font-semibold text-primary">IA</span> sur les champs texte pour améliorer
        vos formulations. Fonctionnalité Pro.
      </p>
      <Button variant="ghost" size="sm" onClick={() => setHidden(true)}>
        Masquer
      </Button>
    </div>
  );
}
