"use client";

import { APP_CONFIG } from "@/config/app";

interface Props {
  username: string;
  name: string;
}

export default function ShareButton({ username, name }: Props) {
  async function handleShare() {
    const url = `https://${APP_CONFIG.domain}/${username}`;
    if (navigator.share) {
      await navigator.share({ title: `${name} on ${APP_CONFIG.name}`, url });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Profile link copied!");
    }
  }

  return (
    <button
      onClick={handleShare}
      className="bg-surface-container-highest text-on-surface px-8 py-3 rounded-full font-body font-bold text-sm hover:bg-outline-variant active:scale-95 transition-all"
    >
      Share
    </button>
  );
}
