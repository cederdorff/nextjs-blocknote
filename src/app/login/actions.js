"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function getCredentials(formData) {
  return {
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  };
}

export async function login(prevState, formData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(
    getCredentials(formData),
  );

  if (error) return { error: error.message };
  redirect("/");
}

export async function signup(prevState, formData) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp(getCredentials(formData));

  if (error) return { error: error.message };

  // No session means Supabase requires email confirmation first.
  if (!data.session) {
    return { message: "Check your email to confirm your account." };
  }
  redirect("/");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
