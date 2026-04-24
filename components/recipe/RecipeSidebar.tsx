"use client";
import { useState } from "react";

type Ingredient = {
  id: string;
  group_name: string | null;
  order_index: number;
  quantity: number | null;
  unit: string | null;
  ingredient_name: string;
  is_optional: boolean;
};

interface Props {
  ingredients: Ingredient[];
  baseServings: number;
  recipeSlug: string;
  creatorUsername: string;
}

const FRACS: [number, string][] = [
  [0.125, "⅛"], [0.25, "¼"], [0.333, "⅓"],
  [0.5, "½"], [0.666, "⅔"], [0.75, "¾"],
];

function formatQty(base: number, ratio: number): string {
  const val = base * ratio;
  if (val === 0) return "0";
  const intPart = Math.floor(val);
  const fracPart = val - intPart;
  if (fracPart < 0.05) return intPart.toString();
  const match = FRACS.find(([f]) => Math.abs(fracPart - f) < 0.08);
  const fracStr = match ? match[1] : fracPart.toFixed(1).replace("0.", ".");
  return intPart > 0 ? `${intPart}${fracStr}` : fracStr;
}

export default function RecipeSidebar({ ingredients, baseServings, recipeSlug, creatorUsername }: Props) {
  const [servings, setServings] = useState(baseServings);
  const ratio = servings / baseServings;

  // Group ingredients
  const groups: { name: string | null; items: Ingredient[] }[] = [];
  const seen = new Set<string | null>();
  ingredients.forEach(ing => {
    const key = ing.group_name ?? null;
    if (!seen.has(key)) { seen.add(key); groups.push({ name: key, items: [] }); }
    groups.find(g => g.name === key)!.items.push(ing);
  });

  const shareUrl = typeof window !== "undefined"
    ? window.location.href
    : `https://tadka.in/${creatorUsername}/${recipeSlug}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ url: shareUrl });
    } else {
      navigator.clipboard.writeText(shareUrl);
    }
  };

  return (
    <div className="space-y-6">
      {/* Ingredients panel */}
      <div className="bg-surface-container-low rounded-[1rem] p-8">
        {/* Header with scaler */}
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-headline text-2xl font-bold text-on-surface italic">Ingredients</h3>
          <div className="flex items-center gap-2 bg-surface-container-highest rounded-full px-3 py-1.5">
            <button
              onClick={() => setServings(s => Math.max(1, s - 1))}
              disabled={servings <= 1}
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-outline-variant/20 text-primary transition-colors disabled:opacity-30"
            >
              <span className="material-symbols-outlined text-sm">remove</span>
            </button>
            <div className="flex items-center gap-1 min-w-[4rem] justify-center">
              <span className="text-sm font-bold text-on-surface">{servings}</span>
              <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-tighter">Serves</span>
            </div>
            <button
              onClick={() => setServings(s => Math.min(50, s + 1))}
              disabled={servings >= 50}
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-outline-variant/20 text-primary transition-colors disabled:opacity-30"
            >
              <span className="material-symbols-outlined text-sm">add</span>
            </button>
          </div>
        </div>

        {/* Ingredient rows */}
        <ul className="space-y-6 font-body text-lg">
          {groups.map((group, gi) => (
            <li key={gi}>
              {group.name && (
                <p className="text-xs font-bold uppercase tracking-widest text-outline mb-4">{group.name}</p>
              )}
              <ul className="space-y-4">
                {group.items.map(ing => (
                  <li key={ing.id} className="flex justify-between items-start gap-4 pb-4 border-b border-outline-variant/20 group">
                    <span className="group-hover:text-primary transition-colors text-on-surface-variant">
                      {ing.ingredient_name}
                      {ing.is_optional && <span className="italic text-sm ml-1 opacity-60">(optional)</span>}
                    </span>
                    <span className="font-bold text-primary text-right shrink-0">
                      {ing.quantity != null
                        ? `${formatQty(ing.quantity, ratio)}${ing.unit ? ` ${ing.unit}` : ""}`
                        : ing.unit ?? "to taste"}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-[11px] text-center text-on-surface-variant uppercase tracking-widest font-medium opacity-60">
          Quantities update automatically
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-4">
        <button className="cta-gradient text-on-primary w-full py-5 rounded-full font-bold flex items-center justify-center gap-3 shadow-[0_2px_8px_rgba(196,94,0,0.25)] transition-all hover:brightness-110 active:scale-[0.98]">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
          Start Guided Cooking
        </button>
        <button className="bg-surface-container-highest text-on-surface w-full py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-surface-variant transition-colors">
          <span className="material-symbols-outlined">bookmark</span>
          Save to Foodfolio
        </button>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => window.print()}
            className="bg-surface-container-low text-on-surface py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-surface-container-highest transition-colors"
          >
            <span className="material-symbols-outlined text-lg">print</span>
            Print
          </button>
          <button
            onClick={handleShare}
            className="bg-surface-container-low text-on-surface py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-surface-container-highest transition-colors"
          >
            <span className="material-symbols-outlined text-lg">share</span>
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
