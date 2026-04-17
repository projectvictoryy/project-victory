import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error_param = requestUrl.searchParams.get("error");
  const error_description = requestUrl.searchParams.get("error_description");
  const origin = requestUrl.origin;

  console.log("[auth/callback] code:", code ? "present" : "missing");
  console.log("[auth/callback] error_param:", error_param);
  console.log("[auth/callback] cookies:", request.cookies.getAll().map(c => c.name));

  // OAuth error from Google/Supabase
  if (error_param) {
    console.error("[auth/callback] OAuth error:", error_param, error_description);
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error_description || error_param)}`);
  }

  if (code) {
    const response = NextResponse.redirect(`${origin}/dashboard`);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            console.log("[auth/callback] setting cookies:", cookiesToSet.map(c => c.name));
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    console.log("[auth/callback] exchange result — user:", data?.user?.email, "error:", error?.message);

    if (error) {
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
    }

    return response;
  }

  console.log("[auth/callback] no code — redirecting to login");
  return NextResponse.redirect(`${origin}/login`);
}
