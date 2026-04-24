import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import RecipeWizard from "@/components/recipe/RecipeWizard";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditRecipePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [
    { data: recipe },
    { data: ingredients },
    { data: steps },
  ] = await Promise.all([
    supabase.from("recipes")
      .select("*")
      .eq("id", id).eq("user_id", user.id).is("deleted_at", null).maybeSingle(),
    supabase.from("recipe_ingredients")
      .select("*").eq("recipe_id", id).order("order_index"),
    supabase.from("recipe_steps")
      .select("*").eq("recipe_id", id).order("step_number"),
  ]);

  if (!recipe) notFound();

  // Group ingredients by group_name
  const groupMap: Record<string, typeof ingredients> = {};
  (ingredients ?? []).forEach(ing => {
    const key = ing.group_name ?? "__none__";
    if (!groupMap[key]) groupMap[key] = [];
    groupMap[key]!.push(ing);
  });
  const ingredientGroups = Object.entries(groupMap).map(([key, items]) => ({
    id: key,
    group_name: key === "__none__" ? "" : key,
    items: (items ?? []).map(i => ({
      id: i.id,
      quantity: i.quantity?.toString() ?? "",
      unit: i.unit ?? "",
      ingredient_name: i.ingredient_name,
      is_optional: i.is_optional,
    })),
  }));

  const initialData = {
    title: recipe.title ?? "",
    description: recipe.description ?? "",
    cover_image_url: recipe.cover_image_url ?? "",
    cuisine_type: (recipe.cuisine_type as string[]) ?? [],
    meal_type: recipe.meal_type ?? "",
    difficulty: recipe.difficulty ?? "",
    cook_time: recipe.cook_time?.toString() ?? "",
    prep_time: recipe.prep_time?.toString() ?? "",
    servings: recipe.servings?.toString() ?? "4",
    ingredient_groups: ingredientGroups.length > 0 ? ingredientGroups : [{ id: "g1", group_name: "", items: [] }],
    steps: (steps ?? []).map(s => ({
      id: s.id,
      instruction: s.instruction,
      timer_seconds: s.timer_seconds ?? null,
    })),
    slug: recipe.slug ?? "",
    status: (recipe.status as "draft" | "published") ?? "draft",
    is_paid: recipe.is_paid ?? false,
    price: recipe.price ? (recipe.price / 100).toString() : "",
  };

  return <RecipeWizard recipeId={id} initialData={initialData} />;
}
