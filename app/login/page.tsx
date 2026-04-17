"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { APP_CONFIG } from "@/config/app";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function handleGoogleLogin() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="bg-surface-container-lowest rounded-[1rem] p-10 max-w-md w-full shadow-[0_8px_24px_rgba(92,46,0,0.06)]">

        <Link href="/" className="font-headline text-xl font-bold italic text-primary block mb-8">
          {APP_CONFIG.name}
        </Link>

        <h1 className="font-headline text-3xl font-bold italic text-on-surface mb-1">Welcome back</h1>
        <p className="font-body text-sm text-on-surface-variant mb-8">Log in to your account.</p>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-surface-container-low border border-outline-variant rounded-full py-3 font-body text-sm font-medium text-on-surface hover:bg-surface-container transition-all mb-6"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-outline-variant" />
          <span className="font-body text-xs text-outline">or</span>
          <div className="flex-1 h-px bg-outline-variant" />
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-headline text-xs font-bold uppercase tracking-widest text-outline">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="bg-surface-container-low border-none rounded-[10px] px-4 py-3 font-body text-sm text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-headline text-xs font-bold uppercase tracking-widest text-outline">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="bg-surface-container-low border-none rounded-[10px] px-4 py-3 font-body text-sm text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all outline-none"
            />
          </div>

          {error && (
            <p className="font-body text-xs text-error bg-error-container rounded-[8px] px-4 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="cta-gradient text-on-primary py-3 rounded-full font-body font-bold text-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_2px_8px_rgba(196,94,0,0.25)] disabled:opacity-60 mt-2"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="font-body text-xs text-center text-on-surface-variant mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary font-medium underline underline-offset-4">
            Sign up free
          </Link>
        </p>
      </div>
    </main>
  );
}
