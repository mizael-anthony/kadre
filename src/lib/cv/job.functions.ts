import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { JobAnalysis } from "./types";

const Input = z.object({
  url: z.string().url().optional().or(z.literal("")),
  text: z.string().max(40000).optional(),
  resumeSummary: z.string().max(20000),
  lang: z.enum(["fr", "en"]),
});

function htmlToText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export const analyzeJob = createServerFn({ method: "POST" })
  .inputValidator((d) => Input.parse(d))
  .handler(async ({ data }): Promise<{ ok: true; analysis: JobAnalysis } | { ok: false; error: string }> => {
    let offer = (data.text ?? "").trim();
    if (!offer && data.url) {
      try {
        const res = await fetch(data.url, {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; KadreBot/1.0)", Accept: "text/html" },
        });
        if (!res.ok) return { ok: false, error: `Impossible de lire la page (${res.status}). Collez le texte de l'offre.` };
        offer = htmlToText(await res.text()).slice(0, 30000);
      } catch {
        return { ok: false, error: "Impossible de lire la page. Collez le texte de l'offre." };
      }
    }
    if (offer.length < 200) return { ok: false, error: "Contenu de l'offre trop court ou illisible. Collez le texte de l'offre." };

    const { generateChatCompletion, GatewayError } = await import("@lovable.dev/ai-gateway");
    const outLang = data.lang === "fr" ? "French" : "English";
    try {
      const r = await generateChatCompletion({
        model: "openai/gpt-6-astra",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You are an ATS and recruiting expert. Compare a job offer with a candidate CV. Never invent experience the CV does not contain. Answer in ${outLang} with JSON only: {"title":string,"company":string,"keywords":string[] (10-20 ATS keywords from the offer),"matched":string[] (keywords present in CV),"missing":string[] (keywords absent from CV),"score":number 0-100,"suggestions":string[] (3-6 concrete, honest tips),"sectionOrder":string[] (ordered subset of: summary, experiences, educations, skills, languages, certifications, projects),"priorityTech":string[] (CV technologies most relevant to the offer)}`,
          },
          { role: "user", content: `JOB OFFER:\n${offer}\n\nCANDIDATE CV:\n${data.resumeSummary}` },
        ],
      });
      const content = r.choices?.[0]?.message?.content;
      const parsed = JSON.parse(typeof content === "string" ? content : "{}");
      const arr = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);
      return {
        ok: true,
        analysis: {
          url: data.url || "",
          title: String(parsed.title ?? ""),
          company: String(parsed.company ?? ""),
          keywords: arr(parsed.keywords),
          matched: arr(parsed.matched),
          missing: arr(parsed.missing),
          score: Math.max(0, Math.min(100, Number(parsed.score) || 0)),
          suggestions: arr(parsed.suggestions),
          sectionOrder: arr(parsed.sectionOrder),
          priorityTech: arr(parsed.priorityTech),
          analyzedAt: new Date().toISOString(),
        },
      };
    } catch (e) {
      console.error("analyzeJob failed", e);
      if (e instanceof GatewayError && e.httpStatus === 402) return { ok: false, error: "Crédits IA épuisés." };
      if (e instanceof GatewayError && e.httpStatus === 429) return { ok: false, error: "Trop de demandes, réessayez dans un instant." };
      return { ok: false, error: "L'analyse a échoué. Réessayez." };
    }
  });
