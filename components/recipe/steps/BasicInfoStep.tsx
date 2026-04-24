"use client";

const CUISINES = ["North Indian","South Indian","Coastal","Bengali","Mughlai","Rajasthani","Fusion","Baking","Chinese","Continental","Thai","Mediterranean"];
const MEAL_TYPES = ["Breakfast","Lunch","Dinner","Snack","Dessert","Drink"];
const DIFFICULTIES = ["Easy","Medium","Hard"];

export type BasicInfoData = {
  title: string;
  description: string;
  cover_image_url: string;
  cuisine_type: string[];
  meal_type: string;
  difficulty: string;
  cook_time: string;
  prep_time: string;
  servings: string;
};

interface Props {
  data: BasicInfoData;
  onChange: (data: BasicInfoData) => void;
}

export default function BasicInfoStep({ data, onChange }: Props) {
  const set = (patch: Partial<BasicInfoData>) => onChange({ ...data, ...patch });

  const toggleCuisine = (c: string) => {
    const next = data.cuisine_type.includes(c)
      ? data.cuisine_type.filter(x => x !== c)
      : [...data.cuisine_type, c];
    set({ cuisine_type: next });
  };

  return (
    <div className="space-y-7">
      {/* Title */}
      <div>
        <label className="block font-headline text-sm font-bold text-on-surface mb-2">Recipe Title *</label>
        <input
          type="text"
          value={data.title}
          onChange={e => set({ title: e.target.value })}
          placeholder="e.g. Signature Butter Chicken"
          className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 font-headline text-xl text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block font-headline text-sm font-bold text-on-surface mb-2">Description</label>
        <textarea
          value={data.description}
          onChange={e => set({ description: e.target.value })}
          placeholder="What makes this recipe special? Give readers a reason to cook it."
          rows={3}
          className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 font-body text-base text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors resize-none"
        />
      </div>

      {/* Cover image URL */}
      <div>
        <label className="block font-headline text-sm font-bold text-on-surface mb-2">Cover Image URL</label>
        <input
          type="url"
          value={data.cover_image_url}
          onChange={e => set({ cover_image_url: e.target.value })}
          placeholder="https://..."
          className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 font-body text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
        />
        {data.cover_image_url && (
          <div className="mt-3 w-full h-40 rounded-xl overflow-hidden bg-surface-container">
            <img src={data.cover_image_url} alt="cover preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Cuisine */}
      <div>
        <label className="block font-headline text-sm font-bold text-on-surface mb-3">Cuisine Type</label>
        <div className="flex flex-wrap gap-2">
          {CUISINES.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => toggleCuisine(c)}
              className={`px-4 py-2 rounded-full font-body text-sm transition-all ${
                data.cuisine_type.includes(c)
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Meal type + Difficulty */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block font-headline text-sm font-bold text-on-surface mb-3">Meal Type</label>
          <div className="flex flex-col gap-2">
            {MEAL_TYPES.map(m => (
              <button
                key={m}
                type="button"
                onClick={() => set({ meal_type: m })}
                className={`px-4 py-2 rounded-xl font-body text-sm text-left transition-all ${
                  data.meal_type === m
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container border border-outline-variant text-on-surface-variant hover:border-primary"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-headline text-sm font-bold text-on-surface mb-3">Difficulty</label>
          <div className="flex flex-col gap-2">
            {DIFFICULTIES.map(d => (
              <button
                key={d}
                type="button"
                onClick={() => set({ difficulty: d })}
                className={`px-4 py-2 rounded-xl font-body text-sm text-left transition-all ${
                  data.difficulty === d
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container border border-outline-variant text-on-surface-variant hover:border-primary"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Times + Servings */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Prep time (mins)", key: "prep_time" as const },
          { label: "Cook time (mins)", key: "cook_time" as const },
          { label: "Base servings", key: "servings" as const },
        ].map(({ label, key }) => (
          <div key={key}>
            <label className="block font-headline text-sm font-bold text-on-surface mb-2">{label}</label>
            <input
              type="number"
              min={1}
              value={data[key]}
              onChange={e => set({ [key]: e.target.value })}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 font-body text-base text-on-surface focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
