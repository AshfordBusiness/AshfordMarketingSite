---
name: Ashford Integrations
description: A clean, familiar agency page done to a high finish. White ground, green-black ink, one committed green, Notion-like tables as the illustration.
colors:
  ink: "#16211b"
  mute: "#4f5c55"
  accent: "#146c46"
  accent-deep: "#0e5436"
  accent-tint: "#e5f1ea"
  warn-ink: "#7a4f00"
  warn-tint: "#fff4dc"
  paper: "#ffffff"
  soft: "#f2f5f3"
  line: "#e2e7e4"
  on-ink-body: "#c9d6ce"
  on-ink-label: "#9fb5a8"
typography:
  display:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "clamp(40px, 4.5vw, 66px)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "clamp(32px, 3.6vw, 48px)"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  headline-close:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "clamp(34px, 4vw, 56px)"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  title-feature:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "clamp(26px, 2.6vw, 34px)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.015em"
  lede:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "clamp(17px, 1.4vw, 19px)"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
  button:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.55
  nav:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.55
  table:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.55
    fontFeature: "tnum"
  caption:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.55
rounded:
  icon: "12px"
  window: "14px"
  card: "20px"
  panel: "24px"
  band: "28px"
  pill: "999px"
spacing:
  gutter: "clamp(16px, 4vw, 56px)"
  container: "1240px"
  section: "clamp(64px, 9vw, 120px)"
  section-head: "clamp(36px, 5vw, 56px)"
  column-gap: "clamp(32px, 5vw, 72px)"
  card-gap: "16px"
  inner-gap: "14px"
  button-gap: "12px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.paper}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "15px 24px"
  button-primary-hover:
    backgroundColor: "{colors.accent-deep}"
    textColor: "{colors.paper}"
  button-nav:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "11px 18px"
  button-nav-hover:
    backgroundColor: "#000000"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "15px 24px"
  status-tag:
    backgroundColor: "{colors.accent-tint}"
    textColor: "{colors.accent-deep}"
    rounded: "{rounded.pill}"
    padding: "3px 10px"
  status-tag-due:
    backgroundColor: "{colors.warn-tint}"
    textColor: "{colors.warn-ink}"
    rounded: "{rounded.pill}"
    padding: "3px 10px"
  window:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.table}"
    rounded: "{rounded.window}"
    padding: "18px 20px"
  illustration-panel:
    backgroundColor: "{colors.soft}"
    rounded: "{rounded.panel}"
    padding: "clamp(14px, 2vw, 28px)"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "clamp(24px, 3vw, 36px)"
  feature-card:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.card}"
    padding: "clamp(28px, 3.5vw, 44px)"
  closing-band:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.band}"
    padding: "clamp(40px, 6vw, 80px)"
  icon-tile:
    backgroundColor: "{colors.accent-tint}"
    textColor: "{colors.accent}"
    rounded: "{rounded.icon}"
    size: "44px"
    padding: "10px"
  marked-gap:
    backgroundColor: "#f7f9f8"
    textColor: "{colors.mute}"
    rounded: "{rounded.window}"
    padding: "16px 18px"
  header:
    backgroundColor: "rgba(255, 255, 255, 0.92)"
    textColor: "{colors.ink}"
    typography: "{typography.nav}"
    height: "76px"
---

# Design System: Ashford Integrations

## Overview

**Creative North Star: "The Operations Dashboard"**

The page reads like a tidy, familiar workspace that someone competent has already set up for you. It is a category-standard modern agency page played straight and finished carefully: white ground, deep green-black ink, one committed green, soft grey-green bands, and a single typeface. Nothing is there to impress; everything is there to be understood by a busy owner in one pass.

The illustrative material is the product's own habitat. Instead of photography, gradients or robot imagery, the page shows small Notion-like windows: a titled table, hairline rows, status pills, tabular numbers. Each one is plainly labelled as illustrative. The one committed green does the selling (the primary pill, ticks, icon strokes, the castle mark) and the ink colour does the weight (the headline, the feature card, the closing band).

Density is relaxed and editorial. Sections breathe on generous vertical padding, content sits in a 1240px container, and headings are heavy and tightly tracked so short, plain sentences carry the page. The build refuses the generic AI look (gradients, glow, robot icons) and the stiff consultancy look (navy, serif gravitas, stock handshakes).

**Key Characteristics:**
- White and soft grey-green bands alternate; two ink surfaces bookend the page.
- One chromatic accent, a deep committed green, plus an amber used only as a "due" status inside tables.
- Figtree throughout, heavy (800) headings with negative tracking, 17px body.
- Every action is a fully rounded pill.
- Flat, hairline-bordered surfaces; only the hero illustration and the primary pill lift.
- Notion-like table windows, labelled "Illustrative", are the only imagery besides the client logo.

## Colors

A quiet, nearly monochrome green-grey world with one saturated green and a single warm status colour.

### Primary
- **Committed Green** (accent): the only accent. Primary pill background, focus ring, text selection, nav link hover, tick and icon strokes, the castle mark, inline text links in case cards. White text on it passes AA at body size (6.4:1).
- **Deep Green** (accent-deep): hover state of the primary pill; text colour inside green status tags.
- **Green Wash** (accent-tint): status tag fill and icon tile fill. Never a section background.

