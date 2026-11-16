# Next.js + BlockNote

A minimal [Next.js](https://nextjs.org) (App Router) project with the [BlockNote](https://www.blocknotejs.org) block-based rich text editor, following the official [BlockNote Next.js guide](https://www.blocknotejs.org/docs/getting-started/nextjs).

## Getting started

1. Create `.env.local` with your Supabase project values:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
   ```

2. Run [`supabase/migrations/20261116120000_create_notes.sql`](supabase/migrations/20261116120000_create_notes.sql) in the Supabase SQL Editor. It creates the `notes` table with Row Level Security, so each user only sees their own notes.

3. Install and start:

   ```bash
   npm install
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## How it works

BlockNote only runs in the browser, so the editor is split into two files:

| File | Purpose |
|---|---|
| [`src/components/Editor.js`](src/components/Editor.js) | Creates the editor with `useCreateBlockNote` and renders it with `BlockNoteView`. |
| [`src/components/DynamicEditor.js`](src/components/DynamicEditor.js) | Loads `Editor` with `next/dynamic` and `ssr: false`, so it is never rendered on the server. |
| [`src/components/NoteEditor.js`](src/components/NoteEditor.js) | Title + editor for one note. Auto-saves 1 second after you stop typing. |

`dynamic(..., { ssr: false })` is only allowed in Client Components, which is why the wrapper lives in its own `"use client"` file instead of in `page.js`.

## Auth and data

- [`src/lib/supabase/`](src/lib/supabase/): Supabase clients for the browser, the server and the proxy (via `@supabase/ssr`).
- [`src/proxy.js`](src/proxy.js): refreshes the session on every request and redirects signed-out users to `/login`.
- [`src/app/login/`](src/app/login/): email + password login and sign-up with Server Actions.
- [`src/app/notes/actions.js`](src/app/notes/actions.js): create, update and delete notes. The BlockNote document is stored as JSON in `notes.content`.

## Scripts

- `npm run dev`: start the development server
- `npm run build`: build for production
- `npm start`: run the production build
- `npm run lint`: run ESLint
