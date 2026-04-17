"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const [message, setMessage] = useState("Signing you in...");

  useEffect(() => {
    const supabase = createClient();

    const run = async () => {
      const params = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.substring(1));

      const code        = params.get("code");
      const error       = params.get("error") || hashParams.get("error");
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      // Error from provider
      if (error) {
        window.location.replace(`/login?error=${encodeURIComponent(error)}`);
        return;
      }

      // PKCE flow — code in query string
      if (code) {
        setMessage("Exchanging code...");
        const { error: err } = await supabase.auth.exchangeCodeForSession(code);
        if (err) {
          setMessage("Error: " + err.message);
          setTimeout(() => window.location.replace("/login"), 2000);
          return;
        }
        window.location.replace("/dashboard");
        return;
      }

      // Implicit flow — tokens in URL hash, set session manually
      if (accessToken && refreshToken) {
        setMessage("Setting session...");
        const { error: err } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (err) {
          setMessage("Error: " + err.message);
          setTimeout(() => window.location.replace("/login"), 2000);
          return;
        }
        window.location.replace("/dashboard");
        return;
      }

      // Nothing in URL — try existing session
      setMessage("Checking session...");
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        window.location.replace("/dashboard");
      } else {
        window.location.replace("/login");
      }
    };

    run();
  }, []);

  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-body text-sm text-on-surface-variant italic">{message}</p>
      </div>
    </main>
  );
}
