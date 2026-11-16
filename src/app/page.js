import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { logout } from "./login/actions";
import { createNote } from "./notes/actions";

export default function Home() {
  return (
    <main>
      <header className="row spread">
        <h1>My notes</h1>
        <form action={logout}>
          <button className="secondary">Log out</button>
        </form>
      </header>

      <form action={createNote}>
        <button>New note</button>
      </form>

      <Suspense fallback={<p>Loading notes…</p>}>
        <NotesList />
      </Suspense>
    </main>
  );
}

async function NotesList() {
  const supabase = await createClient();
  const { data: notes, error } = await supabase
    .from("notes")
    .select("id, title, updated_at")
    .order("updated_at", { ascending: false });

  if (error) return <p role="alert" className="error">{error.message}</p>;
  if (notes.length === 0) return <p>No notes yet.</p>;

  return (
    <ul className="notes">
      {notes.map((note) => (
        <li key={note.id}>
          <Link href={`/notes/${note.id}`}>{note.title}</Link>
          <time dateTime={note.updated_at}>
            {new Date(note.updated_at).toLocaleString("da-DK")}
          </time>
        </li>
      ))}
    </ul>
  );
}
