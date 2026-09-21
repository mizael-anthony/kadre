# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"Kadre" — a bilingual (French/English) CV builder SaaS MVP. The user enters a CV once, edits FR and EN side by side, picks one of three ATS-friendly templates (Classic, Modern, Minimal), and exports an A4 PDF in FR, EN, or bilingual (both pages). UI copy is in French. The demo content (`src/lib/cv/demo.ts`) must stay faithful to the original CV in `README.md`: English translations must not invent achievements.

## Commands

The package manager is Bun (`bun.lock`, `bunfig.toml`). npm also works, per the README.

```sh
bun install
bun run dev        # vite dev server
bun run build      # production build (nitro, Cloudflare target by default)
bun run build:dev  # development-mode build
bun run lint       # eslint .
bun run format     # prettier --write .
npx tsc --noEmit   # typecheck (no script defined)
```

There is no test suite.

`bunfig.toml` enforces a 24h `minimumReleaseAge` supply-chain guard. Confirm with the user before adding entries to `minimumReleaseAgeExcludes`.

## Lovable constraints

This repo is synced with Lovable (see `AGENTS.md`). Do not force-push or rewrite pushed history (rebase, amend or squash). Keep `main` in a working state, because pushes sync back into the Lovable editor.

`vite.config.ts` uses `@lovable.dev/vite-tanstack-config`, which already registers tanstackStart, React, Tailwind, tsconfig paths, nitro, the `@` alias and devtools. Do not add these plugins again. Pass extra config through `defineConfig({ vite: {...} })`.

## Architecture

- **Stack:** TanStack Start (SSR, file-based routing) + React 19 + Tailwind v4 + shadcn/ui (`src/components/ui/`, generated; `components.json`).
- **Routing:** `src/routes/`: `/` is the landing page, `/dashboard` lists CVs, and `/builder/$id` is the editor. `src/routes/README.md` covers the conventions: `$param` for dynamic segments, and `__root.tsx` is the only root layout (no Next.js-style `pages/` or `app/`). `src/routeTree.gen.ts` is auto-generated, so never edit it.
- **Server entry:** `src/server.ts` wraps the TanStack server entry to turn SSR crashes (including h3's swallowed 500 JSON bodies) into an HTML error page. `src/start.ts` adds error and CSRF middleware. Defining `start.ts` disables the default CSRF middleware, which is why it is added back explicitly.

### Bilingual data model (`src/lib/cv/types.ts`)

- Translatable text uses `Loc = { fr, en }` or `LocList = { fr: string[], en: string[] }` (headline, summary, role, bullets, degree, and so on).
- Shared, non-translated data stays plain: dates, company and school names, tech lists, URLs.
- A `Resume` stores `sectionOrder` and `hiddenSections` (both `SectionKey[]`) plus the chosen `template`.
- To add a section, update `SectionKey`/`SECTION_KEYS`, `SECTION_LABELS` in `src/lib/cv/i18n.ts`, `hasContent` in `templates/shared.ts`, all three templates, and `BuilderForm`.
- Static UI and section labels live in `src/lib/cv/i18n.ts` (`t()`, `sectionLabel()`).

### Persistence (`src/lib/cv/storage.ts`)

All data lives in `localStorage` under the key `cvforge.resumes.v1`, and the demo resume is seeded on first load. The `useResumes()` and `useResume(id)` hooks are the only access layer; `update(mutate)` clones the resume, applies the change, bumps `updatedAt` and saves. The layer is deliberately small so it can later be swapped for Supabase or auth. Keep new persistence behind these hooks.

Storage is client-only (it guards on `typeof window`). Pages render a skeleton while the resume is `undefined` and a not-found state when it is `null`.

### Rendering and PDF export (`src/components/cv/`)

- `ResumePaper.tsx`: `ResumeContent` chooses the template component; `ScaledPreview` scales a 794px-wide (A4 at 96dpi) `.cv-page` down to fit the preview column.
- The PDF comes from the browser's print dialog, not a PDF library. `PrintDocument` portals one `.cv-page` per language into `#print-root` on `<body>`, and the `@media print` rules in `src/styles.css` hide everything else. The builder mounts the portal and then calls `window.print()` after a short timeout.
- Templates (`templates/*Template.tsx`) take `{ resume, lang }` and use the helpers in `templates/shared.ts` (`visibleSections`, `dateRange`, `fullName`). Resume colors are print-safe tokens in `styles.css`.
- `AiAssistButton.tsx`: the "IA" button on text fields is a Pro paywall teaser only. It opens an info dialog and never generates or changes content.
