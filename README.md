# Next.js + BlockNote

A minimal [Next.js](https://nextjs.org) (App Router) project with the [BlockNote](https://www.blocknotejs.org) block-based rich text editor, following the official [BlockNote Next.js guide](https://www.blocknotejs.org/docs/getting-started/nextjs).

## Getting started

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
| [`src/app/page.js`](src/app/page.js) | A Server Component that imports and renders the dynamic editor. |

`dynamic(..., { ssr: false })` is only allowed in Client Components, which is why the wrapper lives in its own `"use client"` file instead of in `page.js`.

## Scripts

- `npm run dev`: start the development server
- `npm run build`: build for production
- `npm start`: run the production build
- `npm run lint`: run ESLint
