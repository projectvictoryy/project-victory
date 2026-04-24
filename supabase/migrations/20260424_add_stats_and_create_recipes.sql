-- Add follower/like counts to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS followers_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS likes_count     INTEGER NOT NULL DEFAULT 0;

-- Recipes table
CREATE TABLE IF NOT EXISTS public.recipes (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  slug             TEXT NOT NULL,
  description      TEXT,
  cover_image_url  TEXT,
  media_url        TEXT,
  media_provider   TEXT CHECK (media_provider IN ('supabase', 'cloudflare', 'external')),
  cook_time        INTEGER,
  prep_time        INTEGER,
  servings         INTEGER,
  difficulty       TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  cuisine_type     TEXT[] DEFAULT '{}',
  meal_type        TEXT,
  status           TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  is_paid          BOOLEAN NOT NULL DEFAULT false,
  price            INTEGER,
  view_count       INTEGER NOT NULL DEFAULT 0,
  published_at     TIMESTAMPTZ,
  scheduled_for    TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at       TIMESTAMPTZ,
  UNIQUE (user_id, slug)
);

CREATE INDEX recipes_user_id_idx  ON public.recipes (user_id);
CREATE INDEX recipes_status_idx   ON public.recipes (status);
CREATE INDEX recipes_slug_idx     ON public.recipes (slug);

ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published recipes"
  ON public.recipes FOR SELECT
  USING (status = 'published' AND deleted_at IS NULL);

CREATE POLICY "Owners can do everything on their recipes"
  ON public.recipes FOR ALL
  USING (auth.uid() = user_id);
