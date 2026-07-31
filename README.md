# Kordran Landing

Industrial special-situations landing site for Kordran Group, Inc.

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
RESEND_API_KEY=re_xxxxxxxx
CONTACT_TO_EMAIL=contact@kordran.com
CONTACT_FROM_EMAIL="Kordran Website <noreply@yourdomain.com>"
```

Without `RESEND_API_KEY`, contact form submissions are validated and logged server-side so the UI flow can be tested.

## Pages

- `/` - landing page
- `/privacy` - privacy policy
- `/terms` - terms of use
- `POST /api/contact` - situation discussion form
