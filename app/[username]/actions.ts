"use server";

import { createClient } from "@/lib/supabase/server";

export async function toggleFollow(followingId: string): Promise<{ isFollowing: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: existing } = await supabase
    .from("follows")
    .select("follower_id")
    .eq("follower_id", user.id)
    .eq("following_id", followingId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("follows")
      .delete()
      .eq("follower_id", user.id)
      .eq("following_id", followingId);
    return { isFollowing: false };
  } else {
    await supabase
      .from("follows")
      .insert({ follower_id: user.id, following_id: followingId });
    return { isFollowing: true };
  }
}
