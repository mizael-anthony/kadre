import { describe, expect, it } from "vitest";
import { demoResume } from "./demo";
import { createVariant } from "./variant";
import type { JobAnalysis } from "./types";

const job: JobAnalysis = {
  url: "", title: "Dev", company: "ACME", keywords: [], matched: [], missing: [],
  score: 70, suggestions: [], sectionOrder: ["skills", "experiences"], priorityTech: [], analyzedAt: "",
};

describe("createVariant", () => {
  it("links to parent and leaves parent untouched", () => {
    const p = demoResume();
    const before = JSON.stringify(p);
    const v = createVariant(p, job);
    expect(v.parentId).toBe(p.id);
    expect(v.id).not.toBe(p.id);
    expect(JSON.stringify(p)).toBe(before);
  });
  it("does not add experiences or bullets", () => {
    const p = demoResume();
    const v = createVariant(p, job);
    expect(v.experiences.length).toBe(p.experiences.length);
    expect(v.experiences.map((e) => e.bullets.fr)).toEqual(p.experiences.map((e) => e.bullets.fr));
    expect(v.sectionOrder.slice(0, 2)).toEqual(["skills", "experiences"]);
  });
});
