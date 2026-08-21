import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ExportMode, Lang, Resume } from "@/lib/cv/types";
import { ClassicTemplate } from "./templates/ClassicTemplate";
import { ModernTemplate } from "./templates/ModernTemplate";
import { MinimalTemplate } from "./templates/MinimalTemplate";
import { cn } from "@/lib/utils";

const A4_WIDTH_PX = 794; // 210mm at 96dpi

export function ResumeContent({ resume, lang }: { resume: Resume; lang: Lang }) {
  if (resume.template === "classic") return <ClassicTemplate resume={resume} lang={lang} />;
  if (resume.template === "minimal") return <MinimalTemplate resume={resume} lang={lang} />;
  return <ModernTemplate resume={resume} lang={lang} />;
}

export function A4Page({
  resume,
  lang,
  className,
}: {
  resume: Resume;
  lang: Lang;
  className?: string;
}) {
  return (
    <div className={cn("cv-page", className)}>
      <ResumeContent resume={resume} lang={lang} />
    </div>
  );
}

/** Live preview: an A4 page scaled down to fit the available width. */
export function ScaledPreview({ resume, lang }: { resume: Resume; lang: Lang }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(1123);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const measure = () => {
      const next = Math.min(1, wrap.clientWidth / A4_WIDTH_PX);
      setScale(next);
      const pageHeight = pageRef.current?.offsetHeight ?? 1123;
      setHeight(pageHeight * next);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    if (pageRef.current) ro.observe(pageRef.current);
    return () => ro.disconnect();
  }, [resume, lang]);

  return (
    <div ref={wrapRef} className="w-full">
      <div style={{ height }} className="relative w-full">
        <div
          ref={pageRef}
          className="cv-page absolute left-0 top-0 origin-top-left"
          style={{ transform: `scale(${scale})` }}
        >
          <ResumeContent resume={resume} lang={lang} />
        </div>
      </div>
    </div>
  );
}

/**
 * Off-screen print document rendered into a body-level portal so the browser
 * PDF export only contains the A4 pages (see @media print rules in styles.css).
 */
export function PrintDocument({ resume, mode }: { resume: Resume; mode: ExportMode }) {
  const [host, setHost] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const el = document.createElement("div");
    el.id = "print-root";
    document.body.appendChild(el);
    setHost(el);
    return () => {
      el.remove();
    };
  }, []);

  if (!host) return null;
  const langs: Lang[] = mode === "bilingual" ? ["fr", "en"] : [mode];

  return createPortal(
    <>
      {langs.map((lang) => (
        <A4Page key={lang} resume={resume} lang={lang} />
      ))}
    </>,
    host,
  );
}
