"use client";

import { useState } from "react";
import Editor from "@/components/DynamicEditor";
import { deleteNote, updateNote } from "@/lib/actions";

// A Client Component, because it uses state and reacts to typing.
// It shows one note and saves it with Server Actions.
export default function NoteEditor({ note }) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [status, setStatus] = useState("");

  async function handleSave() {
    setStatus("Saving…");
    await updateNote(note.id, title, content);
    setStatus("Saved");
  }

  async function handleDelete() {
    if (confirm("Delete this note?")) {
      await deleteNote(note.id);
    }
  }

  return (
    <article>
      <input
        className="note-title"
        aria-label="Title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      {/* Every change in the editor updates content in state */}
      <Editor initialContent={note.content} onChange={setContent} />

      <div className="note-actions">
        <button type="button" className="button" onClick={handleSave}>
          Save
        </button>
        <button type="button" className="button secondary" onClick={handleDelete}>
          Delete
        </button>
        <span role="status">{status}</span>
      </div>
    </article>
  );
}
