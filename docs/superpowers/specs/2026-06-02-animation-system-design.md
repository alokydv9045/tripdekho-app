# TripDekho Animation System Design Spec

**Date:** 2026-06-02  
**Status:** Approved  
**Reference:** `tripdekho_animated_blueprint.md`, Venture FZ interaction style  
**Scope:** All public-facing pages, admin sidebar, vendor sidebar

---

## Goal

Transform TripDekho from a visually static site into a premium, motion-rich travel platform. The feel target is: **warm, fast, purposeful, unmistakably yellow-themed**. Animation should never make the user wait — it should make the interface feel alive.

---

## 1. Motion Library

**Framer Motion** (already installed in `frontend/package.json`).

All animation values come from a single shared config file:

```
frontend/src/lib/motion.ts
```

No component should define its own timing or easing inline. All values reference the shared config.

---

## 2. Shared Motion Config (`src/lib/motion.ts`)

### Timing constants

```ts
export const duration = {
  micro:    0.12,   // button tap, icon flash
  fast:     0.18,   // dropdown open, input focus border
  standard: 0.22,   // card hover lift, tab indicator slide
  reveal:   0.45,   // section scroll reveal
  hero:     0.50,   // hero entry
};

export const stagger = {
  hero:  0.08,   // hero children (max 4 children)
  cards: 0.06,   // card grid stagger (max 6 cards)
};

export const ease = {
  smooth: [0.16, 1, 0.3, 1] as const,  // all entries
  out:    [0, 0, 0.2, 1] as const,      // hover exits
};
```

### Shared Framer variants

```ts
export const variants = {
  // Section / hero entry
  fadeInUp: {
    hidden:  { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: duration.reveal, ease: ease.smooth } },
  },
  fadeInLeft: {
    hidden:  { opacity: 0, x: -24 },
    visible: { opacity: 1, x: 0,  transition: { duration: duration.hero, ease: ease.smooth } },
  },
  fadeInRight: {
    hidden:  { opacity: 0, x: 24 },
    visible: { opacity: 1, x: 0,  transition: { duration: duration.hero, ease: ease.smooth } },
  },

  // Stagger container
  staggerContainer: {
    hidden:  {},
    visible: { transition: { staggerChildren: stagger.cards, delayChildren: 0 } },
  },
  heroStagger: {
    hidden:  {},
    visible: { transition: { staggerChildren: stagger.hero, delayChildren: 0 } },
  },

  // Stagger child
  staggerChild: {
    hidden:  { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: duration.reveal, ease: ease.smooth } },
  },

  // Page transition
  pageEnter: { opacity: 0, y: 8 },
  pageAnimate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: ease.smooth } },
  pageExit:  { opacity: 0, y: -8, transition: { duration: 0.15, ease: ease.out } },
};
```

---

## 3. New Shared Wrapper Components

All located in `frontend/src/components/shared/`.

### `SectionReveal.tsx`
- Uses `motion.div` with `whileInView="visible"` and `viewport={{ once: true, margin: "-80px" }}`
- Applies `variants.fadeInUp`
- Wraps any `<section>` or content block below the hero
- Accepts optional `delay` prop for minor offset tuning

### `StaggerGroup.tsx`
- Uses `motion.div` with `variants.staggerContainer` or `heroStagger`
- Wraps lists of children (cards, nav links, stats)
- Each direct child must use `motion.div` with `variants.staggerChild`

### `AnimatedCard.tsx`
- `motion.div` with `whileHover={{ y: -6, boxShadow: "var(--shadow-card-hover)" }}`
- Transition: `{ duration: 0.22, ease: [0,0,0.2,1] }`
- Drop-in replacement for any card wrapper div

### `AnimatedButton.tsx`
- `motion.button` or wraps any `<button>` children
- `whileHover={{ scale: 1.03 }}`, `whileTap={{ scale: 0.96 }}`
- Transition: `{ duration: 0.12 }`
- Used for all CTA buttons, submit buttons, icon buttons

