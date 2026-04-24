import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ username: null });
  const { data } = await supabase.from("profiles").select("username").eq("id", user.id).maybeSingle();
  return NextResponse.json({ username: data?.username ?? null });
}
