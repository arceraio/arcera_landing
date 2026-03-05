# CSS Refactor — Shared Stylesheet Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Extract all shared CSS from 8 inline `<style>` blocks into a single `styles.css`, leaving only page-specific rules inline.

**Architecture:** Create one `styles.css` with global tokens, reset, nav, buttons, footer, and animations. Each HTML file keeps only layout and component CSS unique to that page. No build tools — pure static file with relative `<link>` tag.

**Tech Stack:** Vanilla HTML/CSS, no preprocessors, no bundler. Files served directly or via Netlify.

---

## What goes in styles.css vs. stays inline

### GLOBAL (styles.css)
| Category | Details |
|----------|---------|
| `:root` variables | Use index.html values (#333333 body, #595959 muted — these are the accessibility-corrected values) |
| Reset | `*, *::before, *::after` + `html`, `body` |
| Google Fonts | Single `@import` |
| Nav | `.nav-logo`, `.nav-links`, `.nav-link`, `.nav-cta`, `.nav-sub` |
| Buttons | `.btn-primary`, `.btn-ghost-light`, `.btn-ghost` |
| Animations | `@keyframes fadeUp` (14px offset), `@keyframes pulse` |
| Reveal | `.reveal`, `.reveal-delay-1/2/3/4/5` (IntersectionObserver hook classes) |
| Footer | `.site-footer` and all child classes |
| Grid texture | `.grid-bg` utility class |

### PAGE-SPECIFIC (stays inline per file)
| File | Keeps |
|------|-------|
| index.html | Hero, gap/stats, comparison, stories, how-it-works, CTA, mobile sticky bar |
| contact.html | Split layout, form, post-submit states |
| pricing.html | Pricing cards, featured modifier, grid layout |
| help.html | Accordion, hero |
| schedule.html | Calendly split layout |
| signin.html | Entire inverted color scheme (navy bg), card layout |
| hero.html | Video frame, trust ticker, modal |
| header.html | Utility bar, drawer, scroll behavior |

---

## Task 1: Create `styles.css` — Variables, Reset, Base

**Files:**
- Create: `styles.css`

**Step 1: Write the file**

```css
/* ─────────────────────────────────────────
   ARCERA — Global Stylesheet
   styles.css
───────────────────────────────────────── */

@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@300;400&display=swap');

/* ─── TOKENS ─── */
:root {
  --bg:      #F9F7F4;
  --navy:    #0D1B2A;
  --gold:    #C9A84C;
  --body:    #333333;
  --muted:   #595959;
  --divider: #E8E4DF;

  --font-serif: 'Cormorant Garamond', serif;
  --font-sans:  'DM Sans', sans-serif;
  --font-mono:  'DM Mono', monospace;

  --nav-height: 64px;
  --sub-height: 28px;
}

/* ─── RESET ─── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  font-family: var(--font-sans);
  background: var(--bg);
  color: var(--body);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}
```

**Step 2: Verify file exists**

```bash
ls /home/kevin/Apps/arcera_landing/styles.css
```
Expected: file listed

**Step 3: Commit**
```bash
cd /home/kevin/Apps/arcera_landing
git add styles.css
git commit -m "feat: create global styles.css with tokens and reset"
```

---

## Task 2: Add Nav to `styles.css`

**Files:**
- Modify: `styles.css`

**Step 1: Append nav CSS**

Source of truth: index.html nav styles (most recently updated with correct contrast values).

```css
/* ─── NAV ─── */
nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 56px;
  height: var(--nav-height);
  background: var(--navy);
  border-bottom: 1px solid rgba(201,168,76,0.15);
}

.nav-logo {
  font-family: var(--font-serif);
  font-weight: 400;
  font-size: 20px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--gold);
  text-decoration: none;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 36px;
}

.nav-link {
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(249,247,244,0.72);
  text-decoration: none;
  transition: color 0.2s;
}
.nav-link:hover { color: #F9F7F4; }

.nav-cta {
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding: 10px 24px;
  background: var(--gold);
  color: var(--navy);
  text-decoration: none;
  transition: background 0.2s;
}
.nav-cta:hover { background: #dbb95e; }

/* Utility bar beneath nav */
.nav-sub {
  text-align: center;
  padding: 7px 56px;
  background: rgba(201,168,76,0.09);
  border-bottom: 1px solid rgba(201,168,76,0.18);
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 400;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(249,247,244,0.62);
  position: fixed;
  top: var(--nav-height); left: 0; right: 0;
  z-index: 199;
}

@media (max-width: 860px) {
  nav { padding: 0 24px; }
  .nav-links { gap: 16px; }
  .nav-link { display: none; }
}
```

**Step 2: Commit**
```bash
git add styles.css
git commit -m "feat: add shared nav styles to styles.css"
```

---

## Task 3: Add Buttons, Animations, Reveal to `styles.css`

**Files:**
- Modify: `styles.css`

**Step 1: Append buttons, animations, reveal classes**

```css
/* ─── BUTTONS ─── */
.btn-primary {
  padding: 15px 36px;
  background: var(--gold);
  color: var(--navy);
  text-decoration: none;
  font-size: 10.5px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  position: relative;
  overflow: hidden;
  transition: color 0.3s;
  display: inline-block;
}
.btn-primary::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--bg);
  transform: translateX(-101%);
  transition: transform 0.4s cubic-bezier(0.4,0,0.2,1);
}
.btn-primary:hover::before { transform: translateX(0); }
.btn-primary span { position: relative; z-index: 1; }

.btn-ghost-light {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 300;
  color: rgba(249,247,244,0.5);
  text-decoration: none;
  border: 1px solid rgba(249,247,244,0.18);
  padding: 14px 28px;
  transition: color 0.2s, border-color 0.2s;
}
.btn-ghost-light:hover {
  color: rgba(249,247,244,0.85);
  border-color: rgba(249,247,244,0.4);
}

/* ─── ANIMATIONS ─── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%   { opacity: 0.8; transform: scale(1); }
  100% { opacity: 0;   transform: scale(2.2); }
}

/* ─── SCROLL REVEAL ─── */
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
.reveal-delay-1 { transition-delay: 0.1s; }
.reveal-delay-2 { transition-delay: 0.2s; }
.reveal-delay-3 { transition-delay: 0.3s; }
.reveal-delay-4 { transition-delay: 0.4s; }
.reveal-delay-5 { transition-delay: 0.5s; }

/* ─── GRID TEXTURE ─── */
.grid-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(201,168,76,0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(201,168,76,0.035) 1px, transparent 1px);
  background-size: 52px 52px;
  pointer-events: none;
}
```

**Step 2: Commit**
```bash
git add styles.css
git commit -m "feat: add buttons, animations, reveal utilities to styles.css"
```

---

## Task 4: Add Footer to `styles.css`

**Files:**
- Modify: `styles.css`

**Step 1: Read current footer CSS from index.html**

Find footer section in index.html (search for `.site-footer`).

**Step 2: Append footer CSS to styles.css**

Copy the entire `.site-footer`, `.footer-inner`, `.footer-brand`, `.footer-logo`, `.footer-tagline`, `.footer-links`, `.footer-link`, `.footer-bottom`, `.footer-copy`, `.footer-contact` definitions from index.html into styles.css.

**Step 3: Commit**
```bash
git add styles.css
git commit -m "feat: add shared footer styles to styles.css"
```

---

## Task 5: Update `index.html`

**Files:**
- Modify: `index.html`

**Step 1: Add `<link>` before existing `<style>` tag**

After the last Google Fonts `<link>` tag, add:
```html
<link rel="stylesheet" href="styles.css" />
```

**Step 2: Remove nav CSS from inline style block**

Delete these class definitions from index.html's `<style>`:
- `nav { ... }`
- `.nav-logo { ... }`
- `.nav-links { ... }`
- `.nav-link { ... }` and `.nav-link:hover`
- `.nav-cta { ... }` and `.nav-cta:hover`
- `.nav-sub { ... }`
- The `@media (max-width: 860px) { nav ... .nav-links ... .nav-link ... }` block

**Step 3: Remove button CSS from inline style block**

Delete: `.btn-primary { ... }` + `::before` + `:hover::before` + `span`
Delete: `.btn-ghost-light { ... }` + `:hover`

**Step 4: Remove animation + reveal CSS from inline style block**

Delete: `@keyframes fadeUp { ... }`
Delete: `.reveal { ... }`, `.reveal.visible { ... }`, all `.reveal-delay-*`

**Step 5: Remove footer CSS from inline style block**

Delete: `.site-footer { ... }` and all child classes.

**Step 6: Remove :root block and body reset from inline style**

Delete the `:root { ... }` block, `html { ... }`, and `body { ... }` since they now come from styles.css.

**Step 7: Open page in browser and verify**

```bash
open /home/kevin/Apps/arcera_landing/index.html
```
Check: nav renders, hero renders, footer renders, scroll reveals work, buttons have hover effect.

**Step 8: Commit**
```bash
git add index.html
git commit -m "refactor: extract shared CSS from index.html to styles.css"
```

---

## Task 6: Update `contact.html`

**Files:**
- Modify: `contact.html`

**Step 1: Add `<link rel="stylesheet" href="styles.css" />` before `<style>`**

**Step 2: Remove from inline style**
- `:root { ... }` block
- `html, body { ... }` base reset
- `*, *::before, *::after { ... }` reset
- `nav { ... }`, `.nav-logo`, `.nav-links`, `.nav-link`, `.nav-cta` and hover states
- `@keyframes fadeUp`
- `@media (max-width: 860px)` nav block

**Step 3: Verify page in browser — layout, form, nav all intact**

**Step 4: Commit**
```bash
git add contact.html
git commit -m "refactor: extract shared CSS from contact.html to styles.css"
```

---

## Task 7: Update `pricing.html`

**Files:**
- Modify: `pricing.html`

**Step 1: Add `<link rel="stylesheet" href="styles.css" />` before `<style>`**

**Step 2: Remove from inline style**
- `:root`, reset, `html`/`body`
- Nav classes
- `@keyframes fadeUp`
- `@media` nav block

**NOTE:** pricing.html uses `@keyframes fadeUpFeatured` — keep this inline (unique to pricing).

**Step 3: Verify pricing cards render correctly including featured card elevation**

**Step 4: Commit**
```bash
git add pricing.html
git commit -m "refactor: extract shared CSS from pricing.html to styles.css"
```

---

## Task 8: Update `help.html`

**Files:**
- Modify: `help.html`

**Step 1: Add `<link rel="stylesheet" href="styles.css" />` before `<style>`**

**Step 2: Remove from inline style**
- `:root`, reset, `html`/`body`
- Nav classes
- `@keyframes fadeUp`
- `@media` nav block

**NOTE:** help.html uses `@media (max-width: 640px)` — keep this inline.

**Step 3: Verify accordion works and help footer renders**

**Step 4: Commit**
```bash
git add help.html
git commit -m "refactor: extract shared CSS from help.html to styles.css"
```

---

## Task 9: Update `schedule.html`

**Files:**
- Modify: `schedule.html`

**Step 1: Add `<link rel="stylesheet" href="styles.css" />` before `<style>`**

**Step 2: Remove from inline style**
- `:root`, reset, `html`/`body`
- Nav classes
- `@keyframes fadeUp`

**Step 3: Verify Calendly embed renders and nav links work**

**Step 4: Commit**
```bash
git add schedule.html
git commit -m "refactor: extract shared CSS from schedule.html to styles.css"
```

---

## Task 10: Update `hero.html`

**Files:**
- Modify: `hero.html`

**Step 1: Add `<link rel="stylesheet" href="styles.css" />` before `<style>`**

**Step 2: Remove from inline style**
- `:root`, reset, `html`/`body`
- Nav classes (`.nav-logo`, `.nav-links`, `.nav-link`, `.nav-cta`)
- `@keyframes fadeUp`

**NOTE:** hero.html keeps:
- `@keyframes ticker` (trust bar scroll — unique)
- `@keyframes pulse` is defined globally in styles.css — remove from hero.html
- Trust bar, video frame, modal — all stay inline

**Step 3: Verify trust ticker animates, video modal opens, LA badge pulses**

**Step 4: Commit**
```bash
git add hero.html
git commit -m "refactor: extract shared CSS from hero.html to styles.css"
```

---

## Task 11: Update `header.html`

**Files:**
- Modify: `header.html`

**Step 1: Add `<link rel="stylesheet" href="styles.css" />` before `<style>`**

**Step 2: Remove from inline style**
- `:root`, reset, `html`/`body`
- `@keyframes fadeUp`

**NOTE:** header.html has a custom two-tier nav (`site-header`, `util-bar`, `main-nav`) — these do NOT use the shared `nav` class and must stay inline. Do NOT remove them.

**NOTE:** header.html defines `@keyframes scrollDrop` — keep inline (unique to this file).

**Step 3: Verify scroll hide/show works, drawer opens, utility bar displays correctly**

**Step 4: Commit**
```bash
git add header.html
git commit -m "refactor: extract shared CSS from header.html to styles.css"
```

---

## Task 12: Update `signin.html`

**Files:**
- Modify: `signin.html`

**Step 1: Add `<link rel="stylesheet" href="styles.css" />` before `<style>`**

**Step 2: Immediately override :root variables at top of inline style**

signin.html inverts the color scheme. Add this override at the top of the inline `<style>` block:
```css
:root {
  --bg: #0D1B2A;     /* navy background */
  --divider: #E0DBD4;
}
```
Then add a page-level body background:
```css
body { background: var(--navy); }
```

**Step 3: Remove from inline style**
- The existing `:root { ... }` block (replace with the slim override above)
- `*, *::before, *::after { ... }` reset
- `html, body` base
- `@keyframes fadeUp`

**NOTE:** signin.html has no nav at all — just a wordmark. Keep all card/form styles.

**Step 4: Verify sign-in card renders on navy background, gold focus underlines work**

**Step 5: Commit**
```bash
git add signin.html
git commit -m "refactor: extract shared CSS from signin.html to styles.css"
```

---

## Task 13: Final Cross-Page Verification

**Step 1: Open each page and check**

```bash
open /home/kevin/Apps/arcera_landing/index.html
open /home/kevin/Apps/arcera_landing/contact.html
open /home/kevin/Apps/arcera_landing/pricing.html
open /home/kevin/Apps/arcera_landing/help.html
open /home/kevin/Apps/arcera_landing/schedule.html
open /home/kevin/Apps/arcera_landing/hero.html
open /home/kevin/Apps/arcera_landing/header.html
open /home/kevin/Apps/arcera_landing/signin.html
```

**Checklist per page:**
- [ ] Nav renders (logo gold, links visible, CTA gold)
- [ ] Nav utility sub-bar shows LA neighborhoods
- [ ] Page-specific hero/content renders correctly
- [ ] No console errors about missing styles
- [ ] Hover states on nav links and buttons work
- [ ] Animations on load (fadeUp stagger)

**Step 2: Check styles.css is the only place nav is defined**

```bash
grep -rn "\.nav-logo {" /home/kevin/Apps/arcera_landing/*.html
```
Expected: no results (all moved to styles.css)

**Step 3: Check no duplicate :root blocks**

```bash
grep -rn ":root {" /home/kevin/Apps/arcera_landing/*.html
```
Expected: only signin.html (for its override)

**Step 4: Final commit**
```bash
git add -A
git commit -m "refactor: complete CSS extraction — all shared styles in styles.css"
```

---

## Summary

| Task | Action | Est. Lines Removed per File |
|------|--------|----------------------------|
| 1 | Create styles.css foundation | — |
| 2 | Add nav to styles.css | — |
| 3 | Add buttons + animations + reveal | — |
| 4 | Add footer to styles.css | — |
| 5 | Refactor index.html | ~180 lines |
| 6 | Refactor contact.html | ~90 lines |
| 7 | Refactor pricing.html | ~70 lines |
| 8 | Refactor help.html | ~70 lines |
| 9 | Refactor schedule.html | ~70 lines |
| 10 | Refactor hero.html | ~90 lines |
| 11 | Refactor header.html | ~40 lines |
| 12 | Refactor signin.html | ~60 lines |
| 13 | Verification | — |

**Total estimated reduction:** ~700 lines of duplicated CSS removed across HTML files, consolidated into one ~350-line `styles.css`.
