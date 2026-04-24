-- Ingredients per recipe
CREATE TABLE IF NOT EXISTS public.recipe_ingredients (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id       UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  group_name      TEXT,
  order_index     INTEGER NOT NULL DEFAULT 0,
  quantity        NUMERIC(10,3),
  unit            TEXT,
  ingredient_name TEXT NOT NULL,
  is_optional     BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ri_recipe_id_idx ON public.recipe_ingredients(recipe_id);
ALTER TABLE public.recipe_ingredients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read ingredients for published recipes"
  ON public.recipe_ingredients FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.recipes r WHERE r.id = recipe_id AND r.status = 'published' AND r.deleted_at IS NULL));
CREATE POLICY "Owners manage their recipe ingredients"
  ON public.recipe_ingredients FOR ALL
  USING (EXISTS (SELECT 1 FROM public.recipes r WHERE r.id = recipe_id AND r.user_id = auth.uid()));

-- Steps per recipe
CREATE TABLE IF NOT EXISTS public.recipe_steps (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id      UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  step_number    INTEGER NOT NULL,
  instruction    TEXT NOT NULL,
  timer_seconds  INTEGER,
  media_url      TEXT,
  media_provider TEXT CHECK (media_provider IN ('supabase','cloudflare','external')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX rs_recipe_id_idx ON public.recipe_steps(recipe_id);
ALTER TABLE public.recipe_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read steps for published recipes"
  ON public.recipe_steps FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.recipes r WHERE r.id = recipe_id AND r.status = 'published' AND r.deleted_at IS NULL));
CREATE POLICY "Owners manage their recipe steps"
  ON public.recipe_steps FOR ALL
  USING (EXISTS (SELECT 1 FROM public.recipes r WHERE r.id = recipe_id AND r.user_id = auth.uid()));

-- Nutrition per recipe
CREATE TABLE IF NOT EXISTS public.recipe_nutrition (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id   UUID UNIQUE NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  calories    INTEGER,
  protein_g   NUMERIC(6,1),
  carbs_g     NUMERIC(6,1),
  fat_g       NUMERIC(6,1),
  fibre_g     NUMERIC(6,1),
  is_auto     BOOLEAN NOT NULL DEFAULT false,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.recipe_nutrition ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read nutrition for published recipes"
  ON public.recipe_nutrition FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.recipes r WHERE r.id = recipe_id AND r.status = 'published' AND r.deleted_at IS NULL));
CREATE POLICY "Owners manage their recipe nutrition"
  ON public.recipe_nutrition FOR ALL
  USING (EXISTS (SELECT 1 FROM public.recipes r WHERE r.id = recipe_id AND r.user_id = auth.uid()));