### `PageTransition.tsx`
- `AnimatePresence` + `motion.div` wrapping page content
- Applied in root `layout.tsx` around `<main>`
- Uses `pageEnter/pageAnimate/pageExit` variants
- Key = `pathname` from `usePathname()`

### `useReducedMotion` hook
- Import from `framer-motion` directly: `import { useReducedMotion } from 'framer-motion'`
- All animated components check this — if true, use `opacity` only (no transforms)

---

## 4. Design Token Upgrade

### `globals.css` additions

```css
:root {
  /* Upgraded palette */
  --bg-cream:          #FFFBF0;    /* warm ivory — page background */
  --gold-primary:      #F5C400;    /* deeper, richer gold — CTAs */
  --gold-hover:        #E0B000;    /* pressed / hover state */
  --charcoal:          #1A1A1A;    /* headings */
  --text-muted:        #6B5E3A;    /* body, labels */
  --surface:           #FFFEF7;    /* card/panel background */
  --border-warm:       rgba(245,196,0,0.18); /* card/input borders */

  /* Shadow system */
  --shadow-card:       0 4px 24px -4px rgba(115,92,0,0.08), 0 1px 4px rgba(0,0,0,0.04);
  --shadow-card-hover: 0 16px 48px -8px rgba(115,92,0,0.16), 0 4px 12px rgba(0,0,0,0.06);
  --shadow-button:     0 8px 24px -4px rgba(245,196,0,0.35);
  --shadow-button-hover: 0 12px 32px -4px rgba(245,196,0,0.50);
}
```

### Typography utilities (added to `globals.css`)

```css
.heading-display {
  font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.05;
  color: var(--charcoal);
}

.label-caps {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
}
```

### `tailwind.config.js` extensions

```js
extend: {
  borderRadius: {
    card:  '20px',
    input: '14px',
    pill:  '9999px',
    chip:  '10px',
  },
  boxShadow: {
    card:        'var(--shadow-card)',
    'card-hover':'var(--shadow-card-hover)',
    button:      'var(--shadow-button)',
    'button-hover':'var(--shadow-button-hover)',
  },
  colors: {
    cream:   '#FFFBF0',
    gold: {
      DEFAULT: '#F5C400',
      hover:   '#E0B000',
      light:   '#FFF8D6',
    },
  },
  transitionTimingFunction: {
    smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
    'ease-out-expo': 'cubic-bezier(0, 0, 0.2, 1)',
  },
}
```

---

## 5. Per-Page Animation Map

### Landing Page (`/`)

| Component | Animation |
|---|---|
| `HeroSection` left card | `variants.fadeInLeft`, hero stagger on children |
| Hero headline | `staggerChild` — fires first |
| Hero subtext | `staggerChild` — fires second (+80ms) |
| `HeroSearchBox` | `staggerChild` — fires third (+160ms) |
| Hero stats strip | `staggerChild` — fires fourth (+240ms) |
| Hero right image | `variants.fadeInRight` + continuous `y: [0, -12, 0]` float loop (7s) |
| `FloatingIcons` | Framer `motion.div` per icon, `y` keyframe loop, staggered entry by index |
| All sections below hero | Wrapped in `<SectionReveal>` |
| Trip card grids | Wrapped in `<StaggerGroup>`, each card = `<AnimatedCard>` |
| All buttons (CTAs, search) | `<AnimatedButton>` wrapper |
| Header nav links | CSS `hover:` underline slide (no Framer needed — too small) |
| Header Login button | `whileHover: scale(1.03)` + `box-shadow` grow |

### Auth Pages (`/login`, `/register`)

| Component | Animation |
|---|---|
| Auth card | `fadeInUp` on mount, `scale: 0.97 → 1` |
| Tab switcher indicator | `motion.div` with `layoutId="auth-tab-indicator"` — slides between tabs |
| Tab content switch | `AnimatePresence` + `fadeInUp` per panel |
| Input fields | CSS: `transition: border-color 150ms, box-shadow 150ms` — gold glow on `:focus` |
| Password eye toggle | `whileTap: { rotate: 10 }` (micro, 120ms) |
| Submit button | `AnimatedButton` + loading spinner with `animate: { rotate: 360 }` loop |

