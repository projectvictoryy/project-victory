-- Fake creator: Priya Mahajan (@priyakitchen)
-- Auth user
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  created_at, updated_at, raw_app_meta_data, raw_user_meta_data
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '11111111-1111-1111-1111-111111111111',
  'authenticated', 'authenticated',
  'priya@tadkaseed.dev',
  crypt('SeedPass123!', gen_salt('bf')),
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Priya Mahajan"}'
) ON CONFLICT (id) DO NOTHING;

-- Profile
INSERT INTO public.profiles (
  id, username, full_name, bio, avatar_url, cuisine_tags,
  creator_mode, creator_tier, followers_count, likes_count, onboarding_completed
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'priyakitchen',
  'Priya Mahajan',
  'Home cook from Mumbai sharing recipes my nani taught me — now with a modern twist. Featured in Condé Nast Traveller India.',
  null,
  ARRAY['North Indian','Coastal','Fusion Baking'],
  true, 'pro', 182000, 24100, true
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username, full_name = EXCLUDED.full_name,
  bio = EXCLUDED.bio, cuisine_tags = EXCLUDED.cuisine_tags,
  followers_count = EXCLUDED.followers_count, likes_count = EXCLUDED.likes_count;

-- 4 recipes
INSERT INTO public.recipes
  (user_id, title, slug, description, cover_image_url, cook_time, prep_time, servings, difficulty, cuisine_type, meal_type, status, is_paid, price, view_count, published_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Signature Butter Chicken', 'signature-butter-chicken',
   'My most-requested recipe. A slow-cooked makhani sauce that took three years to perfect — rich, smoky, and absolutely unforgettable.',
   'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&q=80',
   45, 15, 4, 'Medium', ARRAY['North Indian'], 'dinner', 'published', true, 4900, 3812, now()),
  ('11111111-1111-1111-1111-111111111111', 'Slow-Cooked Dal Makhani', 'slow-cooked-dal-makhani',
   'A dhaba-style dal makhani that simmers low and slow for six hours. Smoky, buttery, and better the next day.',
   'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80',
   360, 10, 4, 'Easy', ARRAY['North Indian'], 'dinner', 'published', false, null, 6140, now()),
  ('11111111-1111-1111-1111-111111111111', 'Masala Chai Bundt Cake', 'masala-chai-bundt-cake',
   'Everything you love about a cutting chai — cardamom, ginger, cinnamon — baked into a moist, fragrant cake with a brown butter glaze.',
   'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
   55, 20, 8, 'Medium', ARRAY['Fusion', 'Baking'], 'dessert', 'published', true, 3900, 2290, now()),
  ('11111111-1111-1111-1111-111111111111', 'Prawn Malvani Curry', 'prawn-malvani-curry',
   'A fiery Konkan coast curry from my grandmother''s kitchen in Ratnagiri. Coconut milk tempers the heat.',
   'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&q=80',
   30, 10, 3, 'Medium', ARRAY['Coastal', 'Konkan'], 'dinner', 'published', true, 5900, 1870, now())
ON CONFLICT (user_id, slug) DO NOTHING;
