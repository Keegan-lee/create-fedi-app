# create-fedi-app Design System

## Theme

Dark only. Near-black background with warm-tinted neutrals. Scene: developer at desk, dim room, terminal glow.

## Color Palette (OKLCH)

| Token | Value | Usage |
|-------|-------|-------|
| bg | oklch(0.145 0.008 55) | Page background |
| surface | oklch(0.185 0.008 55) | Sections, panels |
| surface-2 | oklch(0.225 0.008 55) | Hover, code bg |
| border | oklch(0.95 0.005 55 / 0.08) | Dividers |
| accent | oklch(0.68 0.19 45) | CTAs, links, signal |
| accent-dim | oklch(0.68 0.19 45 / 0.15) | Glow, highlights |
| text | oklch(0.93 0.012 75) | Primary text |
| text-muted | oklch(0.62 0.012 75) | Body secondary |
| text-subtle | oklch(0.42 0.01 75) | Labels, meta |

## Typography

- Display: Bricolage Grotesque (headings, module names)
- Body: DM Sans (paragraphs, UI)
- Mono: JetBrains Mono (code, API identifiers only)

Scale ratio ≥1.25 between heading steps. Body line-height 1.65. Max 65ch line length.

## Radii

4px tags, 8px inputs/buttons, 12px panels (max).

## Motion

ease-out-quart (`cubic-bezier(0.25, 1, 0.5, 1)`). Staggered fade-up on hero load. No bounce.

## Components

- Terminal window: surface bg, border, title bar with copy control
- API flow diagram: SVG nodes with orange connection lines
- Section rhythm: alternating surface/bg bands, asymmetric grids
