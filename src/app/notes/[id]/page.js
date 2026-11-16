import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import NoteEditor from "@/components/NoteEditor";

export default function NotePage({ params }) {
  return (
    <main>
      <Link href="/">← All notes</Link>
      <Suspense fallback={<p>Loading note…</p>}>
        <Note params={params} />
      </Suspense>
    </main>
  );
}

async function Note({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: note } = await supabase
    .from("notes")
    .select("id, title, content")
    .eq("id", id)
    .maybeSingle();

  // Also covers invalid ids and other users' notes (blocked by RLS).
  if (!note) notFound();

  return <NoteEditor note={note} />;
}
