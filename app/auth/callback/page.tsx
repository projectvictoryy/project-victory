"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const handleCallback = async () => {
      const hash = window.location.hash;
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const error = params.get("error");

      if (error) {
        router.replace(`/login?error=${encodeURIComponent(error)}`);
        return;
      }

      // PKCE flow — code in query param
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          router.replace(`/login?error=${encodeURIComponent(exchangeError.message)}`);
          return;
        }
        router.replace("/dashboard");
        return;
      }

      // Implicit flow — tokens in URL hash
      if (hash && hash.includes("access_token")) {
        const { error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          router.replace(`/login?error=${encodeURIComponent(sessionError.message)}`);
          return;
        }
        router.replace("/dashboard");
        return;
      }

      // Nothing found — back to login
      router.replace("/login");
    };

    handleCallback();
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
