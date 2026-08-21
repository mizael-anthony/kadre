import { useCallback, useEffect, useState } from "react";
import type { Resume } from "./types";
import { demoResume } from "./demo";

const KEY = "cvforge.resumes.v1";

/**
 * localStorage persistence layer. Kept behind a tiny API so it can be swapped
 * for Lovable Cloud / Supabase later without touching the UI.
 */
export function loadResumes(): Resume[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      const seeded = [demoResume()];
      window.localStorage.setItem(KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Resume[]) : [];
  } catch {
    return [];
  }
}

export function saveResumes(list: Resume[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(list));
}

export function useResumes() {
  const [resumes, setResumes] = useState<Resume[] | null>(null);

  useEffect(() => {
    setResumes(loadResumes());
  }, []);

  const commit = useCallback((next: Resume[]) => {
    setResumes(next);
    saveResumes(next);
  }, []);

  return { resumes, commit };
}

export function useResume(id: string) {
  const [resume, setResume] = useState<Resume | null | undefined>(undefined);

  useEffect(() => {
    const found = loadResumes().find((r) => r.id === id) ?? null;
    setResume(found);
  }, [id]);

  const update = useCallback(
    (mutate: (draft: Resume) => Resume) => {
      setResume((current) => {
        if (!current) return current;
        const next = { ...mutate(structuredClone(current)), updatedAt: new Date().toISOString() };
        const all = loadResumes();
        const idx = all.findIndex((r) => r.id === next.id);
        if (idx === -1) all.unshift(next);
        else all[idx] = next;
        saveResumes(all);
        return next;
      });
    },
    [],
  );

  return { resume, update };
}
