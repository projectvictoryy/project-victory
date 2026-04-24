import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type IngredientItem = {
  quantity: number | null;
  unit: string | null;
  ingredient_name: string;
  is_optional: boolean;
};
type IngredientGroup = { group_name: string; items: IngredientItem[] };
type StepItem = { instruction: string; timer_seconds: number | null };

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  // Verify ownership
  const { data: existing } = await supabase
    .from("recipes")
    .select("id, user_id")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const {
    title, description, cover_image_url, cuisine_type, meal_type,
    difficulty, cook_time, prep_time, servings,
    ingredient_groups, steps,
    slug, status, is_paid, price,
  } = body;

  // 1. Update recipe row
  const { error: recipeErr } = await supabase
    .from("recipes")
    .update({
      title: title || "Untitled Recipe",
      description: description || null,
      cover_image_url: cover_image_url || null,
      cuisine_type: cuisine_type || [],
      meal_type: meal_type || null,
      difficulty: difficulty || null,
      cook_time: cook_time ? Number(cook_time) : null,
      prep_time: prep_time ? Number(prep_time) : null,
      servings: servings ? Number(servings) : null,
      slug: slug || `draft-${Date.now()}`,
      status: status || "draft",
      is_paid: Boolean(is_paid),
      price: is_paid && price ? Math.round(Number(price) * 100) : null,
      published_at: status === "published" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (recipeErr) return NextResponse.json({ error: recipeErr.message }, { status: 500 });

  // 2. Replace ingredients
  if (ingredient_groups !== undefined) {
    await supabase.from("recipe_ingredients").delete().eq("recipe_id", id);
    const rows: object[] = [];
    (ingredient_groups as IngredientGroup[]).forEach((group, gi) => {
      group.items.forEach((item, ii) => {
        if (!item.ingredient_name?.trim()) return;
        rows.push({
          recipe_id: id,
          group_name: group.group_name || null,
          order_index: gi * 100 + ii,
          quantity: item.quantity != null ? Number(item.quantity) : null,
          unit: item.unit || null,
          ingredient_name: item.ingredient_name.trim(),
          is_optional: Boolean(item.is_optional),
        });
      });
    });
    if (rows.length > 0) {
      const { error: ingErr } = await supabase.from("recipe_ingredients").insert(rows);
      if (ingErr) return NextResponse.json({ error: ingErr.message }, { status: 500 });
    }
  }

  // 3. Replace steps
  if (steps !== undefined) {
    await supabase.from("recipe_steps").delete().eq("recipe_id", id);
    const stepRows = (steps as StepItem[])
      .filter(s => s.instruction?.trim())
      .map((s, i) => ({
        recipe_id: id,
        step_number: i + 1,
        instruction: s.instruction.trim(),
        timer_seconds: s.timer_seconds ? Number(s.timer_seconds) : null,
      }));
    if (stepRows.length > 0) {
      const { error: stepErr } = await supabase.from("recipe_steps").insert(stepRows);
      if (stepErr) return NextResponse.json({ error: stepErr.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { error } = await supabase
    .from("recipes")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
