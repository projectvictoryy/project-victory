"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { APP_CONFIG } from "@/config/app";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "invalid"
  >("idle");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Redirect to dashboard if onboarding already done
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.replace("/login"); return; }
      supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("id", user.id)
        .maybeSingle()
        .then(({ data }: { data: { onboarding_completed: boolean } | null }) => {
          if (data?.onboarding_completed) router.replace("/dashboard");
        });
    });
  }, [router]);

  // Debounced username availability check
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!username) { setUsernameStatus("idle"); return; }

    if (!/^[a-z0-9_]{3,20}$/.test(username)) {
      setUsernameStatus("invalid");
      return;
    }

    setUsernameStatus("checking");
    debounceRef.current = setTimeout(async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", username)
        .maybeSingle();
      setUsernameStatus(data ? "taken" : "available");
    }, 500);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [username]);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (usernameStatus !== "available" || !fullName.trim()) return;

    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace("/login"); return; }

    let avatar_url: string | null = null;

    if (avatarFile) {
      const ext = avatarFile.name.split(".").pop();
      const path = `${user.id}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, avatarFile, { upsert: true });

      if (uploadError) {
        setError("Avatar upload failed. Please try again.");
        setLoading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(path);
      avatar_url = publicUrl;
    }

    const { error: profileError } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: fullName.trim(),
      username,
      avatar_url,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    });

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    router.replace("/dashboard");
  }

  const canSubmit =
    fullName.trim().length > 0 &&
    usernameStatus === "available" &&
    !loading;

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="bg-surface-container-lowest rounded-[1rem] p-10 max-w-md w-full shadow-[0_8px_24px_rgba(92,46,0,0.06)]">
        <div className="font-headline text-xl font-bold italic text-primary mb-8">
          {APP_CONFIG.name}
        </div>

        <h1 className="font-headline text-3xl font-bold italic text-on-surface mb-1">
          Set up your profile
        </h1>
        <p className="font-body text-sm text-on-surface-variant mb-8">
          This is how others will find and follow you.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-2 mb-1">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-surface-container overflow-hidden flex items-center justify-center border border-outline-variant">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="material-symbols-outlined text-outline text-4xl">
                    person
                  </span>
                )}
              </div>
              <label
                htmlFor="avatar-input"
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:bg-primary-container transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-on-primary text-base leading-none">
                  photo_camera
                </span>
              </label>
              <input
                id="avatar-input"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <span className="font-body text-xs text-outline">
              Photo · Optional
            </span>
          </div>

          {/* Display name */}
          <div className="flex flex-col gap-1.5">
            <label className="font-headline text-xs font-bold uppercase tracking-widest text-outline">
              Display name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Priya Kapoor"
              maxLength={50}
              className="bg-surface-container-low border-none rounded-[10px] px-4 py-3 font-body text-sm text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all outline-none"
            />
          </div>

          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <label className="font-headline text-xs font-bold uppercase tracking-widest text-outline">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                placeholder="e.g. priyakitchen"
                maxLength={20}
                className="bg-surface-container-low border-none rounded-[10px] px-4 py-3 font-body text-sm text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all outline-none w-full pr-10"
              />
              {usernameStatus === "checking" && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 font-body text-xs text-outline animate-pulse">
                  …
                </span>
              )}
              {usernameStatus === "available" && (
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-lg leading-none" style={{ color: "#3a7d44" }}>
                  check_circle
                </span>
              )}
              {usernameStatus === "taken" && (
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-error text-lg leading-none">
                  cancel
                </span>
              )}
            </div>

            {usernameStatus === "idle" && (
              <p className="font-body text-xs text-outline">
                Your profile URL: {APP_CONFIG.domain}/[username]
              </p>
            )}
            {usernameStatus === "invalid" && (
              <p className="font-body text-xs text-outline">
                3–20 chars · lowercase letters, numbers, underscores only
              </p>
            )}
            {usernameStatus === "taken" && (
              <p className="font-body text-xs text-error">
                That username is taken. Try another.
              </p>
            )}
            {usernameStatus === "available" && (
              <p className="font-body text-xs" style={{ color: "#3a7d44" }}>
                {APP_CONFIG.domain}/{username} is yours
              </p>
            )}
          </div>

          {error && (
            <p className="font-body text-xs text-error bg-error-container rounded-[8px] px-4 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="cta-gradient text-on-primary py-3 rounded-full font-body font-bold text-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_2px_8px_rgba(196,94,0,0.25)] disabled:opacity-50 mt-2"
          >
            {loading ? "Saving…" : "Continue to dashboard"}
          </button>
        </form>
      </div>
    </main>
  );
}
