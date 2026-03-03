# Arcera Landing Page — CLAUDE.md

## Product Overview

**Arcera** is an AI-powered home documentation and insurance claims advocacy service for high-value homeowners.

**Tagline**: *"Be prepared, stay organized, and thrive."*

**Hero copy**:
- H1: "Your home is documented. Your family is protected."
- Sub: "Arcera combines AI-powered home documentation with vetted claims advocacy — so when disaster strikes, your proof is already done."

**Service area**: Los Angeles only (Palisades, Bel Air, Brentwood, Hancock Park, Malibu, Calabasas). This must appear prominently and repeatedly throughout the site.

---

## Target Audience

High-net-worth homeowners in LA. Both spouses must feel this is a sound, dignified investment.

**Tone**: Private estate attorney meets Chubb insurance. Not a tech startup. No startup-y language, no hype, no hustle.

---

## Tech Stack & Deployment

- **Framework**: React 18 + TypeScript
- **Build tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: lucide-react (thin line icons only)
- **Animations**: Subtle fade-in on scroll only — no flashy animations
- **Deployment**: **Netlify** (connect repo, auto-deploy on push)
- **No backend** — static site; contact form via Netlify Forms

---

## Design System

### Color Palette

```css
--color-bg:        #F9F7F4;  /* warm white/cream — default background */
--color-navy:      #0D1B2A;  /* deep navy — headers, footer, buttons */
--color-gold:      #C9A84C;  /* accent gold — CTAs, stat callouts, underlines */
--color-body:      #2C2C2C;  /* body text */
--color-muted:     #6B7280;  /* muted/secondary text */
--color-divider:   #E8E4DF;  /* section dividers */
```

### Typography

| Use | Font | Weight |
|-----|------|--------|
| H1, H2 headlines | Cormorant Garamond | 600 (serif = heritage + trust) |
| Body copy | DM Sans | 400 / 500 |
| Large stats/numbers | DM Mono or Space Mono | letter-spaced |

### Visual Language

- Generous vertical padding: 80–120px between sections (white space = premium)
- No gradients, no loud icons — thin line icons only
- Photography: warm LA interiors (wine cellars, entryways, art walls — Architectural Digest aesthetic)
- No startup-y animations; subtle fade-in on scroll only
- Split layouts: dark navy panel + high-end interior photo

### Frontend Aesthetics Guidance

```
DISTILLED_AESTHETICS_PROMPT = """
<frontend_aesthetics>
You tend to converge toward generic, "on distribution" outputs. In frontend design, this creates what users call the "AI slop" aesthetic. Avoid this: make creative, distinctive frontends that surprise and delight. Focus on:

Typography: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics.

Color & Theme: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes. Draw from IDE themes and cultural aesthetics for inspiration.

Motion: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions.

Backgrounds: Create atmosphere and depth rather than defaulting to solid colors. Layer CSS gradients, use geometric patterns, or add contextual effects that match the overall aesthetic.

Avoid generic AI-generated aesthetics:
- Overused font families (Inter, Roboto, Arial, system fonts)
- Clichéd color schemes (particularly purple gradients on white backgrounds)
- Predictable layouts and component patterns
- Cookie-cutter design that lacks context-specific character

Interpret creatively and make unexpected choices that feel genuinely designed for the context. Vary between light and dark themes, different fonts, different aesthetics. You still tend to converge on common choices (Space Grotesk, for example) across generations. Avoid this: it is critical that you think outside the box!
</frontend_aesthetics>
"""
```

---

## Site Structure (Multi-Page)

```
/              → Landing page (trust funnel — no pricing, no FAQ)
/pricing       → Dedicated pricing breakdown
/faq           → Objection-handling FAQ
/schedule      → Calendar embed (Calendly)
/contact       → Contact form → post-submit prompt to schedule
```

### Nav

Logo left · "Pricing" · "FAQ" · "Contact" (ghost links) · "Schedule a Call" (solid gold button) right

Beneath nav (subtle): *"Currently serving Los Angeles, CA"*

---

## Page Architecture

### / — Landing Page

**Level 1 — Hero**
- Split layout: dark navy left (copy) / right (high-end LA interior photo)
- H1: "Your home is documented. Your family is protected."
- Sub: "Arcera combines AI-powered home documentation with vetted claims advocacy — so when disaster strikes, your proof is already done."
- Primary CTA: "Schedule Your Strategy Call" → /schedule
- Secondary CTA (ghost): "See How It Works" (scroll anchor)

**Level 2 — The Gap**
- Section header: "Coverage is not the same as getting paid."
- Two large stat callouts side by side:
  - **7 days** (gold, DM Mono) — "Arcera clients"
  - **45 days** (muted gray, DM Mono) — "National average"
  - Caption: "Average time from claim submission to approval"
- Body: "Your homeowners policy covers the loss. Your documentation determines how much you actually receive — and how long it takes. Most homeowners only discover the gap after disaster has already arrived."

**Level 3 — Two Client Stories**

*Story 1 — Pacific Palisades*
- Label: "Pacific Palisades" (small caps, gold)
- Narrative: A client — successful, frequently traveling — signed up primarily for the YOLO AI recognition tool so his wife would have a record of everything while he was away. Four months later, a pipe burst in the wine cellar. The damage wasn't catastrophic — but it was significant. About $80,000 in wine and custom millwork. Because they had completed an Arcera walkthrough three weeks prior, they had timestamped video of the cellar and a complete inventory. The insurance company asked for proof of loss. They hit play. The claim was approved in 7 days. The national average is 45.
- Pull quote (large serif): "I didn't buy Arcera for the insurance payout. I bought it for the trust that Arcera will have my back."
- Outcome row: $80k recovered · 7-day approval · 0 receipts required

