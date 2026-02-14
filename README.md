# 2026 Dunebroom Earth Day Art Contest

The official website for the 2026 Dunebroom Earth Day Art Contest — an art competition for children aged 5-17 celebrating our planet through art.

## Features

- **Homepage** — Contest information, rules, prizes, age groups, and how to register
- **Gallery** — Public digital gallery of approved Earth Day artwork
- **Submit** — Online registration form for artists to upload their artwork (no participation fee)
- **Admin Dashboard** — Password-protected panel to review, approve/reject, and feature submissions
- **Email Notifications** — Admin receives an email whenever a new submission comes in

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router) with TypeScript
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Supabase](https://supabase.com/) for Postgres database + image storage
- [Resend](https://resend.com/) for email notifications
- [Vercel](https://vercel.com/) for hosting

## Getting Started

1. Clone the repo
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with the required environment variables (Supabase URL, keys, Resend API key, admin password, admin email)
4. Run the SQL in `supabase-setup.sql` in your Supabase SQL Editor to create the database table and storage bucket
5. Start the dev server:
   ```bash
   npm run dev
   ```

## Contest Details

- **Age Groups**: 5-10 years, 11-17 years
- **Prizes per group**: 1st (₹5,100), 2nd (₹2,100), 3rd (₹1,100), 4 Honorary Mentions (₹501 each) — all with certificates
- **Submission Deadline**: April 22, 2026, 11:59 PM IST
- **Results**: May 30, 2026
- **No participation fee**
