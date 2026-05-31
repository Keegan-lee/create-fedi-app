# Visual Audit — Design System (Prompt 2.1)

**Date:** 2026-05-31  
**Scope:** `packages/ui` components, `templates/base/app/globals.css`, generated project at `/tmp/fedi-visual-audit`  
**Tooling:** `npx impeccable detect --json src/` (packages/ui), manual browser review at 390×844 viewport

---

## Anti-slop rules checklist

| # | Rule | Status | Notes |
|---|------|--------|-------|
| 1 | No Inter, Geist, or Space Grotesk | ✅ Pass | Bricolage Grotesque + DM Sans + JetBrains Mono via `next/font/google` |
| 2 | No purple/violet gradients or cyan-on-dark | ✅ Pass | Fedi orange `#FF6B35` accent only; no gradients |
| 3 | No glassmorphism, box-shadow glows, neon | ✅ Pass | Removed `shadow-sm` from Card; no glow effects |
| 4 | No side-tab accent borders on cards | ✅ Pass | Cards use uniform `border-[var(--color-border)]` |
| 5 | No icon-tile-stacked-above-heading | ✅ Pass | DemoSection is title + description only |
| 6 | No nested cards | ✅ Pass | Flat component hierarchy |
| 7 | No gradient text on headings/metrics | ✅ Pass | Solid `text-[var(--color-text)]` throughout |
| 8 | No hero eyebrow pills or 01/02/03 markers | ✅ Pass | Removed "Fedi Mini App" eyebrow from home page |
| 9 | No cream/beige backgrounds | ✅ Pass | `#0A0A0A` near-black background |
| 10 | No marketing buzzwords | ✅ Pass | Functional copy only |

---

## `npx impeccable detect` results

```
packages/ui/src/ → [] (zero issues)
templates/base/app/ → [] (zero issues)
```

---

## Component audit

### shadcn primitives (Button, Card, Badge, Input, Label, Separator)

- **Button:** Primary uses `--color-accent` (orange), not shadcn blue. Focus ring uses accent token.
- **Card:** Surface background, border token, no shadow. Radius `rounded-lg` (12px max).
- **Badge:** Changed from `rounded-full` to `rounded-sm` (4px tag radius per spec).
- **Input:** Border, surface, placeholder all use Fedi tokens.
- **Label:** Added `text-[var(--color-text)]` for proper contrast.
- **Separator:** Uses `--color-border`.

### Fedi components

- **SatsAmount:** Monospace tabular nums, no decoration.
- **ConnectionBadge:** Muted success green `#3D8B5F` (not neon emerald).
- **MiniAppLayout:** `max-w-[390px]`, `px-4`, `min-h-dvh`, wraps `FediSafeArea`.
- **DemoSection:** 20px heading / 14px body (1.43× ratio), 1.65 line-height, 75ch max width.
- **FediSafeArea:** `max(5rem, env(safe-area-inset-bottom, 20px))` + `pb-20` class.
- **LoadingSpinner:** CSS `@keyframes fedi-spin` with `linear` timing only.

---

## Font loading verification

Template `app/layout.tsx`:

- `Bricolage_Grotesque` → `--font-display`
- `DM_Sans` → `--font-body`
- `JetBrains_Mono` → `--font-mono`
- `body.className` applies DM Sans directly; headings use `font-[family-name:var(--font-display)]`

`globals.css` uses `@theme inline` so Tailwind font utilities resolve to next/font variables at runtime, with string fallbacks when next/font is absent (e.g. Vitest).

Build verification: `next build` on scaffolded project completed without font errors.

---

## Template fixes applied

| File | Issue | Fix |
|------|-------|-----|
| `templates/base/app/page.tsx` | Hero eyebrow pill, `#fff`, inline styles | Removed eyebrow; Fedi tokens; 390px layout + safe area |
| `templates/base/app/demo/page.tsx` | Inline style colors, no safe area | Token classes; safe-area padding |
| `templates/base/app/layout.tsx` | Body missing font class | Added `body.className antialiased` |
| `templates/base/app/globals.css` | Missing shadcn aliases, base styles | Synced with packages/ui globals |

---

## Border radius compliance

| Element | Radius | Spec |
|---------|--------|------|
| Badge / tags | 4px (`rounded-sm`) | ✅ |
| Button / Input | 8px (`rounded-md`) | ✅ |
| Card | 12px (`rounded-lg`) | ✅ max |

---

## Motion compliance

- LoadingSpinner: `ease-linear` rotation only
- Home CTA: `ease-[cubic-bezier(0.25,1,0.5,1)]` (ease-out-quart) opacity transition
- No bounce, elastic, or hover image zoom anywhere in audited files

---

## Remaining notes

- Generated projects do not yet depend on `@create-fedi-app/ui`; template pages mirror layout patterns inline. Module templates (webln, nostr) still use inline `#fff` — to be addressed in Prompts 2.2–2.3.
- `apps/www` uses Fumadocs theming separately; out of scope for this prompt.

---

## Sign-off

All Prompt 2.1 tasks complete. Design system is Impeccible-compliant for `packages/ui` and base template globals.