*Story 2 — Brentwood*
- Label: "Brentwood" (small caps, gold)
- Narrative: A couple returned from six weeks abroad to find a slow leak behind their kitchen had silently destroyed custom cabinetry, imported stone flooring, and the adjacent utility corridor. The insurance company's initial offer covered about a third of the actual loss — citing "gradual damage" as grounds to deny the full claim. Because they had completed an Arcera walkthrough before leaving, there was a timestamped record of the kitchen's exact condition six months prior. The Arcera-referred adjuster used that documentation to challenge the denial. The revised settlement was $95,000 — $62,000 more than the original offer. The adjuster's fee was 10% of the final settlement. Paid at close. Only because he won.
- Pull quote (large serif): "The insurance company said 'gradual damage.' Arcera's record said otherwise. That timestamp was worth more than any receipt."
- Outcome row: $95k final settlement · $62k above initial offer · 10% adjuster fee — paid at close

**Level 4 — How It Works**
Three-column card layout (minimal, clean):
1. **Document** — A 90-minute in-person AI-assisted walkthrough with the Arcera team. Serial numbers, provenance, high-value item inventory. We know what insurers actually require.
2. **Store & Monitor** — Your YOLO AI recognition account. Annual renewal walkthrough. Secure, timestamped documentation — updated as your home evolves.
3. **Defend** — Access to our vetted public adjuster network. California caps adjusters at 15% of settlement. Arcera clients pay 10%. You pay only if they increase your payout.

**Level 5 — CTA (No Pricing Here)**
- Full-width dark navy block
- Headline: "Take this off your plate."
- Sub: "Schedule your free 30-minute Onboarding & Strategy call. We'll walk you through documentation, set up your YOLO account, and assign your dedicated adjuster contact. No pressure. No commitment."
- Primary: "Schedule a Call" → /schedule (gold)
- Secondary: "See Pricing" → /pricing (ghost)
- Micro-copy: "Arcera currently serves Los Angeles homes only."

---

### /pricing — Pricing Page

Full transparent breakdown:
- **Onboarding**: $3,500 + $30 per documented high-value item
- **Monthly subscription**: documentation maintenance, YOLO account, annual walkthrough, preferred adjuster access
- **Adjuster fee**: 10% of final settlement (vs. California cap of 15%) — paid at close only if they win
- Small print: "Partial payment upfront. Remainder due at job completion."
- CTA: "Ready to get started?" → "Schedule a Call" → /schedule
- Service note: "Currently serving Los Angeles homes only."

---

### /faq — FAQ Page

Three accordion entries:

**"My insurance agent says I'm fully covered."**
And they're probably right — on paper. Coverage and claims are two different things. An agent sells the policy; we help you collect on it. The question isn't "am I covered?" — it's "how painful will it be to prove it?" We remove the pain.

**"Can't I just take photos on my phone?"**
You absolutely can. The difference is twofold: First, we document the right things — serial numbers, provenance details — that insurers actually require. Second, if a disaster hits, you're dealing with trauma. We deal with the insurance company. You don't want to be negotiating with an adjuster from a hotel room, trying to remember what was in your closet. We become your proxy.

**"It seems expensive."**
This is an investment. A single missing line item on a Proof of Loss can cost ten times our annual fee. What we're really selling is a guarantee that you won't leave money on the table at your most vulnerable moment. If it's about value: what is peace of mind worth to you?

CTA at bottom: "Still have questions? Talk to us." → /contact

---

### /schedule — Scheduling Page

- Headline: "Schedule Your Strategy Call"
- Sub: "30 minutes. No obligation. We'll walk you through how Arcera works and answer any questions about your specific home."
- Embed: Calendly widget
- Note: "Arcera currently serves Los Angeles homes only. If you're outside LA, join our waitlist."

---

### /contact — Contact Page

- Headline: "Get in Touch"
- Sub: "We'd love to learn about your home. Fill out the form below and we'll be in touch within one business day."
- LA qualifier (above form): "Arcera currently serves Los Angeles homes only."
- Form fields: First Name, Last Name, Email, Phone, Neighborhood / City, "Tell us about your home" (optional textarea)
- Submit: "Send Message" — handled via **Netlify Forms** (`netlify` attribute on `<form>`)
- Post-submit confirmation:
  - Headline: "We got your message."
  - Body: "We'll follow up within one business day. In the meantime, would you like to lock in a time on our calendar?"
  - CTA: "Schedule Your Strategy Call" → /schedule

---

## Footer

- Logo + tagline: "Be prepared, stay organized, and thrive."
- Links: Pricing · FAQ · Schedule a Call · Contact
- Micro-copy: "Currently serving Los Angeles, CA"
- Contact: support@arcera.io · 925-708-6664

---

## Netlify Setup

- Connect GitHub repo → Netlify auto-deploy on push to `main`
- Build command: `vite build`
- Publish directory: `dist`
- Contact form: use `netlify` attribute + hidden `form-name` input on the `/contact` form
- Environment variables: set in Netlify dashboard (not in code)

---

## Related Project

| Path | Purpose |
|------|---------|
| `~/Apps/Arcera` | Main app — Supabase frontend + Python Flask backend |

---

## Development Constraints

- Max 500 lines per component file
- WCAG AA accessibility compliance
- All images need alt text
- No gradients, no loud colors — strict design system adherence
- Responsive: mobile-first, but primary audience is desktop
