import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { APP_CONFIG } from "@/config/app";
import type { Metadata } from "next";
import Link from "next/link";
import RecipeSidebar from "@/components/recipe/RecipeSidebar";
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

  const [
    { data: ingredients },
    { data: steps },
    { data: nutrition },
    { data: relatedRaw },
  ] = await Promise.all([
    supabase.from("recipe_ingredients").select("*").eq("recipe_id", recipe.id).order("order_index"),
    supabase.from("recipe_steps").select("*").eq("recipe_id", recipe.id).order("step_number"),
    supabase.from("recipe_nutrition").select("*").eq("recipe_id", recipe.id).maybeSingle(),
    supabase.from("recipes")
      .select("id, title, slug, cover_image_url, cook_time, cuisine_type")
      .eq("user_id", profile.id)
      .eq("status", "published")
      .is("deleted_at", null)
      .neq("id", recipe.id)
      .order("published_at", { ascending: false })
      .limit(3),
  ]);

  const baseServings = recipe.servings ?? 4;
  const freeStepsCount = recipe.is_paid && !isOwner ? 2 : undefined;
  const cuisineTags = (recipe.cuisine_type as string[]) ?? [];

  return (
    <div className="min-h-screen bg-background text-on-background">
      {/* Nav */}
      <nav className="bg-background/80 backdrop-blur-[24px] sticky top-0 z-50 flex justify-between items-center w-full px-8 py-4 border-b border-outline-variant/10">
        <Link href="/" className="text-2xl font-bold text-primary italic font-headline">
          {APP_CONFIG.name}
        </Link>
        <div className="hidden md:flex items-center gap-10">
          <Link href="/dashboard" className="font-body text-on-surface-variant hover:text-primary transition-colors">Dashboard</Link>
          <Link href={`/${username}`} className="font-body text-on-surface-variant hover:text-primary transition-colors">{profile.full_name}</Link>
        </div>
        <div className="flex items-center gap-3">
          {isOwner && (
            <Link
              href={`/dashboard/recipes/${recipe.id}/edit`}
              className="font-body text-sm text-on-surface-variant border border-outline-variant/30 px-5 py-2 rounded-full hover:border-primary hover:text-primary transition-all"
            >
              Edit recipe
            </Link>
          )}
          <Link
            href="/dashboard/recipes/new"
            className="cta-gradient text-on-primary px-6 py-2 rounded-full font-body font-medium shadow-[0_2px_8px_rgba(196,94,0,0.25)] transition-transform active:scale-95"
          >
            Create Recipe
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="relative pt-12 md:pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">

            {/* Left — title + meta */}
            <div className="lg:col-span-7 relative z-10">
              {/* Tags row */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant px-4 py-1 rounded-full text-sm font-body font-medium tracking-wide uppercase italic">
                  {recipe.meal_type ?? "Recipe"}
                </span>
                {recipe.cook_time && (
                  <div className="flex items-center gap-2 text-primary">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    <span className="font-body text-sm font-medium uppercase tracking-wide">{recipe.cook_time} MINS</span>
                  </div>
                )}
                {recipe.difficulty && (
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm">bar_chart</span>
                    <span className="font-body text-sm uppercase tracking-wide">{recipe.difficulty}</span>
                  </div>
                )}
                {cuisineTags.map(t => (
                  <span key={t} className="font-body text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-surface-container text-on-surface-variant">
                    {t}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="font-headline font-bold text-on-background leading-[0.9] tracking-tight mb-8 italic"
                style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}>
                {recipe.title}
              </h1>

              {/* Description */}
              {recipe.description && (
                <p className="font-body text-xl md:text-2xl text-on-surface-variant max-w-2xl leading-relaxed italic opacity-90 mb-12">
                  {recipe.description}
                </p>
              )}

              {/* Creator */}
              <Link href={`/${username}`} className="flex flex-wrap gap-4 items-center mb-8 group w-fit">
                <div className="flex -space-x-3">
                  <div className="w-12 h-12 rounded-full border-4 border-background overflow-hidden bg-surface-container-high">
                    {profile.avatar_url
                      ? <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-outline text-xl">person</span>
                        </div>
                    }
                  </div>
                </div>
                <div className="text-sm">
                  <p className="font-bold text-on-surface group-hover:text-primary transition-colors">{profile.full_name}</p>
                  <p className="text-on-surface-variant italic">@{profile.username}</p>
                </div>
              </Link>
            </div>

            {/* Right — hero image */}
            {recipe.cover_image_url && (
              <div className="lg:col-span-5 relative">
                <div className="aspect-[4/5] overflow-hidden rounded-[1rem] shadow-[0_8px_24px_rgba(92,46,0,0.12)] relative">
                  <img
                    src={recipe.cover_image_url}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                </div>

                {/* Nutrition float card */}
                {nutrition?.calories && (
                  <div className="absolute -bottom-8 -left-8 bg-surface-container-lowest p-6 rounded-[1rem] shadow-[0_8px_24px_rgba(92,46,0,0.06)] hidden md:block">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                        <span className="font-bold text-lg text-on-surface">{nutrition.calories} kcal</span>
                      </div>
                      {nutrition.protein_g && (
                        <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">
                          {nutrition.protein_g}g protein · {nutrition.carbs_g}g carbs · {nutrition.fat_g}g fat
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ── MAIN CONTENT ──────────────────────────────────────── */}
        <section className={`mt-24 grid grid-cols-1 lg:grid-cols-12 gap-16 ${recipe.cover_image_url ? "lg:mt-32" : "mt-16"}`}>

          {/* Left — sticky ingredients sidebar */}
          {(ingredients?.length ?? 0) > 0 && (
            <div className="lg:col-span-4 order-2 lg:order-1">
              <div className="sticky top-32">
                <RecipeSidebar
                  ingredients={ingredients!}
                  baseServings={baseServings}
                  recipeSlug={slug}
                  creatorUsername={username}
                />
              </div>
            </div>
          )}

          {/* Right — steps */}
          <div className={`${(ingredients?.length ?? 0) > 0 ? "lg:col-span-8" : "lg:col-span-12"} order-1 lg:order-2`}>
            {(steps?.length ?? 0) > 0 && (
              <div className="space-y-16">
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="font-headline text-4xl font-bold text-on-surface italic">The Preparation</h2>
                    {recipe.is_paid && !isOwner && (
                      <span className="font-body text-sm font-bold text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">workspace_premium</span>
                        Signature Recipe
                      </span>
                    )}
                  </div>
                  <StepTimers steps={steps!} freeCount={freeStepsCount} />
                </div>
              </div>
            )}

            {/* Paywall */}
            {recipe.is_paid && !isOwner && (
              <div className="mt-12 bg-surface-container-low rounded-[1rem] p-10 text-center">
                <span className="material-symbols-outlined text-primary mb-4 block" style={{ fontSize: "44px", fontVariationSettings: "'FILL' 1" }}>lock</span>
                <h3 className="font-headline text-3xl font-bold italic text-on-surface mb-3">
                  {(steps?.length ?? 0) - 2} more step{(steps?.length ?? 0) - 2 !== 1 ? "s" : ""} inside
                </h3>
                <p className="font-body text-on-surface-variant mb-8 text-lg max-w-md mx-auto leading-relaxed">
                  Unlock the full recipe once — it&apos;s yours to keep and cook forever.
                </p>
                <button className="cta-gradient text-on-primary px-10 py-4 rounded-full font-body font-bold text-lg shadow-[0_2px_8px_rgba(196,94,0,0.25)] hover:brightness-110 active:scale-[0.98] transition-all">
                  Unlock Full Recipe — ₹{recipe.price ? recipe.price / 100 : "—"}
                </button>
                <p className="font-body text-xs text-on-surface-variant mt-4 opacity-70">One-time purchase. No subscription needed.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── RELATED RECIPES ───────────────────────────────────── */}
        {(relatedRaw?.length ?? 0) > 0 && (
          <section className="mt-32 pt-24 border-t border-outline-variant/30">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="font-headline text-4xl md:text-5xl font-bold text-on-surface italic">
                  More from {profile.full_name.split(" ")[0]}
                </h2>
                <p className="font-body text-on-surface-variant text-lg mt-2 italic">More recipes you&apos;ll love.</p>
              </div>
              <Link href={`/${username}`} className="hidden md:flex items-center gap-2 text-primary font-bold hover:underline underline-offset-8 transition-all">
                View all
                <span className="material-symbols-outlined">trending_flat</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedRaw!.map(r => (
                <Link key={r.id} href={`/${username}/${r.slug}`} className="group cursor-pointer">
                  <div className="aspect-[4/3] overflow-hidden rounded-[1rem] mb-6 bg-surface-container">
                    {r.cover_image_url ? (
                      <img
                        src={r.cover_image_url}
                        alt={r.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-outline" style={{ fontSize: "48px", fontVariationSettings: "'wght' 200" }}>skillet</span>
                      </div>
                    )}
                  </div>
                  {(r.cuisine_type as string[])?.length > 0 && (
                    <span className="text-xs font-bold uppercase tracking-widest text-primary mb-3 block">
                      {(r.cuisine_type as string[])[0]}
                    </span>
                  )}
                  <h4 className="font-headline text-2xl font-bold text-on-surface mb-3 italic group-hover:text-primary transition-colors">
                    {r.title}
                  </h4>
                  {r.cook_time && (
                    <p className="font-body text-on-surface-variant leading-relaxed italic">
                      {r.cook_time} mins
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="bg-background font-headline text-sm italic w-full py-12 px-8 mt-auto border-t border-outline-variant/20 flex flex-col items-center justify-center gap-6 text-center">
        <div className="text-lg font-bold text-on-surface">{APP_CONFIG.name}</div>
        <div className="flex gap-8">
          {["Terms","Privacy","Help"].map(l => (
            <a key={l} href="#" className="text-on-surface-variant hover:text-primary underline underline-offset-4 transition-colors">{l}</a>
          ))}
        </div>
        <p className="text-on-surface-variant opacity-60">© {new Date().getFullYear()} {APP_CONFIG.name}. Crafted for the digital hearth.</p>
      </footer>
    </div>
  );
}
