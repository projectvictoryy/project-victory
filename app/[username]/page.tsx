import { createClient } from "@/lib/supabase/server";
import { APP_CONFIG } from "@/config/app";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import ShareButton from "@/components/storefront/ShareButton";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, username, avatar_url, bio")
    .eq("username", username)
    .is("deleted_at", null)
    .maybeSingle();

  if (!profile) return { title: "Not Found" };

  return {
    title: `${profile.full_name} (@${profile.username}) — ${APP_CONFIG.name}`,
    description: profile.bio ?? `Recipes by ${profile.full_name} on ${APP_CONFIG.name}`,
    openGraph: {
      title: `${profile.full_name} on ${APP_CONFIG.name}`,
      description: profile.bio ?? `Recipes by ${profile.full_name} on ${APP_CONFIG.name}`,
      images: profile.avatar_url ? [profile.avatar_url] : [],
    },
  };
}

export default async function StorefrontPage({ params }: Props) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: { user: authUser } } = await supabase.auth.getUser();

  const [{ data: profile }, { data: authProfile }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, username, avatar_url, bio, cuisine_tags")
      .eq("username", username)
      .is("deleted_at", null)
      .maybeSingle(),
    authUser
      ? supabase.from("profiles").select("username").eq("id", authUser.id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  if (!profile) notFound();

  const isOwner = authUser?.id === profile.id;

  // Recipes fetched here once recipes table is built
  const recipes: Recipe[] = [];

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="font-headline text-xl font-bold italic text-primary"
          >
            {APP_CONFIG.name}
          </Link>
          <div className="flex items-center gap-4">
            {isOwner ? (
              <>
                <Link
                  href="/settings"
                  className="flex items-center gap-1.5 font-body text-sm text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-base leading-none">settings</span>
                  Settings
                </Link>
              </>
            ) : authUser && authProfile?.username ? (
              <Link
                href={`/${authProfile.username}`}
                className="font-body text-sm text-on-surface-variant hover:text-on-surface transition-colors"
              >
                My profile
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="font-body text-sm text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="cta-gradient text-on-primary px-5 py-2.5 rounded-full font-body font-bold text-sm shadow-[0_2px_8px_rgba(196,94,0,0.25)] hover:opacity-90 transition-all"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20">

        {/* Profile Header */}
        <header className="flex flex-col md:flex-row gap-12 items-start mb-24">

          {/* Avatar */}
          <div className="relative shrink-0 group">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden bg-surface-container-high border-4 border-surface-container-highest shadow-[0_8px_24px_rgba(92,46,0,0.06)]">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-outline"
                    style={{ fontSize: "80px" }}
                  >
                    person
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-6">
            <div>
              <h1 className="font-headline text-5xl md:text-6xl font-bold italic text-on-surface mb-2 leading-tight">
                {profile.full_name}
              </h1>
              {profile.cuisine_tags?.length > 0 && (
                <p className="font-headline text-base text-secondary font-medium tracking-widest uppercase">
                  {(profile.cuisine_tags as string[]).join(" • ")}
                </p>
              )}
            </div>

            {profile.bio && (
              <p className="font-body text-lg leading-relaxed text-on-surface-variant max-w-2xl">
                {profile.bio}
              </p>
            )}

            {/* Stats */}
            <div className="flex flex-wrap gap-12 py-4">
              <div>
                <span className="block font-headline text-3xl font-bold text-primary">
                  {recipes.length}
                </span>
                <span className="font-headline text-xs font-bold uppercase tracking-widest text-outline">
                  Recipes
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button className="cta-gradient text-on-primary px-8 py-3 rounded-full font-body font-bold text-sm shadow-[0_2px_8px_rgba(196,94,0,0.25)] hover:opacity-90 active:scale-95 transition-all">
                Follow
              </button>
              <ShareButton username={profile.username} name={profile.full_name} />

            </div>
          </div>
        </header>

        {/* Recipes Section */}
        <section className="mb-24">
          <div className="flex justify-between items-end mb-12">
            <h2 className="font-headline text-4xl font-bold italic text-on-surface">
              Recipes
            </h2>
          </div>

          {recipes.length === 0 ? (
            <EmptyState name={profile.full_name} />
          ) : (
            <RecipeGrid recipes={recipes} />
          )}
        </section>

      </main>

      {/* Footer */}
      <footer className="py-12 px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-6 text-center">
          <div className="font-headline text-lg font-bold italic text-on-surface">
            {APP_CONFIG.name}
          </div>
          <div className="flex flex-wrap justify-center gap-8 font-body text-sm text-outline">
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Help</a>
          </div>
          <p className="font-body text-xs text-outline">
            © {new Date().getFullYear()} {APP_CONFIG.name}. Crafted for the digital hearth.
          </p>
          <div className="flex gap-6 pt-2">
            <span className="material-symbols-outlined text-primary cursor-pointer hover:scale-110 transition-transform">share</span>
            <span className="material-symbols-outlined text-primary cursor-pointer hover:scale-110 transition-transform">public</span>
            <span className="material-symbols-outlined text-primary cursor-pointer hover:scale-110 transition-transform">mail</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

type Recipe = {
  id: string;
  title: string;
  cover_image_url: string | null;
  cook_time: number | null;
  difficulty: string | null;
  cuisine_type: string[] | null;
};

function EmptyState({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <span
        className="material-symbols-outlined text-outline mb-6"
        style={{ fontSize: "64px", fontVariationSettings: "'wght' 200" }}
      >
        skillet
      </span>
      <h3 className="font-headline text-2xl font-bold italic text-on-surface mb-3">
        No recipes yet
      </h3>
      <p className="font-body text-on-surface-variant max-w-sm">
        {name} hasn{"'"}t published any recipes yet. Check back soon.
      </p>
    </div>
  );
}

function RecipeGrid({ recipes }: { recipes: Recipe[] }) {
  const [featured, ...rest] = recipes;
  const side = rest[0];
  const small = rest.slice(1, 4);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      {/* Featured card */}
      {featured && (
        <div className="md:col-span-8 group relative overflow-hidden rounded-[1rem] bg-surface-container-lowest shadow-[0_1px_4px_rgba(92,46,0,0.08)] hover:shadow-[0_8px_24px_rgba(92,46,0,0.10)] transition-shadow">
          <div className="aspect-[16/9] overflow-hidden">
            {featured.cover_image_url ? (
              <img
                src={featured.cover_image_url}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
            ) : (
              <div className="w-full h-full bg-surface-container flex items-center justify-center">
                <span className="material-symbols-outlined text-outline" style={{ fontSize: "48px" }}>image</span>
              </div>
            )}
          </div>
          <div className="absolute top-4 left-4">
            <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant px-4 py-1.5 rounded-full text-xs font-headline font-bold tracking-widest uppercase">
              Featured
            </span>
          </div>
          <div className="p-8">
            <h3 className="font-headline text-3xl font-bold text-on-surface mb-4">{featured.title}</h3>
            <div className="flex items-center gap-6 font-body text-sm text-outline">
              {featured.cook_time && (
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  {featured.cook_time} mins
                </span>
              )}
              {featured.difficulty && (
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">restaurant</span>
                  {featured.difficulty}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Side card */}
      {side && (
        <div className="md:col-span-4 group flex flex-col rounded-[1rem] bg-surface-container-lowest shadow-[0_1px_4px_rgba(92,46,0,0.08)] overflow-hidden">
          <div className="h-64 overflow-hidden">
            {side.cover_image_url ? (
              <img
                src={side.cover_image_url}
                alt={side.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
            ) : (
              <div className="w-full h-full bg-surface-container" />
            )}
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between">
            <h3 className="font-headline text-xl font-bold text-on-surface mb-2">{side.title}</h3>
            <div className="flex justify-between items-center">
              <span className="font-body text-sm text-primary font-bold uppercase tracking-widest">View Recipe</span>
              <span className="material-symbols-outlined text-primary">arrow_right_alt</span>
            </div>
          </div>
        </div>
      )}

      {/* Small cards */}
      {small.map((recipe) => (
        <div key={recipe.id} className="md:col-span-4 group rounded-[1rem] bg-surface-container-lowest shadow-[0_1px_4px_rgba(92,46,0,0.08)] overflow-hidden">
          <div className="h-48 overflow-hidden">
            {recipe.cover_image_url ? (
              <img
                src={recipe.cover_image_url}
                alt={recipe.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
            ) : (
              <div className="w-full h-full bg-surface-container" />
            )}
          </div>
          <div className="p-6">
            <h3 className="font-headline text-xl font-bold text-on-surface mb-3">{recipe.title}</h3>
            <div className="flex justify-between items-center">
              {recipe.cook_time && (
                <span className="font-body text-sm text-outline">{recipe.cook_time} mins</span>
              )}
              <span className="material-symbols-outlined text-primary">bookmark</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

