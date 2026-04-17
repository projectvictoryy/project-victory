"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // Listen for auth state — Supabase fires SIGNED_IN automatically
    // when it detects tokens in the URL hash (implicit flow)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        subscription.unsubscribe();
        router.replace("/dashboard");
        return;
      }
    });

    // Also handle PKCE code flow (code in query param)
    const handleCode = async () => {
      const code = new URLSearchParams(window.location.search).get("code");
      const error = new URLSearchParams(window.location.search).get("error");

      if (error) {
        router.replace(`/login?error=${encodeURIComponent(error)}`);
        return;
      }

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          router.replace(`/login?error=${encodeURIComponent(exchangeError.message)}`);
        }
        // SIGNED_IN event will fire and redirect to dashboard
        return;
      }

      // No code and no hash — give it 3 seconds for implicit flow to settle
      // then redirect to login if still no session
      setTimeout(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          subscription.unsubscribe();
          router.replace("/login");
        }
      }, 3000);
    };

    handleCode();

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-body text-sm text-on-surface-variant italic">Signing you in...</p>
      </div>
    </main>
  );
}
