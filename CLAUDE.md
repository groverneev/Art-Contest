# 2026 Dunebroom Earth Day Art Contest

## IMPORTANT: Keep Documentation Updated
After making significant changes to the codebase (new features, schema changes, page rewrites, etc.), always update this CLAUDE.md and README.md to reflect the current state of the project. Do not leave stale documentation.

## What This Project Is
The official website for the 2026 Dunebroom Earth Day Art Contest — an art competition for children aged 5-17. Artists submit original Earth Day-themed artwork, an admin reviews/approves it, and the public browses a digital gallery. Built for a small-scale contest (~50-100 submissions). Prizes are awarded in two age groups.

## Tech Stack
- **Next.js 16** (App Router) with TypeScript
- **Tailwind CSS** for styling (emerald/teal earth-tone color scheme)
- **Supabase** for Postgres database + image storage (Storage Buckets)
- **Resend** for email notifications to admin on new submissions
- **Vercel** for hosting

## Architecture Overview

### Pages
- `/` — Homepage with hero, "Why Earth Day Matters", "Your Artistic Mission", age groups & prizes, rules, how to register, featured artwork, and CTA sections
- `/gallery` — Earth Day Art Gallery: featured artwork at top, all approved artwork below
- `/submit` — Public registration form for artists to upload artwork (no participation fee)
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
- `src/components/Navbar.tsx` — Sticky navigation with responsive brand name
- `src/components/Footer.tsx` — Simple copyright footer
- `supabase-setup.sql` — SQL to run in Supabase dashboard to create the table and storage bucket

### Database
Single `submissions` table in Supabase Postgres. Schema is defined in `supabase-setup.sql`. Columns:
- `id` (UUID, primary key)
- `artist_name` (TEXT, required)
- `age_group` (TEXT, required — "5 to 10 years" or "11 to 17 years")
- `artist_email` (TEXT, required — parent/guardian email)
- `artist_phone` (TEXT, optional)
- `title` (TEXT, required)
- `story` (TEXT, required — artist's story about themselves and their inspiration)
- `image_url` (TEXT, required)
- `status` (TEXT — "pending", "approved", or "rejected")
- `is_featured` (BOOLEAN)
- `uploaded_by_admin` (BOOLEAN)
- `created_at` (TIMESTAMPTZ)

Row Level Security is enabled — public can only read approved submissions and insert new ones. The service role key (used server-side only) bypasses RLS for admin operations.

### Submission Form Fields
1. Artist's Name (required)
2. Age Group (required dropdown: "5 to 10 years" or "11 to 17 years")
3. Parent/Guardian Email (required)
4. Phone Number (optional)
5. Artwork Title (required)
6. Tell Us Your Story (required — "Please write a few lines about yourself and what inspired your Earth Day artwork.")
7. Artwork Image Upload (required)

### Image Storage
Images are stored in a Supabase Storage bucket called `artwork`. Public bucket — anyone can view images via URL. Uploaded images get a unique filename (`timestamp-random.ext`) to avoid collisions.

### Admin Auth
Simple password-based auth via `ADMIN_PASSWORD` env var. The password is sent in the `x-admin-password` header on every admin API request. No session/JWT — just a client-side password gate that stores the password in React state.

### Color Scheme
Earth-tone palette using Tailwind's built-in colors:
- Primary: `emerald-700` / `emerald-800` (buttons, headings, accents)
- Light: `emerald-50` / `emerald-100` (backgrounds, hover states)
- Hero gradient: `from-emerald-700 to-teal-800`
- Focus rings: `emerald-600`

## Contest Details
- **Age Groups**: 5-10 years, 11-17 years
- **Prizes per group**: 1st (₹5,100), 2nd (₹2,100), 3rd (₹1,100), 4 Honorary Mentions (₹501 each) — all with certificates
- **Submission Deadline**: April 22, 2026, 11:59 PM IST (Earth Day)
- **Results**: May 30, 2026
- **No participation fee**

## Environment Variables
All defined in `.env.local` (gitignored). See `.env.local` for the list. The Supabase project is "ArtContest" under the neevgrover account.

## Tips for Future Work
- The `supabase` client in `src/lib/supabase.ts` can be null if env vars are missing (handled gracefully for build time). Always check for null in server components before querying.
- Homepage and gallery use `revalidate = 60` (ISR) — they refresh from the DB every 60 seconds.
- Admin uploads are auto-approved (`status: "approved"`, `uploaded_by_admin: true`).
- Resend free tier only sends from `onboarding@resend.dev` to the admin's own email. Fine for notifications.
- Next.js image domains are configured in `next.config.ts` for `*.supabase.co`.
