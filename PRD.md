# Product Requirements Document
# AI Learning Paths — Personalized AI Curriculum Generator

**Version:** 1.0  
**Date:** 2026-03-03  
**Status:** Approved — Build

---

## 1. Overview

AI Learning Paths is a web app that generates fully personalized AI/ML learning curriculums. A user completes a short onboarding questionnaire; the app uses Claude to produce a structured, actionable learning path with curated resources, hands-on projects, and milestones — tailored to their background, goals, and available time.

---

## 2. Pages

1. **Landing page** (`/`) — value prop, how it works, example paths, CTA
2. **Onboarding form** (`/onboarding`) — multi-step: skill level, goal, time, style, domain, email
3. **Results page** (`/results`) — generated path with modules, projects, milestones; free tier locks modules 3+
4. **Dashboard** (`/dashboard`) — saved paths, progress tracking
5. **Pricing page** (`/pricing`) — Free / Starter $19 one-time / Pro $29/month

---

## 3. Stack

- Next.js 14 (App Router) + Tailwind CSS
- Anthropic Claude API (claude-3-5-sonnet) for curriculum generation
- Stripe Checkout: one-time (Starter) + subscription (Pro)
- Vercel deployment
- localStorage for MVP data persistence (no DB in v1)

---

## 4. Pricing

| Tier | Price | Features |
|---|---|---|
| Free | $0 | Basic path, first 2 modules only |
| Starter | $19 one-time | Full path + 3 guided projects |
| Pro | $29/month | Everything + monthly new projects + Q&A |

---

## 5. Environment Variables

```
ANTHROPIC_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_BASE_URL=
```

---

## 6. MVP Scope

In: all 5 pages, Stripe payments, Claude generation, localStorage persistence, mobile responsive.
Out: full auth, DB, email delivery, analytics.
