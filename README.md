# Experiential

Local volunteer opportunities for students, and the tools to show the work they did.

Live site: [experiential.care](https://www.experiential.care)

## What it does

- **Browse & apply**: search volunteer opportunities by keyword, category, and distance, then apply with an optional resume.
- **Track hours**: log volunteer hours, set a goal, and export the log as CSV.
- **Resume builder**: build a one-page resume and download it as a PDF.
- **College guides**: reading, service scholarships, and an application checklist.
- **For organizations**: post opportunities, review applicants, and accept or decline them.
- **Pro**: a $4.99/month plan that lists a student's applications first for organizations.

## Stack

React 18 + TypeScript, Vite, Tailwind CSS with shadcn/ui, TanStack Query, and Supabase (auth, Postgres, storage, edge functions). Stripe handles Pro billing through Supabase edge functions.

## How it was built

I prototyped the first version in Lovable, an AI app builder, in summer 2025, which is why most early commits come from its bot account, gpt-engineer-app. From there I took it to production myself: Vercel deployment and routing, the Google sign-in flow, terms and privacy pages, the iOS build with Capacitor, mobile optimization, and an October 2026 redesign that fixed the core flows. Experiential won 1st place at the Bloom Business Accelerator and was piloted by Mentor College.

## Development

```bash
npm install
npm run dev      # http://localhost:8080
npm run build
```

Supabase settings live in `src/integrations/supabase/client.ts`. Database migrations are in `supabase/migrations`.

## Design

Design tokens (color, radius, shadows) are defined in `src/index.css` and `tailwind.config.ts`. Display type is Poppins, matching the wordmark. UI text is Plus Jakarta Sans. The periwinkle period from the logo is the single accent mark, used for headline periods and active indicators.
