"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const CUISINES = ["North Indian","South Indian","Coastal","Bengali","Fusion","Baking","Continental"];
const MEAL_TYPES = ["Breakfast","Lunch","Dinner","Snack","Dessert","Drink"];
const DIFFICULTIES = ["Easy","Medium","Hard"];

export default function RecipeFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const cuisine = searchParams.get("cuisine");
  const meal = searchParams.get("meal");
  const difficulty = searchParams.get("difficulty");

  const setFilter = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && params.get(key) === value) {
      params.delete(key); // toggle off
    } else if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname, searchParams]);

  const clearAll = () => router.push(pathname, { scroll: false });
  const hasFilters = cuisine || meal || difficulty;

  return (
    <div className="space-y-4 mb-10">
      {/* Cuisine */}
      <div>
        <span className="font-headline text-xs font-bold uppercase tracking-widest text-outline block mb-2">Cuisine</span>
        <div className="flex flex-wrap gap-2">
          {CUISINES.map(c => (
            <button
              key={c}
              onClick={() => setFilter("cuisine", c)}
              className={`px-4 py-1.5 rounded-full font-body text-sm transition-all border ${
                cuisine === c
                  ? "bg-primary text-on-primary border-primary"
                  : "bg-surface-container-lowest border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Meal type */}
      <div>
        <span className="font-headline text-xs font-bold uppercase tracking-widest text-outline block mb-2">Meal</span>
        <div className="flex flex-wrap gap-2">
          {MEAL_TYPES.map(m => (
            <button
              key={m}
              onClick={() => setFilter("meal", m)}
              className={`px-4 py-1.5 rounded-full font-body text-sm transition-all border ${
                meal === m
                  ? "bg-primary text-on-primary border-primary"
                  : "bg-surface-container-lowest border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <span className="font-headline text-xs font-bold uppercase tracking-widest text-outline block mb-2">Difficulty</span>
        <div className="flex flex-wrap gap-2">
          {DIFFICULTIES.map(d => (
            <button
              key={d}
              onClick={() => setFilter("difficulty", d)}
              className={`px-4 py-1.5 rounded-full font-body text-sm transition-all border ${
                difficulty === d
                  ? "bg-primary text-on-primary border-primary"
                  : "bg-surface-container-lowest border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {hasFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1.5 font-body text-sm text-outline hover:text-error transition-colors"
        >
          <span className="material-symbols-outlined text-base">close</span>
          Clear filters
        </button>
      )}
    </div>
  );
}
