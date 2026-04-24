"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Props {
  avatarUrl: string | null;
  username: string;
  fullName: string;
}

export default function NavUserMenu({ avatarUrl, username, fullName }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  const initials = fullName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-9 h-9 rounded-full overflow-hidden bg-surface-container-high border-2 border-surface-container-highest hover:border-primary transition-colors focus:outline-none"
        aria-label="Account menu"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
        ) : (
          <span className="w-full h-full flex items-center justify-center font-headline text-xs font-bold text-on-surface-variant">
            {initials}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest rounded-[14px] shadow-[0_4px_20px_rgba(92,46,0,0.12)] border border-outline-variant/30 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-outline-variant/20">
            <p className="font-body text-sm font-medium text-on-surface truncate">{fullName}</p>
            <p className="font-body text-xs text-on-surface-variant truncate">@{username}</p>
          </div>
          <div className="py-1.5">
            <Link
              href={`/${username}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 font-body text-sm text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-base leading-none text-outline">person</span>
              My profile
            </Link>
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 font-body text-sm text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-base leading-none text-outline">settings</span>
              Settings
            </Link>
          </div>
          <div className="py-1.5 border-t border-outline-variant/20">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 font-body text-sm text-error hover:bg-error/5 transition-colors"
            >
              <span className="material-symbols-outlined text-base leading-none">logout</span>
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
