import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { APP_CONFIG } from "@/config/app";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold italic text-on-surface mb-3">
          Welcome to {APP_CONFIG.name}
        </h1>
        <p className="font-body text-on-surface-variant mb-2">You&apos;re logged in as {user.email}</p>
        <p className="font-body text-sm text-outline italic">Dashboard coming soon.</p>
      </div>
    </main>
  );
}
