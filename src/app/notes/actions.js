"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// RLS makes sure users can only touch their own notes,
// and user_id defaults to auth.uid() in the database.

export async function createNote() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notes")
    .insert({})
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  redirect(`/notes/${data.id}`);
}

export async function updateNote(id, { title, content }) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("notes")
    .update({ title, content })
    .eq("id", id);

  return { error: error?.message ?? null };
}

export async function deleteNote(id) {
  const supabase = await createClient();
  const { error } = await supabase.from("notes").delete().eq("id", id);

  if (error) throw new Error(error.message);
  redirect("/");
}
