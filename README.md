# Next.js + BlockNote

A minimal [Next.js](https://nextjs.org) (App Router) project with the [BlockNote](https://www.blocknotejs.org) block-based rich text editor, following the official [BlockNote Next.js guide](https://www.blocknotejs.org/docs/getting-started/nextjs).

## Requirements

- Node.js 20.9 or newer

## Setup

```bash
git clone https://github.com/cederdorff/nextjs-blocknote.git
cd nextjs-blocknote
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

No environment variables or backend are needed. For a version that saves notes to Supabase with login, see the [`supabase-notes`](https://github.com/cederdorff/nextjs-blocknote/tree/supabase-notes) branch.

## Testing

### Automated checks

```bash
npm run lint    # ESLint
npm run build   # production build, catches build and rendering errors
```

### Manual test

1. **Editor loads:** open [http://localhost:3000](http://localhost:3000). The heading and an empty editor are shown, with no errors in the browser console.
2. **Typing:** click in the editor and write some text.
3. **Slash menu:** type `/` and pick a block type, e.g. **Heading 1** or **Bullet List**.
4. **Formatting:** select text. The formatting toolbar appears, and **Bold**/**Italic** work.
5. **Drag handle:** hover a block, and use the `⋮⋮` handle to drag it to a new position.
6. **No server rendering:** reload the page. The editor appears after the page loads, without hydration errors in the console.

Content is not saved. It disappears when you reload, which is expected on this branch.

## How it works

BlockNote only runs in the browser, so the editor is split into two files:

| File | Purpose |
|---|---|
| [`src/components/Editor.js`](src/components/Editor.js) | Creates the editor with `useCreateBlockNote` and renders it with `BlockNoteView`. |
| [`src/components/DynamicEditor.js`](src/components/DynamicEditor.js) | Loads `Editor` with `next/dynamic` and `ssr: false`, so it is never rendered on the server. |
| [`src/app/page.js`](src/app/page.js) | A Server Component that imports and renders the dynamic editor. |

`dynamic(..., { ssr: false })` is only allowed in Client Components, which is why the wrapper lives in its own `"use client"` file instead of in `page.js`.

## Scripts

- `npm run dev`: start the development server
- `npm run build`: build for production
- `npm start`: run the production build
- `npm run lint`: run ESLint
