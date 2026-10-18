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

## Development

```bash
npm install
npm run dev      # http://localhost:8080
npm run build
```

Supabase settings live in `src/integrations/supabase/client.ts`. Database migrations are in `supabase/migrations`.

## Design

Design tokens (color, radius, shadows) are defined in `src/index.css` and `tailwind.config.ts`. Display type is Poppins, matching the wordmark. UI text is Plus Jakarta Sans. The periwinkle period from the logo is the single accent mark, used for headline periods and active indicators.
