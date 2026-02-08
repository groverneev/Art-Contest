# Art Contest Website

## What This Project Is
An art contest website where artists submit artwork, an admin reviews/approves it, and the public browses a gallery. Built for a small-scale contest (~50-100 submissions).

## Tech Stack
- **Next.js 16** (App Router) with TypeScript
- **Tailwind CSS** for styling
- **Supabase** for Postgres database + image storage (Storage Buckets)
- **Resend** for email notifications to admin on new submissions
- **Vercel** for hosting

## Architecture Overview

### Pages
- `/` — Homepage with hero + featured artwork preview
- `/gallery` — Public gallery: featured artwork at top, all approved artwork below
- `/submit` — Public form for artists to upload artwork
- `/admin` — Password-protected admin dashboard (password in `ADMIN_PASSWORD` env var)

### API Routes
- `POST /api/submit` — Handles public artwork submissions, uploads image to Supabase Storage, inserts DB row, sends email via Resend
- `GET /api/admin` — Fetches submissions (with optional status filter). Requires `x-admin-password` header
- `PATCH /api/admin` — Updates a submission (approve/reject/feature). Requires `x-admin-password` header
- `DELETE /api/admin` — Deletes a submission. Requires `x-admin-password` header
- `POST /api/admin/upload` — Admin uploads artwork on behalf of someone (auto-approved). Requires `x-admin-password` header

### Key Files
- `src/lib/supabase.ts` — Supabase client (public anon client + admin service role client)
- `src/lib/types.ts` — TypeScript types for the `Submission` interface
- `src/components/ArtworkCard.tsx` — Reusable card for displaying artwork
- `supabase-setup.sql` — SQL to run in Supabase dashboard to create the table and storage bucket

### Database
Single `submissions` table in Supabase Postgres. Schema is defined in `supabase-setup.sql`. Row Level Security is enabled — public can only read approved submissions and insert new ones. The service role key (used server-side only) bypasses RLS for admin operations.

### Image Storage
Images are stored in a Supabase Storage bucket called `artwork`. Public bucket — anyone can view images via URL. Uploaded images get a unique filename (`timestamp-random.ext`) to avoid collisions.

### Admin Auth
Simple password-based auth via `ADMIN_PASSWORD` env var. The password is sent in the `x-admin-password` header on every admin API request. No session/JWT — just a client-side password gate that stores the password in React state.

## Environment Variables
All defined in `.env.local` (gitignored). See `.env.local` for the list. The Supabase project is "ArtContest" under the neevgrover account.

## Tips for Future Work
- The `supabase` client in `src/lib/supabase.ts` can be null if env vars are missing (handled gracefully for build time). Always check for null in server components before querying.
- Homepage and gallery use `revalidate = 60` (ISR) — they refresh from the DB every 60 seconds.
- Admin uploads are auto-approved (`status: "approved"`, `uploaded_by_admin: true`).
- Resend free tier only sends from `onboarding@resend.dev` to the admin's own email. Fine for notifications.
- Next.js image domains are configured in `next.config.ts` for `*.supabase.co`.
