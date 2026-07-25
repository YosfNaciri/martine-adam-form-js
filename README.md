# Martine Adam CPA — React + JavaScript + Tailwind

Projet Vite React en JSX, sans TypeScript.

## Installation

```bash
npm install
npm run dev
```

## Pages

- `/` : landing page
- `/nous-rejoindre` : formulaire stepper

## Supabase

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Then fill in your Supabase project URL and anon key.

Run the Supabase SQL schema for:

- `public.client_intake_submissions`
- `public.client_intake_documents`
- the private Storage bucket `intake-documents`
- the anon insert/upload RLS policies

The form inserts one row in `client_intake_submissions`, then uploads files to Storage and inserts their metadata in `client_intake_documents`.
