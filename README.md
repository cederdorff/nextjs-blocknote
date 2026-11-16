# Next.js + BlockNote

A minimal [Next.js](https://nextjs.org) (App Router) project with the [BlockNote](https://www.blocknotejs.org) block-based rich text editor, following the official [BlockNote Next.js guide](https://www.blocknotejs.org/docs/getting-started/nextjs).

## Requirements

- Node.js 20.9 or newer
- A free [Supabase](https://supabase.com) project

## Setup

### 1. Clone and install

```bash
git clone https://github.com/cederdorff/nextjs-blocknote.git
cd nextjs-blocknote
git switch supabase-notes
npm install
```

### 2. Add your Supabase keys

In the Supabase dashboard, click **Connect** at the top of your project (or go to **Project Settings → API Keys**) and copy the **Project URL** and the **publishable key**.

Create a file called `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

`.env.local` is ignored by Git, so your keys are never committed. Never put the `secret` / `service_role` key in a `NEXT_PUBLIC_` variable, because those values are sent to the browser.

### 3. Create the `notes` table

Open **SQL Editor** in the Supabase dashboard, paste the contents of [`supabase/migrations/20261116120000_create_notes.sql`](supabase/migrations/20261116120000_create_notes.sql) and click **Run**.

This creates the `notes` table with Row Level Security (RLS), so each user can only read and change their own notes.

### 4. Configure authentication

Go to **Authentication → Sign In / Providers → Email**:

- **Confirm email** is on by default. New users must click a link in their email before they can log in. Turn it off for faster local testing.
- If you keep it on, set **Authentication → URL Configuration → Site URL** to `http://localhost:3000`, so the confirmation link points to your local app.

### 5. Start the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You are redirected to `/login`.

## Testing

### Automated checks

```bash
npm run lint    # ESLint
npm run build   # production build, catches build and rendering errors
```

### Manual test

1. **Sign up:** go to `/login`, enter an email and a password (min. 6 characters) and click **Sign up**. You land on **My notes** (or see "Check your email" if email confirmation is on).
2. **Create a note:** click **New note**. You are taken to `/notes/<id>`.
3. **Auto-save:** change the title and write in the editor. The status changes from "Unsaved changes" → "Saving…" → "Saved" about 1 second after you stop typing.
4. **Persistence:** reload the page. The title and content are still there. In the Supabase dashboard, **Table Editor → notes** shows the row, with the editor content as JSON in `content`.
5. **List:** go back to **All notes**. The note is listed, newest first.
6. **Delete:** open the note, click **Delete** and confirm. You are taken back to the list, and the note is gone.
7. **Log out:** click **Log out**. Visiting `/` now redirects you to `/login`.
8. **Row Level Security:** sign up as a second user. The list is empty, and opening the first user's note URL (`/notes/<id>`) shows a 404.

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
