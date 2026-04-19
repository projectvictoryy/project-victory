import { createClient } from "@supabase/supabase-js";
import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";
import { resolve } from "path";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const csv = readFileSync(resolve(__dirname, "../supabase/seeds/ingredients.csv"), "utf8");

const rows = parse(csv, { columns: true, skip_empty_lines: true }) as {
  name: string;
  aliases: string;
  category: string;
  unit_type: string;
  diet: string;
}[];

const ingredients = rows.map((r) => ({
  name: r.name,
  aliases: r.aliases ? r.aliases.split(",").map((a) => a.trim()) : [],
  category: r.category,
  unit_type: r.unit_type,
  diet: r.diet,
}));

const { error } = await supabase
  .from("ingredients")
  .upsert(ingredients, { onConflict: "name" });

if (error) {
  console.error("Seed failed:", error.message);
  process.exit(1);
}

console.log(`Seeded ${ingredients.length} ingredients.`);
