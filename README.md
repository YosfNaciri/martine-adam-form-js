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
- `/demande-acces` : demande publique d’un lien d’accès Supabase
- `/ouverture-dossier` : formulaire protégé par la session du lien email
- `/confirmation` : confirmation après une soumission réussie

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

## Power Automate

Set `VITE_POWER_AUTOMATE_WEBHOOK_URL` to the URL of a Power Automate flow using
the **When an HTTP request is received** trigger. The secondary submit button
sends the form as JSON; uploaded files are included in `files` with their name,
MIME type, size, field name, and Base64 content in `content_base64`.
