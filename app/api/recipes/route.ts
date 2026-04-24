import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: recipe, error } = await supabase
    .from("recipes")
    .insert({ user_id: user.id, title: "Untitled Recipe", slug: `draft-${Date.now()}`, status: "draft" })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: recipe.id }, { status: 201 });
}
