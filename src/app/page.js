import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { createNote } from "@/lib/actions";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  // Only logged-in users can see their notes
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // RLS filters the rows, so we only get this user's notes
  const supabase = await createClient();
  const { data: notes } = await supabase
    .from("notes")
    .select("id, title, updated_at")
    .order("updated_at", { ascending: false });

  return (
    <main>
      <h1>My notes</h1>

      <form action={createNote}>
        <button type="submit" className="button">
          New note
        </button>
      </form>

      {notes.length === 0 && <p>No notes yet. Create your first one!</p>}

      <ul className="notes">
        {notes.map((note) => (
          <li key={note.id}>
            <Link href={`/notes/${note.id}`}>{note.title}</Link>
            <span>{new Date(note.updated_at).toLocaleString("da-DK")}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
