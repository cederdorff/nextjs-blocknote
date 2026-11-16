"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";

export default function Editor({ initialContent, onChange }) {
  const editor = useCreateBlockNote({
    // BlockNote doesn't accept an empty array, so fall back to its default.
    initialContent: initialContent?.length ? initialContent : undefined,
  });

  return (
    <BlockNoteView
      editor={editor}
      onChange={() => onChange?.(editor.document)}
    />
  );
}
