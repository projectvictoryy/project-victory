import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { APP_CONFIG } from "@/config/app";
import type { Metadata } from "next";
import Link from "next/link";
import ServingScaler from "@/components/recipe/ServingScaler";
import StepTimers from "@/components/recipe/StepTimers";

interface Props {
  params: Promise<{ username: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username, slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("recipes")
    .select("title, description, cover_image_url, profiles!inner(username)")
    .eq("slug", slug)
    .eq("profiles.username", username)
    .eq("status", "published")
    .is("deleted_at", null)
    .maybeSingle();
  if (!data) return { title: "Recipe not found" };
  return {
    title: `${data.title} — ${APP_CONFIG.name}`,
    description: data.description ?? `A recipe by @${username} on ${APP_CONFIG.name}`,
    openGraph: { images: data.cover_image_url ? [data.cover_image_url] : [] },
  };
}

export default async function RecipePage({ params }: Props) {
  const { username, slug } = await params;
  const supabase = await createClient();

  const { data: { user: authUser } } = await supabase.auth.getUser();

  // Fetch recipe + creator profile in one query
  const { data: recipe } = await supabase
    .from("recipes")
    .select(`*, profiles!inner(id, full_name, username, avatar_url)`)
    .eq("slug", slug)
    .eq("profiles.username", username)
    .eq("status", "published")
    .is("deleted_at", null)
    .maybeSingle();

  if (!recipe) notFound();

  const profile = recipe.profiles as { id: string; full_name: string; username: string; avatar_url: string | null };
  const isOwner = authUser?.id === profile.id;

  const [{ data: ingredients }, { data: steps }, { data: nutrition }] = await Promise.all([
    supabase.from("recipe_ingredients").select("*").eq("recipe_id", recipe.id).order("order_index"),
    supabase.from("recipe_steps").select("*").eq("recipe_id", recipe.id).order("step_number"),
    supabase.from("recipe_nutrition").select("*").eq("recipe_id", recipe.id).maybeSingle(),
  ]);

  const freeStepsCount = recipe.is_paid && !isOwner ? 2 : undefined;
  const baseServings = recipe.servings ?? 4;

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href={`/${username}`} className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined text-xl">arrow_back</span>
            <span className="font-body text-sm">{profile.full_name}</span>
          </Link>
          <Link href="/" className="font-headline font-bold italic text-primary">{APP_CONFIG.name}</Link>
          {isOwner && (
            <Link
              href={`/dashboard/recipes/${recipe.id}/edit`}
              className="font-body text-sm text-on-surface-variant border border-outline-variant px-4 py-2 rounded-full hover:border-primary hover:text-primary transition-all"
            >
              Edit
            </Link>
          )}
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Hero image */}
        {recipe.cover_image_url && (
          <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden mb-8 bg-surface-container">
            <img src={recipe.cover_image_url} alt={recipe.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          {recipe.is_paid && (
            <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full font-body text-xs font-medium mb-4">
              <span className="material-symbols-outlined text-sm">workspace_premium</span>
              Signature Recipe
            </div>
          )}
          <h1 className="font-headline text-4xl md:text-5xl font-bold italic text-on-surface mb-4 leading-tight">
            {recipe.title}
          </h1>
          {recipe.description && (
            <p className="font-body text-lg text-on-surface-variant leading-relaxed">{recipe.description}</p>
          )}
        </div>

        {/* Creator chip */}
        <Link href={`/${username}`} className="inline-flex items-center gap-3 bg-surface-container-lowest border border-outline-variant rounded-full pl-1 pr-4 py-1 mb-8 hover:border-primary transition-colors">
          <div className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden flex items-center justify-center">
            {profile.avatar_url
              ? <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
              : <span className="material-symbols-outlined text-outline text-base">person</span>}
          </div>
          <span className="font-body text-sm text-on-surface-variant">by <span className="text-on-surface font-medium">{profile.full_name}</span></span>
        </Link>

        {/* Quick facts */}
        <div className="grid grid-cols-4 gap-0 bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden mb-8">
          {[
            { icon: "timer", label: "Cook", value: recipe.cook_time ? `${recipe.cook_time}m` : "—" },
            { icon: "schedule", label: "Prep", value: recipe.prep_time ? `${recipe.prep_time}m` : "—" },
            { icon: "restaurant", label: "Serves", value: recipe.servings?.toString() ?? "—" },
            { icon: "bar_chart", label: "Level", value: recipe.difficulty ?? "—" },
          ].map((f, i) => (
            <div key={i} className={`py-4 px-3 text-center ${i < 3 ? "border-r border-outline-variant" : ""}`}>
              <span className="material-symbols-outlined text-primary text-lg block mb-1">{f.icon}</span>
              <div className="font-headline font-bold text-sm text-on-surface">{f.value}</div>
              <div className="font-body text-xs text-outline">{f.label}</div>
            </div>
          ))}
        </div>

        {/* Cuisine tags */}
        {(recipe.cuisine_type as string[])?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {(recipe.cuisine_type as string[]).map(c => (
              <span key={c} className="bg-surface-container border border-outline-variant text-on-surface-variant px-3 py-1 rounded-full font-body text-xs">
                {c}
              </span>
            ))}
          </div>
        )}

        {/* Nutrition */}
        {nutrition && (
          <div className="mb-10">
            <h2 className="font-headline text-xl font-bold italic text-on-surface mb-4">Nutrition per serving</h2>
            <div className="grid grid-cols-5 gap-0 bg-surface-container-low border border-outline-variant rounded-2xl overflow-hidden">
              {[
                { label: "Calories", value: nutrition.calories ?? "—" },
                { label: "Protein", value: nutrition.protein_g ? `${nutrition.protein_g}g` : "—" },
                { label: "Carbs", value: nutrition.carbs_g ? `${nutrition.carbs_g}g` : "—" },
                { label: "Fat", value: nutrition.fat_g ? `${nutrition.fat_g}g` : "—" },
                { label: "Fibre", value: nutrition.fibre_g ? `${nutrition.fibre_g}g` : "—" },
              ].map((n, i) => (
                <div key={i} className={`py-4 px-2 text-center ${i < 4 ? "border-r border-outline-variant" : ""}`}>
                  <div className="font-headline font-bold text-base text-on-surface">{n.value}</div>
                  <div className="font-body text-xs text-outline">{n.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ingredients */}
        {(ingredients?.length ?? 0) > 0 && (
          <section className="mb-12">
            <h2 className="font-headline text-2xl font-bold italic text-on-surface mb-6">Ingredients</h2>
            <ServingScaler
              ingredients={ingredients!}
              baseServings={baseServings}
              initialServings={baseServings}
            />
          </section>
        )}

        {/* Method */}
        {(steps?.length ?? 0) > 0 && (
          <section className="mb-12">
            <h2 className="font-headline text-2xl font-bold italic text-on-surface mb-6">Method</h2>
            <StepTimers steps={steps!} freeCount={freeStepsCount} />

            {/* Paywall */}
            {recipe.is_paid && !isOwner && (
              <div className="mt-6 bg-surface-container-lowest border-2 border-outline-variant rounded-2xl p-8 text-center">
                <span className="material-symbols-outlined text-primary mb-3 block" style={{ fontSize: "40px" }}>lock</span>
                <h3 className="font-headline text-2xl font-bold italic text-on-surface mb-2">
                  {(steps?.length ?? 0) - 2} more step{(steps?.length ?? 0) - 2 !== 1 ? "s" : ""} inside
                </h3>
                <p className="font-body text-on-surface-variant mb-6">
                  Unlock the full recipe once — it&apos;s yours to keep and cook forever.
                </p>
                <button className="cta-gradient text-on-primary px-8 py-4 rounded-full font-body font-bold text-base shadow-[0_2px_8px_rgba(196,94,0,0.25)] hover:opacity-90 transition-all w-full max-w-sm">
                  Unlock Full Recipe — ₹{recipe.price ? recipe.price / 100 : "—"}
                </button>
                <p className="font-body text-xs text-outline mt-3">One-time purchase. No subscription needed.</p>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
