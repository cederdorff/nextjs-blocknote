import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import NoteEditor from "@/components/NoteEditor";

export default async function NotePage({ params }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // The id comes from the URL: /notes/[id]
  const { id } = await params;

  const supabase = await createClient();
  const { data: note } = await supabase
    .from("notes")
    .select("id, title, content")
    .eq("id", id)
    .maybeSingle();

  // No note: the id doesn't exist, or it belongs to another user (RLS)
  if (!note) {
    notFound();
  }

  return (
    <main>
      <p>
        <Link href="/">← All notes</Link>
      </p>
      <NoteEditor note={note} />
    </main>
  );
}
