import Link from "next/link";
import { APP_CONFIG } from "@/config/app";
import type { ReactNode } from "react";

export default function SiteNav({
  center,
  right,
}: {
  center?: ReactNode;
  right: ReactNode;
}) {
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant/20">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="font-headline text-xl font-bold italic text-primary">
          {APP_CONFIG.name}
        </Link>
        {center && (
          <div className="hidden md:flex items-center gap-8">{center}</div>
        )}
        <div className="flex items-center gap-3">{right}</div>
      </div>
    </nav>
  );
}
