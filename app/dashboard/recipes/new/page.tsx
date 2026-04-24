import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function NewRecipePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: recipe, error } = await supabase
    .from("recipes")
    .insert({ user_id: user.id, title: "Untitled Recipe", slug: `draft-${Date.now()}`, status: "draft" })
    .select("id")
    .single();

  if (error || !recipe) redirect("/dashboard");
  redirect(`/dashboard/recipes/${recipe.id}/edit`);
}
