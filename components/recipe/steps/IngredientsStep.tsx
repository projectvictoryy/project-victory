"use client";
import { useId } from "react";

const UNITS = ["g","kg","ml","l","tsp","tbsp","cup","piece","clove","bunch","slice","pinch","sprig","to taste"];

export type IngredientItem = {
  id: string;
  quantity: string;
  unit: string;
  ingredient_name: string;
  is_optional: boolean;
};

export type IngredientGroup = {
  id: string;
  group_name: string;
  items: IngredientItem[];
};

interface Props {
  groups: IngredientGroup[];
  onChange: (groups: IngredientGroup[]) => void;
}

function uid() { return Math.random().toString(36).slice(2); }

function emptyItem(): IngredientItem {
  return { id: uid(), quantity: "", unit: "g", ingredient_name: "", is_optional: false };
}

export default function IngredientsStep({ groups, onChange }: Props) {
  const rootId = useId();

  const updateGroup = (gid: string, patch: Partial<IngredientGroup>) =>
    onChange(groups.map(g => g.id === gid ? { ...g, ...patch } : g));

  const removeGroup = (gid: string) => onChange(groups.filter(g => g.id !== gid));

  const addGroup = () =>
    onChange([...groups, { id: uid(), group_name: "", items: [emptyItem()] }]);

  const updateItem = (gid: string, iid: string, patch: Partial<IngredientItem>) =>
    updateGroup(gid, {
      items: groups.find(g => g.id === gid)!.items.map(i => i.id === iid ? { ...i, ...patch } : i),
    });

  const addItem = (gid: string) =>
    updateGroup(gid, { items: [...groups.find(g => g.id === gid)!.items, emptyItem()] });

  const removeItem = (gid: string, iid: string) =>
    updateGroup(gid, { items: groups.find(g => g.id === gid)!.items.filter(i => i.id !== iid) });

  return (
    <div className="space-y-6">
      <p className="font-body text-sm text-on-surface-variant">
        Add ingredients in the order they&apos;re needed. Use groups (e.g. &ldquo;For the marinade&rdquo;) to organise complex recipes.
        <br />
        <span className="text-primary font-medium">Base servings from Step 1 are used for the auto-adjust scaler on the recipe page.</span>
      </p>

      {groups.map((group, gi) => (
        <div key={group.id} className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden">
          {/* Group header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant bg-surface-container-low">
            <input
              type="text"
              value={group.group_name}
              onChange={e => updateGroup(group.id, { group_name: e.target.value })}
              placeholder={groups.length > 1 ? "Group name (e.g. For the sauce)" : "Group name (optional)"}
              className="flex-1 bg-transparent font-headline font-bold text-sm text-on-surface placeholder:text-outline focus:outline-none"
            />
            {groups.length > 1 && (
              <button
                type="button"
                onClick={() => removeGroup(group.id)}
                className="text-outline hover:text-error transition-colors"
              >
                <span className="material-symbols-outlined text-lg">delete</span>
              </button>
            )}
          </div>

          {/* Ingredient rows */}
          <div className="divide-y divide-outline-variant">
            {group.items.map((item) => (
              <div key={item.id} className="flex items-center gap-2 px-4 py-3">
                {/* Quantity */}
                <input
                  type="number"
                  min={0}
                  step="any"
                  value={item.quantity}
                  onChange={e => updateItem(group.id, item.id, { quantity: e.target.value })}
                  placeholder="Qty"
                  disabled={item.unit === "to taste"}
                  className="w-16 bg-surface-container border border-outline-variant rounded-lg px-2 py-2 font-body text-sm text-on-surface text-center focus:outline-none focus:border-primary disabled:opacity-40 transition-colors"
                />

                {/* Unit */}
                <select
                  value={item.unit}
                  onChange={e => updateItem(group.id, item.id, { unit: e.target.value })}
                  className="w-28 bg-surface-container border border-outline-variant rounded-lg px-2 py-2 font-body text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                >
                  {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>

                {/* Name */}
                <input
                  type="text"
                  value={item.ingredient_name}
                  onChange={e => updateItem(group.id, item.id, { ingredient_name: e.target.value })}
                  placeholder="Ingredient name"
                  className="flex-1 bg-transparent border-b border-outline-variant font-body text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary pb-1 transition-colors"
                />

                {/* Optional */}
                <label className="flex items-center gap-1 cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={item.is_optional}
                    onChange={e => updateItem(group.id, item.id, { is_optional: e.target.checked })}
                    className="accent-primary"
                  />
                  <span className="font-body text-xs text-outline">opt</span>
                </label>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeItem(group.id, item.id)}
                  disabled={group.items.length === 1}
                  className="text-outline hover:text-error disabled:opacity-20 transition-colors"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>
            ))}
          </div>

          {/* Add ingredient */}
          <div className="px-4 py-3 border-t border-outline-variant">
            <button
              type="button"
              onClick={() => addItem(group.id)}
              className="flex items-center gap-1.5 font-body text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <span className="material-symbols-outlined text-base">add</span>
              Add ingredient
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addGroup}
        className="flex items-center gap-2 w-full justify-center py-3 border-2 border-dashed border-outline-variant rounded-2xl font-body text-sm text-outline hover:border-primary hover:text-primary transition-colors"
      >
        <span className="material-symbols-outlined text-base">add</span>
        Add ingredient group
      </button>
    </div>
  );
}