### Tertiary
- **Due Amber** (warn-ink on warn-tint): exists only as the "due" variant of the status tag inside illustrative tables. It signals a pending follow-up; it is not a second brand colour.

### Neutral
- **Green-Black Ink** (ink): all headings and body copy on light grounds, the nav pill, the feature card and the closing band.
- **Moss Grey** (mute): secondary copy, ledes, table captions, footer. Holds 6.4:1 or better on every light ground used.
- **Paper White** (paper): page ground, cards, table windows, header (at 92% opacity with blur).
- **Soft Sage** (soft): alternating section bands and the hero illustration panel.
- **Hairline** (line): every 1px border and table rule, and the outline pill's 1.5px border.
- **On-Ink Body** (on-ink-body): paragraph text on ink surfaces (11:1).
- **On-Ink Label** (on-ink-label): definition-list labels on the feature card (7.6:1).

### Named Rules
**The One Green Rule.** The committed green is the only chromatic accent. Amber appears only as a status inside an illustrative table. No gradients, no glow, no second brand hue.

**The Green Ink Rule.** Neutrals are tinted towards the green hue (around 160 degrees). Do not introduce pure greys or pure black surfaces; the one exception is the nav pill's hover (#000).

## Typography

**Display Font:** Figtree (self-hosted variable woff2, weights 300 to 900, with system-ui, sans-serif)
**Body Font:** Figtree
**Label/Mono Font:** none distinct; tables use Figtree with tabular numerals.

**Character:** one friendly geometric sans at two temperatures. Heavy, tightly tracked headings give the page its confidence; the regular body at 17px on a 1.55 line height keeps it approachable.

### Hierarchy
- **Display** (800, clamp 40px to 66px, 1.02, -0.035em): the hero headline only.
- **Headline** (800, clamp 32px to 48px, 1.08, -0.025em): section headings, always a short plain sentence ending in a full stop.
- **Headline Close** (800, clamp 34px to 56px, 1.08): the closing band's heading, one step larger than section headings.
- **Title Feature** (700, clamp 26px to 34px): the feature card's heading.
- **Title** (700, 22px, 1.08, -0.015em): build names, step names, case names.
- **Lede** (400, clamp 17px to 19px, 1.55, moss grey, max 46ch): the paragraph under the hero headline and the Teach heading.
- **Body** (400, 17px, 1.55): all running copy; secondary paragraphs are held to 32ch to 44ch.
- **Button** (600, 16px): pill labels.
- **Nav** (500, 15px): header links.
- **Table** (400, 14px, tabular numerals): window rows; window titles are 15px 700.
- **Caption** (500, 12px): "Illustrative" labels, status tags, the illustrative-data note.

All headings use `text-wrap: balance`; paragraphs use `text-wrap: pretty`.

### Named Rules
**The One Family Rule.** Figtree only, in weights 400, 500, 600, 700 and 800. Hierarchy comes from size, weight and tracking, never from a second face.

**The Plain Sentence Rule.** Headings are short declarative sentences with a full stop. No eyebrows or kickers above them.

## Layout

A single centred container (1240px max) with a fluid side gutter (16px to 56px). Sections stack vertically on generous padding (64px to 120px) and alternate between paper and soft sage bands. The closing band sits inside the container with zero top padding so it follows the Work section directly.

Section heads are a two-column grid: the headline on the left, a short moss-grey paragraph on the right, bottom-aligned, with 36px to 56px below. The hero is a 1.2fr / 1fr grid (copy left, illustration right, vertically centred). The build section pairs the ink feature card (1.1fr) with a four-row list card (1fr) of equal height. Steps are three equal columns, each topped by a 2px ink rule. Teach and Work are two equal columns. Card gaps are 16px; inner gaps between windows are 14px; pill groups gap at 12px.

The header is sticky, 76px tall, translucent white with a saturate and blur backdrop; it gains a hairline bottom border once the page scrolls past 8px. Anchor jumps offset by 88px so headings clear it.

**Responsive:** at 900px and below, every two- and three-column grid collapses to one column, header text links hide (the "Book a call" pill stays), and steps gap at 28px. At 420px and below, the header shrinks to 64px, the wordmark to 16px, the nav pill tightens, and build list icons stack above their text.

## Elevation & Depth

Flat by default. Surfaces are separated by tonal bands (paper against soft sage), 1px hairline borders and the two ink surfaces, not by shadow. Exactly two soft, negatively spread shadows exist, both cast downward and tinted towards the green-black ink.

### Shadow Vocabulary
- **Illustration lift** (`box-shadow: 0 30px 60px -30px rgba(20,40,30,.35)`): the hero illustration panel only, so the product mock floats above the page.
- **Primary pill lift** (`box-shadow: 0 8px 18px -10px rgba(10,20,15,.45)`): the green pill on light grounds. Removed on the closing band, where the ink ground already gives contrast.

### Named Rules
**The Two Shadows Rule.** Only the hero illustration and the primary pill lift. Cards, windows and bands stay flat with hairlines. No hard offset shadows, no glow.

