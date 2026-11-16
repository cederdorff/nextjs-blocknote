"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Editor from "@/components/DynamicEditor";
import { deleteNote, updateNote } from "@/app/notes/actions";

const SAVE_DELAY_MS = 1000;

export default function NoteEditor({ note }) {
  const [title, setTitle] = useState(note.title);
  const [status, setStatus] = useState("Saved");
  const [isDeleting, startDelete] = useTransition();

  // Latest values and pending timer, kept in refs so the debounced
  // save always sends the newest title and content.
  const draft = useRef({ title: note.title, content: note.content });
  const timer = useRef(null);

  async function save() {
    timer.current = null;
    setStatus("Saving…");
    const { error } = await updateNote(note.id, draft.current);
    setStatus(error ? `Could not save: ${error}` : "Saved");
  }

  function scheduleSave(changes) {
    draft.current = { ...draft.current, ...changes };
    setStatus("Unsaved changes");
    clearTimeout(timer.current);
    timer.current = setTimeout(save, SAVE_DELAY_MS);
  }

  // Save immediately if the user leaves the page with pending changes.
  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        updateNote(note.id, draft.current);
      }
    };
  }, [note.id]);

  function handleDelete() {
    if (!confirm("Delete this note?")) return;
    clearTimeout(timer.current);
    timer.current = null;
    startDelete(() => deleteNote(note.id));
  }

  return (
    <article className="stack">
      <div className="row spread">
        <p role="status" className="muted">{status}</p>
        <button onClick={handleDelete} disabled={isDeleting} className="secondary">
          Delete
        </button>
      </div>

      <input
        className="title"
        aria-label="Title"
        value={title}
        onChange={(event) => {
          setTitle(event.target.value);
          scheduleSave({ title: event.target.value });
        }}
      />

      <Editor
        initialContent={note.content}
        onChange={(content) => scheduleSave({ content })}
      />
    </article>
  );
}
