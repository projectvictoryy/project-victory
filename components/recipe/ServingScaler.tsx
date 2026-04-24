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
  initialServings: number;
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

export default function ServingScaler({ ingredients, baseServings, initialServings }: Props) {
  const [servings, setServings] = useState(initialServings);
  const ratio = servings / baseServings;

  // Group ingredients
  const groups: { name: string | null; items: Ingredient[] }[] = [];
  const seen = new Set<string | null>();
  ingredients.forEach(ing => {
    const key = ing.group_name;
    if (!seen.has(key)) {
      seen.add(key);
      groups.push({ name: key, items: [] });
    }
    groups.find(g => g.name === key)!.items.push(ing);
  });

  return (
    <div>
      {/* Scaler control */}
      <div className="flex items-center justify-between bg-surface-container-lowest border border-outline-variant rounded-2xl px-5 py-4 mb-6">
        <div>
          <div className="font-headline font-bold text-sm text-on-surface">Servings</div>
          <div className="font-body text-xs text-outline mt-0.5">Quantities update automatically</div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setServings(s => Math.max(1, s - 1))}
            disabled={servings <= 1}
            className="w-9 h-9 rounded-full border border-outline-variant flex items-center justify-center font-body text-lg text-primary hover:bg-primary/10 disabled:opacity-30 transition-all"
          >−</button>
          <span className="font-headline font-bold text-2xl text-on-surface min-w-[2rem] text-center">{servings}</span>
          <button
            onClick={() => setServings(s => Math.min(50, s + 1))}
            disabled={servings >= 50}
            className="w-9 h-9 rounded-full border border-outline-variant flex items-center justify-center font-body text-lg text-primary hover:bg-primary/10 disabled:opacity-30 transition-all"
          >+</button>
        </div>
      </div>

      {/* Ingredient list */}
      <div className="space-y-5">
        {groups.map((group, gi) => (
          <div key={gi}>
            {group.name && (
              <div className="font-headline text-xs font-bold uppercase tracking-widest text-outline mb-3">
                {group.name}
              </div>
            )}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl divide-y divide-outline-variant overflow-hidden">
              {group.items.map(ing => (
                <div key={ing.id} className="flex items-center gap-3 px-5 py-3.5">
                  <CheckBox />
                  <span className="font-headline font-bold text-sm text-primary min-w-[72px]">
                    {ing.quantity != null
                      ? `${formatQty(ing.quantity, ratio)} ${ing.unit ?? ""}`.trim()
                      : ing.unit ?? "to taste"}
                  </span>
                  <span className="font-body text-sm text-on-surface flex-1">{ing.ingredient_name}</span>
                  {ing.is_optional && (
                    <span className="font-body text-xs text-outline italic">optional</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CheckBox() {
  const [checked, setChecked] = useState(false);
  return (
    <button
      onClick={() => setChecked(c => !c)}
      className={`w-5 h-5 rounded-md border shrink-0 flex items-center justify-center transition-all ${
        checked ? "bg-primary border-primary" : "border-outline-variant hover:border-primary"
      }`}
    >
      {checked && <span className="material-symbols-outlined text-on-primary text-xs" style={{ fontSize: "13px" }}>check</span>}
    </button>
  );
}
