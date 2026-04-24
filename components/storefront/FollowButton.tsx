"use client";

import { useState, useTransition } from "react";
import { toggleFollow } from "@/app/[username]/actions";

interface Props {
  followingId: string;
  initialIsFollowing: boolean;
}

export default function FollowButton({ followingId, initialIsFollowing }: Props) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      setIsFollowing(prev => !prev);
      try {
        const result = await toggleFollow(followingId);
        setIsFollowing(result.isFollowing);
      } catch {
        setIsFollowing(prev => !prev);
      }
    });
  }

  if (isFollowing) {
    return (
      <button
        onClick={handleClick}
        disabled={pending}
        className="group bg-surface-container-highest text-on-surface px-8 py-3 rounded-full font-body font-bold text-sm border border-outline-variant/30 hover:border-error hover:text-error active:scale-95 transition-all disabled:opacity-60"
      >
        <span className="group-hover:hidden">Following</span>
        <span className="hidden group-hover:inline">Unfollow</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="cta-gradient text-on-primary px-8 py-3 rounded-full font-body font-bold text-sm shadow-[0_2px_8px_rgba(196,94,0,0.25)] hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
    >
      Follow
    </button>
  );
}