## Shapes

Soft, generous rounding that scales with the size of the surface: 12px on icon tiles, 14px on table windows and marked gaps, 20px on cards and the feature card, 24px on the hero illustration panel, 28px on the closing band, and fully round (999px) on every pill, status tag and focus ring. Borders are 1px hairlines, 1.5px on the outline pill and the dashed marked gap, and 2px ink rules above steps. The castle-tower mark is the one hard-edged silhouette and appears only in the header and as the favicon.

**The Scale-With-Size Rule.** Larger containers get larger radii; a nested surface always has a smaller radius than its parent (panel 24 over window 14; band 28 over pill 999 is the deliberate exception, as pills are always round).

## Components

### Buttons
Friendly, confident, always pill-shaped.
- **Shape:** fully round (999px), inline-flex with an 8px gap for an optional 16px arrow icon.
- **Primary (green):** committed green, white label, 15px by 24px, 600 weight, with the primary pill lift. Hover darkens to deep green and rises 1px. One primary per view: the hero, the closing band.
- **Nav (ink):** green-black ink, white label, 11px by 18px at 15px. Hover goes to black. Lives only in the header.
- **Outline:** transparent with a 1.5px hairline border and ink label. Hover darkens the border to ink. The secondary action beside a primary, or the only action in the Teach line.
- **Focus:** a 3px committed green outline, offset 3px, fully rounded.
- **Transitions:** background, transform and shadow at 0.2s.

### Status Tags
- **Style:** 12px, 600 weight, 3px by 10px, fully round. Green wash with deep green text for done states ("Updated", "Call booked"); amber wash with amber ink for due states ("3 due", "Follow up Tue").
- **Behaviour:** background and colour transition over 0.5s. In the hero, one tag flips from due to "Followed up" 1.8s after load, unless reduced motion is requested.

### Cards / Containers
- **Card:** paper, 1px hairline, 20px radius, 24px to 36px padding, flat. Used for case studies, the Teach "Who it is for" window and the build list.
- **Feature card:** green-black ink, 20px radius, 28px to 44px padding, on-ink body text, a definition list with on-ink labels, and a white table window nested at the bottom.
- **Closing band:** green-black ink, 28px radius, 40px to 80px padding, two columns (heading and paragraph left, contact stack right, bottom-aligned).

### Table Window (signature)
The house illustration. A paper window with a 1px hairline and 14px radius, 18px by 20px padding. A 15px bold title row with a 12px moss "Illustrative" label at the right; below, a full-width table at 14px with tabular numerals, 10px row padding, hairline rules between rows and the last cell right-aligned (usually a status tag or a number). In the hero, windows sit in a soft sage panel with the illustration lift and a caption: "Illustrative data, not a client screenshot."

### Build List Item
A 44px icon tile (green wash, green 2px line icon, 12px radius) beside a 22px title and a 16px moss description, 24px vertical padding, hairline between items. Collapses to icon above text at 420px.

### Marked Gap
A dashed 1.5px border in a light grey-green, 14px radius, near-white fill, 14px moss text reading "To add before launch: ...". It holds the place of proof that has not yet been supplied and pushes to the bottom of its card. It is a temporary state: it disappears when a real result or quote arrives, and it is never replaced with invented content.

### Navigation
Brand (castle mark, 30 by 27px, plus "Ashford Integrations" at 18px 800) on the left; three anchor links at 15px 500 and the ink nav pill on the right, 32px apart. Link hover turns committed green. Below 900px only the brand and the pill remain.

### Motion
Two moments only, both skipped under reduced motion: the hero panel rises 18px from 60% opacity over 0.9s on `cubic-bezier(.16,1,.3,1)`, and one status tag flips from due to done after 1.8s. Interaction transitions run at 0.2s (pills) and 0.3s (header border).

## Do's and Don'ts

### Do:
- **Do** keep the committed green (#146c46) as the only accent, used for the primary action, ticks, icon strokes, links and focus.
- **Do** illustrate with Notion-like table windows and label each one "Illustrative".
- **Do** make every action a fully rounded pill: green for the primary, ink in the header, outline for the secondary.
- **Do** alternate paper and soft sage bands, and keep ink surfaces to the feature card and the closing band.
- **Do** write headings as short plain sentences in Figtree 800 with negative tracking.
- **Do** keep surfaces flat with 1px hairlines; lift only the hero illustration and the primary pill.
- **Do** show missing proof as a marked gap until the real result or quote is supplied.
- **Do** collapse to one column at 900px and keep the "Book a call" pill visible at every width.

### Don't:
- **Don't** use gradients, glow, robot or sparkle imagery, or any second brand hue.
- **Don't** use amber outside a due status tag.
- **Don't** add a second typeface, a serif, or a system display face.
- **Don't** put eyebrows or kickers above headings.
- **Don't** add shadows to cards, windows or bands, and never use hard offset shadows.
- **Don't** present illustrative data as a client screenshot, or fill a marked gap with invented figures or quotes.
- **Don't** turn the icon tile into a general feature-grid device; it belongs to the build list.
