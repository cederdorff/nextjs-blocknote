"use server";

// "use server" at the top of the file: every exported function is a Server Action.
// They run on the server, even when a form or a button in the browser calls them.

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  redirect("/login");
}

// Row Level Security (RLS) in the database makes sure a user can only
// see and change their own notes. user_id is set by the database
// (default auth.uid()), so we never send it from the browser.

export async function createNote() {
  const supabase = await createClient();
  const { data: note, error } = await supabase
    .from("notes")
    .insert({ title: "Untitled" })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  redirect(`/notes/${note.id}`);
}

// content is the BlockNote document: an array of blocks, saved as JSON
export async function updateNote(id, title, content) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("notes")
    .update({ title, content })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteNote(id) {
  const supabase = await createClient();
  const { error } = await supabase.from("notes").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  redirect("/");
}
