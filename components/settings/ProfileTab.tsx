"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "./SettingsTabs";

const CUISINE_OPTIONS = [
  "North Indian", "South Indian", "Bengali", "Gujarati", "Maharashtrian",
  "Punjabi", "Rajasthani", "Goan", "Kerala", "Tamil", "Mughlai",
  "Italian", "Mexican", "Chinese", "Japanese", "Thai", "Middle Eastern",
  "French", "Mediterranean", "American", "Korean", "Vietnamese",
  "Baking", "Desserts", "Street Food", "Healthy", "Vegan", "Breakfast", "Quick Meals",
];

export default function ProfileTab({ profile }: { profile: Profile | null }) {
  const [fullName, setFullName]         = useState(profile?.full_name ?? "");
  const [username, setUsername]         = useState(profile?.username ?? "");
  const [bio, setBio]                   = useState(profile?.bio ?? "");
  const [cuisineTags, setCuisineTags]   = useState<string[]>(profile?.cuisine_tags ?? []);
  const [avatarFile, setAvatarFile]     = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile?.avatar_url ?? null);
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");
  const [saving, setSaving]             = useState(false);
  const [saved, setSaved]               = useState(false);
  const [error, setError]               = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!username || username === profile?.username) { setUsernameStatus("idle"); return; }
    if (!/^[a-z0-9_]{3,20}$/.test(username)) { setUsernameStatus("invalid"); return; }

    setUsernameStatus("checking");
    debounceRef.current = setTimeout(async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("profiles").select("username").eq("username", username).maybeSingle();
      setUsernameStatus(data ? "taken" : "available");
    }, 500);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [username, profile?.username]);

  function toggleCuisine(tag: string) {
    setCuisineTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (usernameStatus === "taken" || usernameStatus === "invalid") return;
    setSaving(true);
    setError("");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let avatar_url = profile?.avatar_url ?? null;

    if (avatarFile) {
      const ext = avatarFile.name.split(".").pop();
      const path = `${user.id}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars").upload(path, avatarFile, { upsert: true });
      if (uploadError) { setError("Avatar upload failed."); setSaving(false); return; }
      avatar_url = supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
    }

    const { error: updateError } = await supabase.from("profiles").update({
      full_name: fullName.trim(),
      username: username.trim(),
      bio: bio.trim() || null,
      avatar_url,
      cuisine_tags: cuisineTags,
      updated_at: new Date().toISOString(),
    }).eq("id", user.id);

    if (updateError) { setError(updateError.message); setSaving(false); return; }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-headline text-2xl font-bold italic text-on-surface">Profile</h2>
        <p className="font-body text-sm text-on-surface-variant mt-1">
          This is your public profile — visible on your storefront.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Avatar */}
        <section className="bg-surface-container-lowest rounded-[14px] p-6 shadow-[0_1px_4px_rgba(92,46,0,0.06)]">
          <h3 className="font-headline text-sm font-bold uppercase tracking-widest text-outline mb-4">Photo</h3>
          <div className="flex items-center gap-6">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-surface-container-high border-2 border-outline-variant">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-outline text-4xl">person</span>
                  </div>
                )}
              </div>
              <label htmlFor="avatar-input" className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:bg-primary-container transition-colors shadow-sm">
                <span className="material-symbols-outlined text-on-primary text-base leading-none">photo_camera</span>
              </label>
              <input id="avatar-input" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </div>
            <div>
              <p className="font-body text-sm text-on-surface font-medium">Upload a photo</p>
              <p className="font-body text-xs text-on-surface-variant mt-0.5">JPG, PNG or WebP. Max 5MB.</p>
            </div>
          </div>
        </section>

        {/* Basic Info */}
        <section className="bg-surface-container-lowest rounded-[14px] p-6 shadow-[0_1px_4px_rgba(92,46,0,0.06)] space-y-5">
          <h3 className="font-headline text-sm font-bold uppercase tracking-widest text-outline">Basic Info</h3>

          <div className="flex flex-col gap-1.5">
            <label className="font-headline text-xs font-bold uppercase tracking-widest text-outline">Display name</label>
            <input
              type="text" required value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              maxLength={50}
              className="bg-surface-container-low rounded-[10px] px-4 py-3 font-body text-sm text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all outline-none border-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-headline text-xs font-bold uppercase tracking-widest text-outline">Username</label>
            <div className="relative">
              <input
                type="text" required value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                maxLength={20}
                className="bg-surface-container-low rounded-[10px] px-4 py-3 font-body text-sm text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all outline-none border-none w-full pr-10"
              />
              {usernameStatus === "checking" && <span className="absolute right-3 top-1/2 -translate-y-1/2 font-body text-xs text-outline animate-pulse">…</span>}
              {usernameStatus === "available" && <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-lg leading-none" style={{ color: "#3a7d44" }}>check_circle</span>}
              {usernameStatus === "taken"     && <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-error text-lg leading-none">cancel</span>}
            </div>
            {usernameStatus === "invalid" && <p className="font-body text-xs text-outline">3–20 chars · lowercase letters, numbers, underscores only</p>}
            {usernameStatus === "taken"   && <p className="font-body text-xs text-error">That username is taken.</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-headline text-xs font-bold uppercase tracking-widest text-outline">Bio</label>
            <textarea
              value={bio} onChange={(e) => setBio(e.target.value)}
              rows={3} maxLength={200}
              placeholder="Tell your audience about yourself…"
              className="bg-surface-container-low rounded-[10px] px-4 py-3 font-body text-sm text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all outline-none border-none resize-none"
            />
            <p className="font-body text-xs text-outline text-right">{bio.length}/200</p>
          </div>
        </section>

        {/* Cuisine Tags */}
        <section className="bg-surface-container-lowest rounded-[14px] p-6 shadow-[0_1px_4px_rgba(92,46,0,0.06)]">
          <h3 className="font-headline text-sm font-bold uppercase tracking-widest text-outline mb-1">Cuisine Tags</h3>
          <p className="font-body text-xs text-on-surface-variant mb-4">Pick up to 5 cuisines that best describe your cooking.</p>
          <div className="flex flex-wrap gap-2">
            {CUISINE_OPTIONS.map((tag) => {
              const selected = cuisineTags.includes(tag);
              const maxed = cuisineTags.length >= 5 && !selected;
              return (
                <button
                  key={tag} type="button"
                  disabled={maxed}
                  onClick={() => toggleCuisine(tag)}
                  className={`px-4 py-1.5 rounded-full font-body text-xs font-medium transition-all
                    ${selected
                      ? "bg-primary text-on-primary shadow-sm"
                      : maxed
                        ? "bg-surface-container text-outline cursor-not-allowed opacity-50"
                        : "bg-surface-container-high text-on-surface-variant hover:bg-outline-variant"
                    }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </section>

        {error && <p className="font-body text-xs text-error bg-error-container rounded-[8px] px-4 py-2">{error}</p>}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving || usernameStatus === "taken" || usernameStatus === "invalid"}
            className="cta-gradient text-on-primary px-8 py-3 rounded-full font-body font-bold text-sm shadow-[0_2px_8px_rgba(196,94,0,0.25)] hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 font-body text-sm font-medium" style={{ color: "#3a7d44" }}>
              <span className="material-symbols-outlined text-base leading-none">check_circle</span>
              Saved
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
