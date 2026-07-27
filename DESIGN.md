---
name: Randevu Sistemi
description: Self-hosted appointment management for Turkish local businesses
colors:
  deep:
    light: "#0e7c7b"
    dark: "#2dd4bf"
    role: primary
    displayName: Teal Pulse
  main:
    light: "#1b2430"
    dark: "#e5e7eb"
    role: text
    displayName: Deep Ink
  back:
    light: "#f5f6f7"
    dark: "#0f1419"
    role: background
    displayName: Soft Canvas
  surface:
    light: "#ffffff"
    dark: "#1b2430"
    role: surface
    displayName: Clean Slate
  waiting:
    light: "#d98e04"
    dark: "#fbbf24"
    role: semantic
    displayName: Amber Pending
  completed:
    light: "#3f7d53"
    dark: "#34d399"
    role: semantic
    displayName: Forest Done
  canceld:
    light: "#c1443c"
    dark: "#f87171"
    role: semantic
    displayName: Brick Alert
typography:
  display:
    fontFamily: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif
    fontSize: clamp(1.5rem, 4vw, 1.875rem)
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  headline:
    fontFamily: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif
    fontSize: clamp(1.25rem, 3vw, 1.5rem)
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.025em"
  body:
    fontFamily: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: normal
  label:
    fontFamily: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.05em"
rounded:
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  full: "9999px"
spacing:
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.deep}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "0.75rem 1rem"
  button-primary-hover:
    backgroundColor: "{colors.deep}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "0.75rem 1rem"
  button-secondary:
    backgroundColor: "{colors.main}"
    textColor: "{colors.main}"
    rounded: "{rounded.sm}"
    padding: "0.5rem 1rem"
  input-field:
    backgroundColor: "{colors.back}"
    textColor: "{colors.main}"
    rounded: "{rounded.sm}"
    padding: "0.75rem 1rem"
  card-auth:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.main}"
    rounded: "{rounded.lg}"
  card-dashboard:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.main}"
    rounded: "{rounded.md}"
---

# Design System: Randevu Sistemi

## Overview

**Creative North Star: "The Neighborhood Shopfront"**

Randevu Sistemi is the digital storefront for a local business — warm enough to feel like a familiar face, polished enough to earn trust on a first visit. It stands on the curb between informal "just text me" booking and impersonal enterprise SaaS, and it borrows from both: the approachability of the corner shop translated into clean, confident interface design.

The system speaks modern Turkish-local visual language: system fonts that load instantly and feel native, generous white space that signals competence, and a single vibrant teal accent that appears deliberately — in the primary button, the active nav state, the focus ring — rather than decorating every surface. It's a one-accent system by discipline, not by accident. The accent is the signature; its restraint is the craft.

Dark mode inverts the canvas without softening the confidence. Surfaces darken to near-black with tints pulled from the same ink-blue family, and the accent brightens to a luminous aqua that stays legible against deep backgrounds. Both modes share the same spatial grammar: floating cards, soft shadows, and a layout that recedes so the content can do the work.

**Key Characteristics:**
- Single vibrant accent (teal green) used deliberately on ~10% of any screen
- System font stack for instant, native-feeling typography
- Floating card surfaces with soft shadows (shadow-sm to shadow-xl)
- Dual-theme: light and dark modes that share the same structural language
- Responsive shell: persistent sidebar on desktop, FAB-activated drawer on mobile
- Turkish-first interface; no i18n abstraction layer

## Colors

A compact seven-color palette built around one accent, one text color, and four semantic status signals. Each color has a light and dark variant defined at the `:root` and `.dark` levels via CSS custom properties. The accent is the system's pulse; the rest stays neutral so content carries the screen.

