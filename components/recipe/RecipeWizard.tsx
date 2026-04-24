"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { APP_CONFIG } from "@/config/app";
import BasicInfoStep, { type BasicInfoData } from "./steps/BasicInfoStep";
import IngredientsStep, { type IngredientGroup } from "./steps/IngredientsStep";
import MethodStep, { type StepItem } from "./steps/MethodStep";
import PublishStep, { type PublishData } from "./steps/PublishStep";

type WizardData = BasicInfoData & {
  ingredient_groups: IngredientGroup[];
  steps: StepItem[];
} & PublishData;

interface Props {
  recipeId: string;
  initialData: WizardData & { username?: string };
}

const STEPS = [
  { label: "Basics",      icon: "menu_book" },
  { label: "Ingredients", icon: "grocery" },
  { label: "Method",      icon: "format_list_numbered" },
  { label: "Publish",     icon: "public" },
];

type SaveStatus = "idle" | "saving" | "saved" | "error";

export default function RecipeWizard({ recipeId, initialData }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>(initialData);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [username, setUsername] = useState(initialData.username ?? "");
  const dataRef = useRef(data);
  dataRef.current = data;

  // Fetch username if not passed
  useEffect(() => {
    if (!username) {
      fetch("/api/me").then(r => r.json()).then(d => setUsername(d.username ?? ""));
    }
  }, [username]);

  const save = useCallback(async (d: WizardData) => {
    setSaveStatus("saving");
    try {
      const res = await fetch(`/api/recipes/${recipeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...d,
          ingredient_groups: d.ingredient_groups,
          steps: d.steps,
        }),
      });
      setSaveStatus(res.ok ? "saved" : "error");
    } catch {
      setSaveStatus("error");
    }
    setTimeout(() => setSaveStatus("idle"), 2500);
  }, [recipeId]);

  // Autosave every 30s
  useEffect(() => {
    const t = setInterval(() => save(dataRef.current), 30_000);
    return () => clearInterval(t);
  }, [save]);

  const handleNext = async () => {
    await save(data);
    if (step < 4) setStep(s => s + 1);
  };

  const handleBack = () => { if (step > 1) setStep(s => s - 1); };

  const handlePublish = async () => {
    const d = { ...data, status: "published" as const };
    setData(d);
    await save(d);
    router.push(`/${username}/${data.slug}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-outline-variant">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined text-xl">arrow_back</span>
            <span className="font-body text-sm">Dashboard</span>
          </Link>

          <div className="font-headline font-bold italic text-primary">{APP_CONFIG.name}</div>

          <div className="flex items-center gap-3">
            {saveStatus === "saving" && (
              <span className="font-body text-xs text-outline flex items-center gap-1">
                <span className="material-symbols-outlined text-sm animate-spin">refresh</span> Saving…
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="font-body text-xs text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-primary">check_circle</span> Saved
              </span>
            )}
            {saveStatus === "error" && (
              <span className="font-body text-xs text-error flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">error</span> Save failed
              </span>
            )}
            <button
              onClick={() => save(data)}
              className="font-body text-sm text-on-surface-variant border border-outline-variant px-4 py-2 rounded-full hover:border-primary hover:text-primary transition-all"
            >
              Save draft
            </button>
          </div>
        </div>

        {/* Step indicators */}
        <div className="max-w-3xl mx-auto px-6 pb-4 flex items-center gap-0">
          {STEPS.map((s, i) => {
            const num = i + 1;
            const active = num === step;
            const done = num < step;
            return (
              <div key={s.label} className="flex items-center flex-1">
                <button
                  onClick={() => num < step && setStep(num)}
                  className={`flex items-center gap-2 transition-all ${done ? "cursor-pointer" : "cursor-default"}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-headline font-bold transition-all ${
                    done ? "bg-primary text-on-primary" :
                    active ? "bg-primary/15 text-primary border-2 border-primary" :
                    "bg-surface-container text-outline border border-outline-variant"
                  }`}>
                    {done ? <span className="material-symbols-outlined text-sm">check</span> : num}
                  </div>
                  <span className={`font-body text-sm hidden sm:block ${active ? "text-primary font-medium" : done ? "text-on-surface-variant" : "text-outline"}`}>
                    {s.label}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-3 ${done ? "bg-primary" : "bg-outline-variant"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="font-headline text-3xl font-bold italic text-on-surface mb-1">
            {STEPS[step - 1].label}
          </h1>
          <p className="font-body text-sm text-outline">
            Step {step} of {STEPS.length}
          </p>
        </div>

        {step === 1 && (
          <BasicInfoStep
            data={{
              title: data.title, description: data.description, cover_image_url: data.cover_image_url,
              cuisine_type: data.cuisine_type, meal_type: data.meal_type, difficulty: data.difficulty,
              cook_time: data.cook_time, prep_time: data.prep_time, servings: data.servings,
            }}
            onChange={d => setData(prev => ({ ...prev, ...d }))}
          />
        )}
        {step === 2 && (
          <IngredientsStep
            groups={data.ingredient_groups}
            onChange={groups => setData(prev => ({ ...prev, ingredient_groups: groups }))}
          />
        )}
        {step === 3 && (
          <MethodStep
            steps={data.steps.length > 0 ? data.steps : [{ id: "s1", instruction: "", timer_seconds: null }]}
            onChange={steps => setData(prev => ({ ...prev, steps }))}
          />
        )}
        {step === 4 && (
          <PublishStep
            data={{ slug: data.slug, status: data.status, is_paid: data.is_paid, price: data.price }}
            recipeTitle={data.title}
            username={username}
            domain={APP_CONFIG.domain}
            onChange={d => setData(prev => ({ ...prev, ...d }))}
          />
        )}

        {/* Nav buttons */}
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-outline-variant">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="flex items-center gap-2 font-body text-sm text-on-surface-variant border border-outline-variant px-6 py-3 rounded-full hover:border-primary hover:text-primary disabled:opacity-0 transition-all"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back
          </button>

          {step < 4 ? (
            <button
              onClick={handleNext}
              disabled={!data.title.trim()}
              className="cta-gradient text-on-primary px-8 py-3 rounded-full font-body font-bold text-sm shadow-[0_2px_8px_rgba(196,94,0,0.25)] hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              Next: {STEPS[step].label}
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          ) : (
            <button
              onClick={handlePublish}
              disabled={!data.title.trim() || !data.slug.trim()}
              className="cta-gradient text-on-primary px-8 py-3 rounded-full font-body font-bold text-sm shadow-[0_2px_8px_rgba(196,94,0,0.25)] hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">
                {data.status === "published" ? "public" : "save"}
              </span>
              {data.status === "published" ? "Publish recipe" : "Save as draft"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
