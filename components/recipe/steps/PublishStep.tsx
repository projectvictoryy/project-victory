"use client";
import { useEffect } from "react";

export type PublishData = {
  slug: string;
  status: "draft" | "published";
  is_paid: boolean;
  price: string;
};

interface Props {
  data: PublishData;
  recipeTitle: string;
  username: string;
  domain: string;
  onChange: (data: PublishData) => void;
}

function toSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

export default function PublishStep({ data, recipeTitle, username, domain, onChange }: Props) {
  const set = (patch: Partial<PublishData>) => onChange({ ...data, ...patch });

  // Auto-generate slug when title changes and slug hasn't been manually edited
  useEffect(() => {
    if (recipeTitle && (data.slug.startsWith("draft-") || data.slug === "")) {
      set({ slug: toSlug(recipeTitle) });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipeTitle]);

  return (
    <div className="space-y-8">
      {/* URL preview */}
      <div>
        <label className="block font-headline text-sm font-bold text-on-surface mb-2">Recipe URL</label>
        <div className="flex items-center gap-0 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden focus-within:border-primary transition-colors">
          <span className="px-4 py-3 font-body text-sm text-outline bg-surface-container border-r border-outline-variant shrink-0">
            {domain}/{username}/
          </span>
          <input
            type="text"
            value={data.slug}
            onChange={e => set({ slug: toSlug(e.target.value) })}
            className="flex-1 px-4 py-3 font-body text-sm text-on-surface bg-transparent focus:outline-none"
          />
        </div>
        <p className="mt-1.5 font-body text-xs text-outline">
          Only lowercase letters, numbers, and hyphens.
        </p>
      </div>

      {/* Visibility */}
      <div>
        <label className="block font-headline text-sm font-bold text-on-surface mb-3">Visibility</label>
        <div className="grid grid-cols-2 gap-3">
          {(["draft", "published"] as const).map(s => (
            <button
              key={s}
              type="button"
              onClick={() => set({ status: s })}
              className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${
                data.status === s
                  ? "border-primary bg-primary/5"
                  : "border-outline-variant bg-surface-container-lowest hover:border-primary/50"
              }`}
            >
              <span className={`material-symbols-outlined text-xl ${data.status === s ? "text-primary" : "text-outline"}`}>
                {s === "draft" ? "draft" : "public"}
              </span>
              <div>
                <div className={`font-headline font-bold text-sm capitalize ${data.status === s ? "text-primary" : "text-on-surface"}`}>{s}</div>
                <div className="font-body text-xs text-outline">
                  {s === "draft" ? "Only you can see this" : "Visible to everyone"}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div>
        <label className="block font-headline text-sm font-bold text-on-surface mb-3">Pricing</label>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[false, true].map(paid => (
            <button
              key={String(paid)}
              type="button"
              onClick={() => set({ is_paid: paid })}
              className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${
                data.is_paid === paid
                  ? "border-primary bg-primary/5"
                  : "border-outline-variant bg-surface-container-lowest hover:border-primary/50"
              }`}
            >
              <span className={`material-symbols-outlined text-xl ${data.is_paid === paid ? "text-primary" : "text-outline"}`}>
                {paid ? "lock" : "lock_open"}
              </span>
              <div>
                <div className={`font-headline font-bold text-sm ${data.is_paid === paid ? "text-primary" : "text-on-surface"}`}>
                  {paid ? "Paid" : "Free"}
                </div>
                <div className="font-body text-xs text-outline">
                  {paid ? "One-time purchase" : "Anyone can read"}
                </div>
              </div>
            </button>
          ))}
        </div>

        {data.is_paid && (
          <div>
            <label className="block font-headline text-sm font-bold text-on-surface mb-2">Price (₹)</label>
            <div className="flex items-center gap-0 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden focus-within:border-primary w-40 transition-colors">
              <span className="px-4 py-3 font-body text-sm text-outline bg-surface-container border-r border-outline-variant">₹</span>
              <input
                type="number"
                min={1}
                step={1}
                value={data.price}
                onChange={e => set({ price: e.target.value })}
                placeholder="49"
                className="flex-1 px-4 py-3 font-body text-sm text-on-surface bg-transparent focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      {data.status === "published" && (
        <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary text-base">check_circle</span>
            <span className="font-headline font-bold text-sm text-on-surface">Ready to publish</span>
          </div>
          <p className="font-body text-sm text-on-surface-variant">
            Your recipe will be live at{" "}
            <span className="text-primary font-medium">{domain}/{username}/{data.slug}</span>
          </p>
        </div>
      )}
    </div>
  );
}