### Trip Card Pages (search, category, listing)

| Component | Animation |
|---|---|
| Card grid | `<StaggerGroup>` — 60ms per card, max 6 in stagger |
| Each card | `<AnimatedCard>` — `y: -6px` lift + shadow on hover |
| Card image | CSS `group-hover:scale-105` (200ms) |
| Price/badge chip | `whileHover: { scale: 1.08 }` (120ms) |

### Admin Sidebar

| Component | Animation |
|---|---|
| Active nav indicator | `motion.div` `layoutId="admin-nav-active"` slides between items |
| Nav item hover | CSS `hover:translate-x-0.5` — subtle nudge |
| Weather widget swap | `AnimatePresence` cross-fade between destinations |

### Vendor Sidebar

| Component | Animation |
|---|---|
| Active nav indicator | Same `layoutId` pattern as admin |
| Nav item hover | CSS nudge |

### Global (All Pages)

| Component | Animation |
|---|---|
| `PageTransition` in `layout.tsx` | `opacity + y: 8→0` on route enter, `opacity + y: -8` on exit |
| `FloatingSupport` button | `y: [0, -4, 0]` gentle bob loop (3s) |
| All `<button>` tags | `AnimatedButton` wrapper applied globally where appropriate |
| `prefers-reduced-motion` | All transforms disabled, only opacity retained |

---

## 6. Timing Calibration Summary

| Interaction | Duration | Delay | Rule |
|---|---|---|---|
| Button hover scale | 120ms | 0 | Must feel instant |
| Button tap | 80ms | 0 | Snappiest |
| Input focus glow | 150ms | 0 | Responsive to user |
| Dropdown open | 180ms | 0 | No perceived lag |
| Card hover lift | 220ms | 0 | Smooth, not sluggish |
| Tab slide | 220ms | 0 | Deliberate feel |
| Hero entry | 500ms | 0 | Worth one beat |
| Hero children stagger | 400ms | +80ms/child | Max 4 children |
| Section reveal | 450ms | 0 (viewport trigger) | Content "arrives" |
| Card stagger | 380ms | +60ms/card | Max 6 cards |
| Page transition | 200ms in/out | 0 | Total 400ms, still fast |
| Float ambient | 6–9s loop | staggered | Barely noticeable |

**Anti-patterns:**  
No stagger >80ms per child. No stagger >6 levels. No spring on large elements. No bounce easing. No Y-offset reveals on mobile card grids. All motion respects `prefers-reduced-motion`.

---

## 7. Implementation Order

1. `motion.ts` config file — shared timing/easing/variants
2. `globals.css` — token upgrade (colors, shadows, typography)
3. `tailwind.config.js` — radius, shadow, color extensions
4. Shared wrappers: `SectionReveal`, `StaggerGroup`, `AnimatedCard`, `AnimatedButton`, `PageTransition`
5. `layout.tsx` — `PageTransition` integration
6. Landing page — HeroSection, FloatingIcons, all sections
7. Auth pages — card entry, tab switcher, field focus, button
8. Trip card listing pages
9. Admin + Vendor sidebars

---

## 8. Acceptance Criteria

- [ ] Homepage hero animates in on load with staggered children
- [ ] All sections below the fold reveal smoothly on scroll (once)
- [ ] Every button has `whileHover` scale + `whileTap` feedback
- [ ] Card grids stagger in with lift-on-hover
- [ ] Auth tab switcher has sliding indicator via `layoutId`
- [ ] Auth card animates in on mount
- [ ] Page transitions work between all routes
- [ ] `prefers-reduced-motion` collapses all transforms to opacity
- [ ] No animation has a stagger delay >80ms per child
- [ ] Yellow/cream palette is consistent across all pages
- [ ] Zero hydration errors from animations (all client-side Framer usage is in `"use client"` components)
