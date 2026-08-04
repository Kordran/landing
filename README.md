# Kordran Landing

Supply-chain value recovery landing site for Kordran Group, Inc.

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

Optional:

```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXX
GOOGLE_SITE_VERIFICATION=xxxxxxxx
RESEND_API_KEY=re_xxxxxxxx
CONTACT_TO_EMAIL=contact@kordran.com
CONTACT_FROM_EMAIL="Kordran Website <noreply@yourdomain.com>"
```

Without `RESEND_API_KEY`, contact form submissions are validated and logged server-side so the UI flow can be tested.

`GOOGLE_SITE_VERIFICATION` populates the Google Search Console meta tag when set.

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

Production site URL: https://kordran.com
