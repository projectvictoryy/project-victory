import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import SiteNav from "@/components/ui/SiteNav";

const STATUS_STYLES: Record<string, string> = {
  published: "bg-surface-container text-on-surface-variant border-outline-variant",
  draft:     "bg-surface-container text-outline border-outline-variant",
  scheduled: "bg-surface-container text-secondary border-outline-variant",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: recipes }] = await Promise.all([
    supabase.from("profiles").select("username, full_name").eq("id", user.id).maybeSingle(),
    supabase.from("recipes")
      .select("id, title, slug, status, cook_time, difficulty, cuisine_type, cover_image_url, view_count, updated_at")
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .order("updated_at", { ascending: false }),
  ]);

  const published = recipes?.filter(r => r.status === "published").length ?? 0;
  const drafts    = recipes?.filter(r => r.status === "draft").length ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <SiteNav
        right={
          <>
            {profile?.username && (
              <Link href={`/${profile.username}`} className="font-body text-sm text-on-surface-variant hover:text-on-surface transition-colors">
                View profile
              </Link>
            )}
            <Link href="/settings" className="font-body text-sm text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-base">settings</span>
              Settings
            </Link>
          </>
        }
      />

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="font-headline text-4xl font-bold italic text-on-surface mb-1">
              {profile?.full_name ? `${profile.full_name.split(" ")[0]}'s Kitchen` : "My Kitchen"}
            </h1>
            <p className="font-body text-sm text-on-surface-variant">
              {published} published · {drafts} draft{drafts !== 1 ? "s" : ""}
            </p>
          </div>
          <Link
            href="/dashboard/recipes/new"
            className="cta-gradient text-on-primary px-6 py-3 rounded-full font-body font-bold text-sm shadow-[0_2px_8px_rgba(196,94,0,0.25)] hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">add</span>
            New recipe
          </Link>
        </div>

        {/* Recipe list */}
        {!recipes?.length ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <span className="material-symbols-outlined text-outline mb-6" style={{ fontSize: "64px", fontVariationSettings: "'wght' 200" }}>skillet</span>
            <h2 className="font-headline text-2xl font-bold italic text-on-surface mb-3">No recipes yet</h2>
            <p className="font-body text-on-surface-variant mb-8 max-w-sm">
              Create your first recipe and share it with the world.
            </p>
            <Link href="/dashboard/recipes/new" className="cta-gradient text-on-primary px-8 py-3 rounded-full font-body font-bold text-sm shadow-[0_2px_8px_rgba(196,94,0,0.25)] hover:opacity-90 transition-all">
              Create first recipe
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recipes.map(recipe => (
              <div key={recipe.id} className="flex items-center gap-5 bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 hover:border-primary/40 transition-colors">
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-container shrink-0">
                  {recipe.cover_image_url
                    ? <img src={recipe.cover_image_url} alt={recipe.title} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-outline text-2xl">skillet</span>
                      </div>
                  }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-headline font-bold text-base text-on-surface truncate">{recipe.title}</h3>
                    <span className={`shrink-0 px-2.5 py-0.5 rounded-full font-body text-xs border capitalize ${STATUS_STYLES[recipe.status] ?? STATUS_STYLES.draft}`}>
                      {recipe.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 font-body text-xs text-outline">
                    {recipe.cook_time && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">timer</span>{recipe.cook_time}m</span>}
                    {recipe.difficulty && <span>{recipe.difficulty}</span>}
                    {(recipe.cuisine_type as string[])?.length > 0 && <span>{(recipe.cuisine_type as string[]).join(", ")}</span>}
                    {recipe.view_count > 0 && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">visibility</span>{recipe.view_count} views</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {recipe.status === "published" && profile?.username && (
                    <Link
                      href={`/${profile.username}/${recipe.slug}`}
                      className="font-body text-sm text-on-surface-variant border border-outline-variant px-3 py-1.5 rounded-full hover:border-primary hover:text-primary transition-all"
                      target="_blank"
                    >
                      View
                    </Link>
                  )}
                  <Link
                    href={`/dashboard/recipes/${recipe.id}/edit`}
                    className="font-body text-sm text-on-surface-variant border border-outline-variant px-3 py-1.5 rounded-full hover:border-primary hover:text-primary transition-all"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
