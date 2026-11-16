"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";

// The BlockNote editor. It only works in the browser,
// so it is loaded through DynamicEditor.js.
export default function Editor({ initialContent, onChange }) {
  const editor = useCreateBlockNote({
    // A new note has no blocks yet ([]). BlockNote needs at least one block,
    // so we pass undefined and let BlockNote start with an empty paragraph.
    initialContent: initialContent.length > 0 ? initialContent : undefined,
  });

  // editor.document is the whole note as an array of blocks
  return <BlockNoteView editor={editor} onChange={() => onChange(editor.document)} />;
}
