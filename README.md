# Next.js + BlockNote + Supabase

A small notes app: you sign up, log in and write notes in the [BlockNote](https://www.blocknotejs.org) editor. Each note is saved in [Supabase](https://supabase.com), and only you can see your own notes.

This branch builds on two things:

- [`main`](https://github.com/cederdorff/nextjs-blocknote/tree/main): BlockNote in Next.js, without a backend.
- [`nextjs-supabase-auth`](https://github.com/cederdorff/nextjs-supabase-auth): sign up, log in and log out with Supabase Auth. The auth code here is the same.

## Requirements

- Node.js 20.9 or newer
- A free Supabase account

## Setup

### 1. Get the code

```bash
git clone https://github.com/cederdorff/nextjs-blocknote.git
cd nextjs-blocknote
git switch supabase-notes
npm install
```

### 2. Create a Supabase project

Go to [supabase.com/dashboard](https://supabase.com/dashboard), click **New project**, and give it a name and a database password.

### 3. Add your keys to `.env.local`

In your Supabase project, click **Connect** at the top (or go to **Project Settings → API Keys**). Copy the **Project URL** and the **publishable key**.

Create a file called `.env.local` in the root of the project, next to `package.json`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

- `.env.local` is ignored by Git, so your keys stay on your computer.
- Variables that start with `NEXT_PUBLIC_` are sent to the browser. The publishable key is made for that. Never put the **secret** key in a `NEXT_PUBLIC_` variable.

### 4. Create the `notes` table

In Supabase, open **SQL Editor**, paste everything from [`supabase/migrations/20261116120000_create_notes.sql`](supabase/migrations/20261116120000_create_notes.sql) and click **Run**.

The SQL creates:

| Column | Type | What it is |
|---|---|---|
| `id` | `uuid` | The note's id. Created by the database. |
| `user_id` | `uuid` | The user who owns the note. Set automatically to the logged-in user (`auth.uid()`). |
| `title` | `text` | The title. |
| `content` | `jsonb` | The BlockNote document: an array of blocks, saved as JSON. |
| `created_at`, `updated_at` | `timestamptz` | When the note was created and last saved. |

It also turns on **Row Level Security (RLS)** and adds policies, so a user can only read, create, change and delete rows where `user_id` is their own id. The check happens in the database, so it works no matter what the app sends.

### 5. Turn off email confirmation (for local testing)

Go to **Authentication → Sign In / Providers → Email** and turn off **Confirm email**.

When it is on, new users must click a link in an email before they can log in. That is a good idea in a real app, but it slows you down while you are testing.

### 6. Start the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You are not logged in, so you are sent to `/login`.

## Testing

### Automated checks

```bash
npm run lint    # ESLint
npm run build   # production build, catches build errors
```

### Try it yourself

1. **Sign up:** go to `/signup`, enter an email and a password (at least 6 characters). You land on **My notes**, and your email is shown in the header.
2. **Create a note:** click **New note**. You are taken to `/notes/<id>`.
3. **Write and save:** change the title, write in the editor (try typing `/` for headings and lists) and click **Save**.
4. **Reload:** reload the page. The title and the content are still there.
5. **See the data:** in Supabase, open **Table Editor → notes**. Your note is there, and `content` holds the blocks as JSON.
6. **Delete:** click **Delete** and confirm. You are back on the list, and the note is gone.
7. **Log out:** click **Log out** in the header. Going to `/` now sends you to `/login`.
8. **RLS:** sign up as a second user. The list is empty. Paste the URL of the first user's note: you get "Page not found", because the database doesn't return the row.

## How it works

### Files

**Auth** (the same as in `nextjs-supabase-auth`)

| File | What it does |
|---|---|
| [`src/lib/supabase/server.js`](src/lib/supabase/server.js) | Creates a Supabase client on the server that reads the session from the cookies. |
| [`src/proxy.js`](src/proxy.js) | Runs before every request and refreshes the session when it has expired. |
| [`src/lib/auth.js`](src/lib/auth.js) | `getCurrentUser()` returns the logged-in user, or `null`. |
| [`src/app/signup/page.js`](src/app/signup/page.js), [`src/app/login/page.js`](src/app/login/page.js) | Forms with a Server Action that calls `signUp` or `signInWithPassword`. |
| [`src/components/AuthStatus.js`](src/components/AuthStatus.js) | Shows your email and **Log out** in the header, or **Log in**. |

**Notes**

| File | What it does |
|---|---|
| [`src/lib/actions.js`](src/lib/actions.js) | Server Actions: `signOut`, `createNote`, `updateNote` and `deleteNote`. |
| [`src/app/page.js`](src/app/page.js) | **My notes**: checks the user, fetches the notes and shows the list. |
| [`src/app/notes/[id]/page.js`](src/app/notes/[id]/page.js) | Fetches one note by the id in the URL and shows `NoteEditor`. |
| [`src/components/NoteEditor.js`](src/components/NoteEditor.js) | Title, editor and the **Save** and **Delete** buttons. |

**Editor** (the same as on `main`)

| File | What it does |
|---|---|
| [`src/components/Editor.js`](src/components/Editor.js) | The BlockNote editor. Starts with the saved content and reports every change. |
| [`src/components/DynamicEditor.js`](src/components/DynamicEditor.js) | Loads `Editor` only in the browser (`ssr: false`), because BlockNote can't run on the server. |

### What happens when you click Save

1. While you type, `Editor` calls `onChange` with `editor.document`, and `NoteEditor` keeps it in state as `content`.
2. **Save** calls the Server Action `updateNote(id, title, content)`.
3. `updateNote` runs on the server and updates the row in Supabase.
4. RLS checks in the database that the note belongs to you.
5. Next time the page loads, the server fetches the note, and `Editor` starts with the saved `content`.

### Protecting pages

Every page that needs a login starts the same way:

```js
const user = await getCurrentUser();

if (!user) {
  redirect("/login");
}
```

The check runs on the server, before any HTML is sent. RLS is the second layer: even if a page forgot the check, the database would not return other users' notes.

## Scripts

- `npm run dev`: start the development server
- `npm run build`: build for production
- `npm start`: run the production build
- `npm run lint`: run ESLint
