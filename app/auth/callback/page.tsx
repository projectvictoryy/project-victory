"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  useEffect(() => {
    const supabase = createClient();

    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const error = params.get("error");

      if (error) {
        window.location.href = `/login?error=${encodeURIComponent(error)}`;
        return;
      }

      // PKCE flow — exchange code for session
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          window.location.href = `/login?error=${encodeURIComponent(exchangeError.message)}`;
          return;
        }
        // Full page reload so server middleware reads fresh cookies
        window.location.href = "/dashboard";
        return;
      }

      // Implicit flow — Supabase auto-detects hash tokens
      // Listen for SIGNED_IN then do a full reload
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN" && session) {
          subscription.unsubscribe();
          window.location.href = "/dashboard";
        }
      });

      // Fallback — if no event after 4s, give up
      setTimeout(async () => {
        subscription.unsubscribe();
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          window.location.href = "/dashboard";
        } else {
          window.location.href = "/login";
        }
      }, 4000);
    };

    handleCallback();
  }, []);

  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-body text-sm text-on-surface-variant italic">Signing you in...</p>
      </div>
    </main>
  );
}
