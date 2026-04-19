CREATE TABLE ingredients (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL UNIQUE,
  aliases      TEXT[] NOT NULL DEFAULT '{}',
  category     TEXT NOT NULL,
  unit_type    TEXT NOT NULL CHECK (unit_type IN ('weight', 'volume', 'whole', 'pinch')),
  diet         TEXT NOT NULL CHECK (diet IN ('vegan', 'veg', 'eggetarian', 'non_veg')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- GIN index for fast full-text search across name + aliases
CREATE INDEX ingredients_search_idx ON ingredients USING GIN (
  (to_tsvector('english', name) || to_tsvector('english', array_to_string(aliases, ' ')))
);

-- Simple index for category filtering
CREATE INDEX ingredients_category_idx ON ingredients (category);
CREATE INDEX ingredients_diet_idx ON ingredients (diet);

-- Public read, no writes from client
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read ingredients" ON ingredients FOR SELECT USING (true);
