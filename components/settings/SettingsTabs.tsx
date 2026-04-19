"use client";

import { useState } from "react";
import Link from "next/link";
import { APP_CONFIG } from "@/config/app";
import type { User } from "@supabase/supabase-js";
import ProfileTab from "./ProfileTab";
import CreatorTab from "./CreatorTab";
import AccountTab from "./AccountTab";
import AppearanceTab from "./AppearanceTab";
import NotificationsTab from "./NotificationsTab";

export type Profile = {
  id: string;
  full_name: string;
  username: string;
  bio: string | null;
  avatar_url: string | null;
  cuisine_tags: string[] | null;
  creator_mode: boolean;
  creator_tier: string | null;
};

type Tab = "profile" | "creator" | "appearance" | "notifications" | "account";

const TABS: { id: Tab; label: string; icon: string; soon?: boolean }[] = [
  { id: "profile",       label: "Profile",       icon: "person"         },
  { id: "creator",       label: "Creator",        icon: "storefront"     },
  { id: "appearance",    label: "Appearance",     icon: "palette",       soon: true },
  { id: "notifications", label: "Notifications",  icon: "notifications", soon: true },
  { id: "account",       label: "Account",        icon: "manage_accounts"},
];

interface Props {
  user: User;
  profile: Profile | null;
}

export default function SettingsTabs({ user, profile }: Props) {
  const [active, setActive] = useState<Tab>("profile");

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant/30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-headline text-xl font-bold italic text-primary">
            {APP_CONFIG.name}
          </Link>
          {profile?.username && (
            <Link
              href={`/${profile.username}`}
              className="flex items-center gap-2 font-body text-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Back to storefront
            </Link>
          )}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-56 shrink-0">
          <h1 className="font-headline text-2xl font-bold italic text-on-surface mb-6 hidden lg:block">
            Settings
          </h1>
          {/* Mobile: horizontal scroll */}
          <div className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-[10px] font-body text-sm font-medium whitespace-nowrap transition-all w-full text-left
                  ${active === tab.id
                    ? "bg-primary/10 text-primary"
                    : "text-on-surface-variant hover:bg-surface-container"
                  }`}
              >
                <span className="material-symbols-outlined text-lg leading-none">{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.soon && (
                  <span className="ml-auto text-[10px] font-headline font-bold uppercase tracking-wider text-outline bg-surface-container px-2 py-0.5 rounded-full hidden lg:inline">
                    Soon
                  </span>
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          {active === "profile"       && <ProfileTab profile={profile} />}
          {active === "creator"       && <CreatorTab profile={profile} />}
          {active === "appearance"    && <AppearanceTab />}
          {active === "notifications" && <NotificationsTab />}
          {active === "account"       && <AccountTab user={user} />}
        </main>
      </div>
    </div>
  );
}
