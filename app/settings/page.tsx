import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { APP_CONFIG } from "@/config/app";
import type { Metadata } from "next";
import SettingsTabs from "@/components/settings/SettingsTabs";

export const metadata: Metadata = {
  title: `Settings — ${APP_CONFIG.name}`,
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, username, bio, avatar_url, cuisine_tags, creator_mode, creator_tier")
    .eq("id", user.id)
    .maybeSingle();

  return <SettingsTabs user={user} profile={profile} />;
}