### Primary
- **Teal Pulse** (#0e7c7b light / #2dd4bf dark): The sole accent. Used for primary buttons, active navigation states, focus rings, the sidebar logo, decorative underlines, and the mobile FAB. Its rarity is the point — when teal appears, it means action. In dark mode it brightens to a luminous aqua that stays fully legible against dark surfaces.

### Neutral
- **Deep Ink** (#1b2430 light / #e5e7eb dark): Primary text and icon color. A near-black navy in light mode that reads sharper than pure #000; inverts to a soft off-white in dark mode. Used everywhere body text, labels, and structural icons appear.
- **Soft Canvas** (#f5f6f7 light / #0f1419 dark): Page background. A whisper of cool gray in light mode that distinguishes the page from the white card surfaces above it; darkens to near-black in dark mode.
- **Clean Slate** (#ffffff light / #1b2430 dark): Card, surface, header, sidebar, and modal background. Pure white in light mode, dark ink in dark mode. The contrast between Canvas and Slate is what gives cards their floating depth.

### Semantic
- **Amber Pending** (#d98e04 light / #fbbf24 dark): The waiting state. Used for "pending" status badges, in-progress indicators, and the registration link accent. Warmer and more optimistic than a neutral would be.
- **Forest Done** (#3f7d53 light / #34d399 dark): The completed state. Used for "completed"/"confirmed" status badges and the footer copyright line at reduced opacity.
- **Brick Alert** (#c1443c light / #f87171 dark): The danger state. Used for "cancelled" status badges, the logout button, error messages (left-border accent), and destructive action links.

### Named Rules
**The One Accent Rule.** Teal Pulse appears on at most 10% of any given screen. If more than two elements are competing for it, the layout needs restructuring, not more teal. Its scarcity is the system's visual signature.

**The Semantic Separation Rule.** Waiting, completed, and canceld are semantic signals, not decorative palette extensions. They appear only in status contexts (badges, indicators, alerts). Never use them to color a heading, decorate a section, or supplement the accent.

## Typography

**Display Font:** System UI sans-serif (ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto)
**Body Font:** Same stack
**Label/Mono Font:** Not distinct; uses the body stack with uppercase tracking

**Character:** Native and immediate. The system font stack loads in zero milliseconds, feels indistinguishable from the OS chrome, and never competes with the content for attention. It's the typographic equivalent of a shopkeeper who knows your name — no pretense, just confidence.

### Hierarchy
- **Display** (extrabold 800, clamp(1.5rem, 4vw, 1.875rem), line-height 1.2, tracking -0.025em): Page titles and dashboard headings. Appears at most once per screen. The tight tracking and heavy weight make it land with authority.
- **Headline** (bold 700, clamp(1.25rem, 3vw, 1.5rem), line-height 1.3, tracking -0.025em): Section headers, card titles, form headings. Slightly looser than Display; sets the rhythm for a content block.
- **Body** (normal 400, 1rem, line-height 1.5, tracking normal): All running text, table cells, form labels, descriptions, and paragraph content. Comfortable reading line length is ~65 characters.
- **Label** (semibold 600, 0.75rem, line-height 1, tracking 0.05em, uppercase): Filter labels, table column headers, sidebar section titles, badge text. The tracking and uppercase provide structural contrast without a separate font.

### Named Rules
**The Zero-Load Rule.** No web fonts. The system font stack is the permanent choice — it loads instantly, adapts to the user's platform natively, and removes a network dependency. If the product ever grows into a branded identity, a custom font may be introduced, but the fallback stack stays this one.

## Layout

The system uses a single-column layout with an optional fixed sidebar. The sidebar is a 256px-wide surface that collapses into a slide-out drawer triggered by a fixed-position FAB at the `lg` breakpoint (1024px). Content areas offset by `lg:pl-64` on desktop.

**Container:** Max width `max-w-7xl` (80rem / 1280px) with horizontal padding that scales: `px-4` on mobile, `sm:px-6` on tablet. Content areas inside the shell use `p-4 sm:p-6 lg:p-8`.

**Grid:** Multi-column grids use Tailwind's responsive grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` for stat cards, `grid-cols-1 lg:grid-cols-3` for dashboard sections. Filter bars use `grid-cols-1 sm:grid-cols-2 lg:grid-cols-5`.

**Spacing rhythm:** Vertical spacing between sections uses the 2rem step (`space-y-8` for page-level sections, `space-y-6` for component clusters). Internal component padding uses the 0.75rem–1.5rem range. Gap between grid items is 1.5rem (`gap-6`).

**Responsive behavior:**
- Mobile (<640px): single column, full-width cards, FAB sidebar trigger, `px-4` padding
- Tablet (640–1023px): 2-column grids where applicable, same sidebar behavior as mobile
- Desktop (≥1024px): persistent sidebar, multi-column grids, generous padding

## Elevation & Depth

**Floating cards.** Depth is conveyed through a z-axis hierarchy of soft shadows. The page background sits at z0; cards and surfaces lift off it with `shadow-sm` (headers, dashboard cards, table containers), graduating to `shadow-xl` for focused, isolated forms like the login card. The mobile FAB uses `shadow-lg` to demand attention at the highest z-layer.

Surfaces are flat at rest in the sense that they have no internal relief — no inset shadows, no gradient overlays, no inner borders. The depth vocabulary is strictly between-surfaces, not within them. Dark mode preserves the same shadow values; the darker canvas makes them subtler but keeps the lift readable.

### Shadow Vocabulary
- **Rest** (`box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05)` — Tailwind shadow-sm): Headers, dashboard stat cards, table containers, filter panels. The default surface lift.
- **Focus** (`box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)` — Tailwind shadow-xl): Login and registration cards. The strongest lift; reserved for surfaces that demand the user's undivided attention.
- **Float** (`box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)` — Tailwind shadow-lg): The mobile FAB button. Used for the highest-z element on the page.

### Named Rules
**The Flat-At-Rest Rule.** Surfaces are flat internally. Shadows separate surfaces from each other but never decorate within a surface. No inset shadows, no gradient overlays, no inner borders on cards.

**The Three-Layer Rule.** Every screen has at most three distinct z-layers: background (Canvas), surface (Slate), and floating element (shadow-lg for FAB or shadow-xl for modal). If a fourth layer appears, the layout needs simplifying.

## Shapes

The system uses a consistent rounded-rectangle language throughout. Corners are never sharp (no `rounded-none`), never fully circular (except for the FAB and status badges), and scale predictably with element size:

- **Interactive elements** (buttons, inputs, selects): `rounded-lg` (0.5rem / 8px). Tight enough to feel precise, soft enough to feel approachable.
- **Container surfaces** (dashboard cards, filter panels): `rounded-xl` (0.75rem / 12px). A touch softer to visually separate them from interactive controls.
- **Focused surfaces** (auth cards, dialogs): `rounded-2xl` (1rem / 16px). The softest corner; signals that this surface is a destination, not a pass-through.
- **Fully rounded** (`rounded-full` / 9999px): Status badges, decorative underlines, the mobile FAB. Reserved for elements whose function benefits from a pill or circular silhouette.

**Borders** are present on cards and panels (`border border-main/10` in light, `border-gray-700` in dark) as a structural separator. The opacity `main/10` keeps them present but recessive — they define the shape without competing with the shadow for depth. Input borders use `main/20` at rest and swap to the accent on focus.

## Components

### Buttons

**Character:** Polished and confident. Buttons feel intentional — the teal primary is the loudest element on the page and the only place pure white text appears on a solid color.

- **Shape:** Rounded corners (0.5rem / 8px), full-width on mobile forms, auto-width in toolbars
- **Primary:** Solid teal background with white text (`bg-deep text-white`). Padding: `py-3 px-4`. Font: semibold (600).
- **Primary hover:** Opacity reduction to 90% (`hover:opacity-90`). A subtle fade rather than a color shift — keeps the accent consistent.
- **Primary focus:** Teal ring at 50% opacity with 2px offset (`focus:ring-2 focus:ring-deep/50 focus:ring-offset-2`).
- **Primary disabled:** 50% opacity, `cursor-not-allowed`.
- **Secondary (ghost):** Transparent background with text in the current text color, subtle background reveal on hover (`hover:bg-main/10`). Used for profile button, navigation links.
- **Destructive (logout):** Translucent red background (`bg-canceld/10`) with red text, deepens on hover (`hover:bg-canceld/20`).
- **Transition:** All buttons use `transition-all` for smooth hover/focus/disabled state changes.

### Form Inputs

- **Style:** Outlined with a 1px border at 20% text-color opacity (`border-main/20`), background matching the page canvas (`bg-back`), full width, rounded corners (0.5rem / 8px).
- **Padding:** `px-4 py-3` (1rem horizontal, 0.75rem vertical).
- **Typography:** Body font at 1rem, placeholder text in muted tone.
- **Focus:** Border color shifts to teal, outer ring appears at 20% teal opacity (`focus:border-deep focus:ring-2 focus:ring-deep/20`). Outline is removed (`outline-none`).
- **Select:** Same visual treatment as text inputs. The native chevron is preserved; no custom dropdown chrome.
- **Labels:** Block-level, small body font (0.875rem), medium weight (500), 0.5rem bottom margin.

### Cards / Containers

Two distinct card variants, differentiated by purpose rather than by name:

**Auth Card** (login, register):
- Radius: 1rem (16px) — the softest corner in the system
- Shadow: `shadow-xl` — strongest lift
- Padding: 2rem (`p-8`)
- Width: constrained to `max-w-md` (28rem / 448px)
- Background: surface color
- No border — the shadow alone provides separation

**Dashboard Card** (stats, quick actions, tables):
- Radius: 0.75rem (12px)
- Shadow: `shadow-sm` — default lift
- Padding: 1.5rem (`p-6`)
- Background: surface color
- Border: 1px solid at 10% opacity (`border border-main/10` light / `border-gray-700` dark)
- Hover (when clickable): shadow deepens to `hover:shadow-md`

### Status Badges

- **Shape:** Fully rounded pill (`rounded-full`), inline with `px-3 py-1`
- **Typography:** Extra-small (0.75rem), bold (700), uppercase, `whitespace-nowrap`
- **Variants by status:**
  - Pending: amber background at reduced opacity, dark amber text
  - Confirmed: green background at reduced opacity, dark green text
  - Completed: blue background at reduced opacity, dark blue text
  - Cancelled: red background at reduced opacity, dark red text
- **Dark mode:** Each variant inverts to a lighter text-on-darker-background scheme at matching hue

### Sidebar Navigation

- **Desktop:** Fixed 256px-wide vertical panel, full viewport height, surface background with a top border-line separator.
- **Mobile:** Slide-out drawer from the left edge with a 50%-opacity black backdrop overlay. Triggered by a circular teal FAB fixed to the bottom-right corner.
- **Navigation items:** Icon + label pairing, 0.5rem radius, `px-4 py-3` padding. Inactive state is muted text with transparent background; active state fills the teal accent with white text and a `shadow-sm`.
- **Logo area:** The product name in bold teal (extrabold 800, 1.25rem), with a role subtitle in muted text beneath it.

### Data Tables

- **Character:** Clean and readable. Tables use the full dashboard card container as their wrapper with `overflow-x-auto` for horizontal scroll on narrow screens.
- **Header:** Light gray background (`bg-gray-50` / `bg-gray-700/50`), uppercase label typography with wider tracking.
- **Rows:** White/transparent background, subtle hover highlight on mouseover.
- **Cell padding:** `px-6 py-4` (1.5rem horizontal, 1rem vertical).
- **Borders:** Subtle dividers between rows (`divide-gray-100` / `divide-gray-700`); no vertical dividers between columns.

### Loading & Error States

- **Page-level loading:** Centered vertical column at minimum 50vh. A 3rem spinning ring with a teal accent segment, plus descriptive text below.
- **Inline loading:** A 1.25rem spinner in amber, paired with "İşleniyor..." text, used during mutation pending states.
- **Error:** Left-border accent in the danger color (4px solid), with a muted background. Compact (`py-2 pl-3`), red text at medium weight.

## Do's and Don'ts

Concrete visual guardrails extracted from the implemented system.

### Do:
- **Do** use the teal accent only on interactive elements: buttons, links, focus rings, active nav states, and the FAB. Its scarcity is the signature.
- **Do** pair every interactive element with a focus ring (`focus:ring-2 focus:ring-deep/50 focus:ring-offset-2`).
- **Do** use the shadow scale predictably: `shadow-sm` for general surfaces, `shadow-xl` for focused/destination surfaces, `shadow-lg` for floating action elements.
- **Do** maintain the `back → surface` z-contrast: cards and panels must always sit on the background color, never on another card without a visual separator.
- **Do** keep the spacing rhythm in the 0.75rem–2rem range. Smaller gaps (0.5rem) are for icon-label pairs only.
- **Do** support the full dark mode palette for every custom component. The `.dark` class on `<html>` is the single source of truth.

### Don't:
- **Don't** introduce a second accent color. The system's identity depends on a single deliberate accent. If you need variety, use opacity or saturation variations of the existing palette.
- **Don't** use semantic colors (waiting, completed, canceld) outside status contexts. They are not decoration and not a palette extension.
- **Don't** apply shadows internally within a card surface. Depth is between surfaces, not inside them.
- **Don't** use hard corners (`rounded-none`) anywhere. The soft rectangle language is consistent throughout the system.
- **Don't** add web fonts. The system font stack is the permanent typographic choice. If a future brand identity requires a custom font, load it as an enhancement with the system stack as the fallback.
- **Don't** exceed three z-layers on any screen (background, surface, floating). If you need a fourth, restructure.
