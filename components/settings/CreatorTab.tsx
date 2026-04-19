"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { APP_CONFIG } from "@/config/app";
import type { Profile } from "./SettingsTabs";

export default function CreatorTab({ profile }: { profile: Profile | null }) {
  const [creatorMode, setCreatorMode] = useState(profile?.creator_mode ?? false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const storefrontUrl = profile?.username
    ? `${APP_CONFIG.domain}/${profile.username}`
    : null;

  async function toggleCreatorMode() {
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const next = !creatorMode;
    await supabase.from("profiles").update({
      creator_mode: next,
      updated_at: new Date().toISOString(),
    }).eq("id", user.id);

    setCreatorMode(next);
    setSaving(false);
  }

  async function copyLink() {
    if (!storefrontUrl) return;
    await navigator.clipboard.writeText(`https://${storefrontUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function shareProfile() {
    if (!storefrontUrl) return;
    if (navigator.share) {
      await navigator.share({
        title: `${profile?.full_name} on ${APP_CONFIG.name}`,
        url: `https://${storefrontUrl}`,
      });
    } else {
      copyLink();
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-headline text-2xl font-bold italic text-on-surface">Creator</h2>
        <p className="font-body text-sm text-on-surface-variant mt-1">
          Manage your creator presence and storefront.
        </p>
      </div>

      <div className="space-y-5">
        {/* Creator Mode Toggle */}
        <section className="bg-surface-container-lowest rounded-[14px] p-6 shadow-[0_1px_4px_rgba(92,46,0,0.06)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-body text-sm font-bold text-on-surface">Creator Mode</h3>
              <p className="font-body text-xs text-on-surface-variant mt-0.5">
                Publish recipes and build your storefront. Free forever.
              </p>
            </div>
            <button
              onClick={toggleCreatorMode}
              disabled={saving}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                creatorMode ? "bg-primary" : "bg-surface-container-high"
              }`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                creatorMode ? "translate-x-6" : "translate-x-0"
              }`} />
            </button>
          </div>
          {creatorMode && (
            <p className="font-body text-xs mt-3 flex items-center gap-1.5" style={{ color: "#3a7d44" }}>
              <span className="material-symbols-outlined text-sm leading-none">check_circle</span>
              Creator mode is active
            </p>
          )}
        </section>

        {/* Storefront URL */}
        {profile?.username && (
          <section className="bg-surface-container-lowest rounded-[14px] p-6 shadow-[0_1px_4px_rgba(92,46,0,0.06)]">
            <h3 className="font-headline text-sm font-bold uppercase tracking-widest text-outline mb-3">Your Storefront</h3>
            <div className="flex items-center gap-3 bg-surface-container-low rounded-[10px] px-4 py-3">
              <span className="material-symbols-outlined text-outline text-base leading-none">link</span>
              <span className="font-body text-sm text-on-surface flex-1">{storefrontUrl}</span>
              <button
                onClick={copyLink}
                className="font-body text-xs font-bold text-primary hover:text-primary-container transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={shareProfile}
                className="flex items-center gap-2 bg-surface-container-high text-on-surface px-5 py-2.5 rounded-full font-body text-sm font-bold hover:bg-outline-variant transition-colors"
              >
                <span className="material-symbols-outlined text-base leading-none">share</span>
                Share profile
              </button>
            </div>
          </section>
        )}

        {/* Tier Info */}
        <section className="bg-surface-container-lowest rounded-[14px] p-6 shadow-[0_1px_4px_rgba(92,46,0,0.06)]">
          <h3 className="font-headline text-sm font-bold uppercase tracking-widest text-outline mb-4">Plan</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm font-bold text-on-surface capitalize">
                {profile?.creator_tier ?? "Free"}
              </p>
              <p className="font-body text-xs text-on-surface-variant mt-0.5">
                Monetisation and analytics unlock in Creator Pro.
              </p>
            </div>
            <span className="px-4 py-1.5 bg-surface-container-high text-on-surface-variant rounded-full font-body text-xs font-bold uppercase tracking-wider">
              Coming soon
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
