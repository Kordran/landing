# Kordran Landing

Supply-chain value recovery landing site for Kordran Inc.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS v4

## Develop

```bash
npm install
npm run dev
```

## Environment

Required for contact-form storage:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

`SUPABASE_SERVICE_ROLE_KEY` is server-only. Never expose it in client code or
rename it with a `NEXT_PUBLIC_` prefix.

Optional:

```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXX
GOOGLE_SITE_VERIFICATION=xxxxxxxx
RESEND_API_KEY=re_xxxxxxxx
CONTACT_TO_EMAIL=contact@kordran.com
CONTACT_FROM_EMAIL="Kordran Website <noreply@yourdomain.com>"
```

Without `RESEND_API_KEY`, contact submissions are still stored in Supabase and
marked `not_configured` for notification status.

`GOOGLE_SITE_VERIFICATION` populates the Google Search Console meta tag when set.

## Supabase

The contact form writes to `public.contact_submissions` through the server-only
route at `POST /api/contact`. Row Level Security is enabled and no browser role
has access to the table.

Apply the schema in
`supabase/migrations/20260806_create_contact_submissions.sql` to the existing
Supabase project. With the Supabase CLI linked to the project:

```bash
npx supabase db push
```

Alternatively, run the migration contents in the Supabase SQL editor. After the
migration is applied, add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to the
deployment environment and redeploy.

## Pages and discovery

- `/` - landing page
- `/privacy` - privacy policy
- `/terms` - terms of use
- `POST /api/contact` - situation discussion form
- `/robots.txt` - crawl rules
- `/sitemap.xml` - indexable URLs
- `/llms.txt` - short summary for LLM agents
- `/llms-full.txt` - fuller plain-text site summary for LLM agents
- `/manifest.webmanifest` - web app manifest
- Open Graph / Twitter images generated via App Router conventions
- Brand logos: `public/logos/`
- Favicons: `public/favicon.ico`, `public/favicon.svg`, `public/favicon-96x96.png`, `public/apple-touch-icon.png`, `public/web-app-manifest-*.png`

Production site URL: https://kordran.com
