import { commonFoods } from "../data/commonFoods.js";

const OPEN_FOOD_FACTS_SEARCH_URL = "https://world.openfoodfacts.org/cgi/search.pl";
const OPEN_FOOD_FACTS_BARCODE_URL = "https://world.openfoodfacts.org/api/v2/product";
const USDA_SEARCH_URL = "https://api.nal.usda.gov/fdc/v1/foods/search";
const USDA_API_KEY = import.meta.env.VITE_USDA_API_KEY || "DEMO_KEY";

const openFoodFields = [
  "code",
  "product_name",
  "brands",
  "serving_size",
  "quantity",
  "image_front_url",
  "nutriments"
].join(",");

const nutrientIds = {
  calories: [1008],
  protein: [1003],
  fat: [1004],
  carbs: [1005],
  fiber: [1079, 291],
  sugar: [2000, 1063, 269],
  sodium: [1093, 307],
  potassium: [1092, 306],
  calcium: [1087, 301],
  iron: [1089, 303],
  magnesium: [1090, 304],
  zinc: [1095, 309],
  vitaminD: [1114, 324]
};

function cleanNumber(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.round(number * 10) / 10;
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function titleCase(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function tokenScore(query, food) {
  const q = normalizeText(query);
  const haystack = normalizeText([
    food.name,
    food.brand,
    food.serving,
    ...(food.aliases || [])
  ].join(" "));

  if (!q) return 0;
  if (haystack === q) return 120;
  if ((food.aliases || []).some((alias) => normalizeText(alias) === q)) return 110;
  if (normalizeText(food.name) === q) return 100;
  if (haystack.includes(q)) return 80;

  const tokens = q.split(" ").filter(Boolean);
  const matched = tokens.filter((token) => haystack.includes(token)).length;
  return matched ? matched * 18 : 0;
}

function dedupeFoods(foods) {
  const seen = new Set();

  return foods.filter((food) => {
    const key = normalizeText(`${food.name}-${food.brand}-${food.serving}-${food.calories}`);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getOpenFoodNutrient(nutriments, servingKey, hundredGramKey) {
  return cleanNumber(nutriments?.[servingKey] ?? nutriments?.[hundredGramKey] ?? 0);
}

function getUsdaNutrient(food, key) {
  const ids = nutrientIds[key] || [];
  const nutrient = (food.foodNutrients || []).find((item) => ids.includes(Number(item.nutrientId)));
  return cleanNumber(nutrient?.value || 0);
}

function estimateServingFromUsda(food) {
  if (food.servingSize && food.servingSizeUnit) return `${food.servingSize}${food.servingSizeUnit}`;
  return "100g";
}

function normalizeUsdaFood(food) {
  return {
    id: `usda-${food.fdcId}`,
    name: titleCase(food.description || "USDA food"),
    aliases: [],
    brand: food.brandOwner || food.dataType || "USDA FoodData Central",
    serving: estimateServingFromUsda(food),
    grams: food.servingSize || 100,
    image: "",
    barcode: "",
    calories: getUsdaNutrient(food, "calories"),
    protein: getUsdaNutrient(food, "protein"),
    carbs: getUsdaNutrient(food, "carbs"),
    fat: getUsdaNutrient(food, "fat"),
    fiber: getUsdaNutrient(food, "fiber"),
    sugar: getUsdaNutrient(food, "sugar"),
    sodium: getUsdaNutrient(food, "sodium"),
    potassium: getUsdaNutrient(food, "potassium"),
    calcium: getUsdaNutrient(food, "calcium"),
    iron: getUsdaNutrient(food, "iron"),
    magnesium: getUsdaNutrient(food, "magnesium"),
    zinc: getUsdaNutrient(food, "zinc"),
    vitaminD: getUsdaNutrient(food, "vitaminD"),
    source: "USDA"
  };
}

export function normalizeOpenFoodProduct(product) {
  const nutriments = product.nutriments || {};
  const code = product.code || "";

  return {
    id: `off-${code || crypto.randomUUID()}`,
    name: product.product_name || "Unnamed food",
    aliases: [],
    brand: product.brands || "Open Food Facts",
    serving: product.serving_size || product.quantity || "per serving / 100g",
    grams: 100,
    image: product.image_front_url || "",
    barcode: code,
    calories: getOpenFoodNutrient(nutriments, "energy-kcal_serving", "energy-kcal_100g"),
    protein: getOpenFoodNutrient(nutriments, "proteins_serving", "proteins_100g"),
    carbs: getOpenFoodNutrient(nutriments, "carbohydrates_serving", "carbohydrates_100g"),
    fat: getOpenFoodNutrient(nutriments, "fat_serving", "fat_100g"),
    fiber: getOpenFoodNutrient(nutriments, "fiber_serving", "fiber_100g"),
    sugar: getOpenFoodNutrient(nutriments, "sugars_serving", "sugars_100g"),
    sodium: getOpenFoodNutrient(nutriments, "sodium_serving", "sodium_100g") * 1000,
    potassium: getOpenFoodNutrient(nutriments, "potassium_serving", "potassium_100g") * 1000,
    calcium: getOpenFoodNutrient(nutriments, "calcium_serving", "calcium_100g") * 1000,
    iron: getOpenFoodNutrient(nutriments, "iron_serving", "iron_100g") * 1000,
    magnesium: getOpenFoodNutrient(nutriments, "magnesium_serving", "magnesium_100g") * 1000,
    zinc: getOpenFoodNutrient(nutriments, "zinc_serving", "zinc_100g") * 1000,
    vitaminD: getOpenFoodNutrient(nutriments, "vitamin-d_serving", "vitamin-d_100g") * 1000000,
    source: "Open Food Facts"
  };
}

export function searchCommonFoods(query) {
  return commonFoods
    .map((food) => ({ ...food, score: tokenScore(query, food) }))
    .filter((food) => food.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ score, ...food }) => food);
}

export async function searchUsdaFoods(query) {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const response = await fetch(`${USDA_SEARCH_URL}?api_key=${encodeURIComponent(USDA_API_KEY)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: trimmed,
      pageSize: 12,
      dataType: ["Foundation", "SR Legacy", "Survey (FNDDS)", "Branded"],
      sortBy: "dataType.keyword",
      sortOrder: "asc"
    })
  });

  if (!response.ok) {
    throw new Error("USDA search failed.");
  }

  const data = await response.json();

  return (data.foods || [])
    .map(normalizeUsdaFood)
    .filter((food) => food.name && food.calories > 0);
}

export async function searchOpenFoodFacts(query) {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const params = new URLSearchParams({
    search_terms: trimmed,
    search_simple: "1",
    action: "process",
    json: "1",
    page_size: "12",
    fields: openFoodFields
  });

  const response = await fetch(`${OPEN_FOOD_FACTS_SEARCH_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Open Food Facts search failed.");
  }

  const data = await response.json();

  return (data.products || [])
    .map(normalizeOpenFoodProduct)
    .filter((food) => food.name && food.calories > 0);
}

export async function lookupFoodByBarcode(barcode) {
  const cleanBarcode = String(barcode || "").replace(/\D/g, "");

  if (!cleanBarcode) {
    throw new Error("Enter or scan a valid barcode.");
  }

  const response = await fetch(
    `${OPEN_FOOD_FACTS_BARCODE_URL}/${encodeURIComponent(cleanBarcode)}?fields=${encodeURIComponent(openFoodFields)}`
  );

  if (!response.ok) {
    throw new Error("Barcode lookup failed.");
  }

  const data = await response.json();

  if (!data.status || !data.product) {
    throw new Error("No product found for that barcode. Try label scan or manual food search.");
  }

  const food = normalizeOpenFoodProduct({ ...data.product, code: data.code || cleanBarcode });

  if (!food.calories && !food.protein && !food.carbs && !food.fat) {
    throw new Error("Product found, but nutrition data is incomplete. Use label scan instead.");
  }

  return food;
}

export async function searchFoods(query) {
  const localFoods = searchCommonFoods(query);

  let usdaFoods = [];
  let packagedFoods = [];
  const warnings = [];

  try {
    usdaFoods = await searchUsdaFoods(query);
  } catch {
    warnings.push("USDA temporarily unavailable or API limit reached.");
  }

  try {
    packagedFoods = await searchOpenFoodFacts(query);
  } catch {
    warnings.push("Packaged food database temporarily unavailable.");
  }

  const foods = dedupeFoods([
    ...localFoods,
    ...usdaFoods,
    ...packagedFoods
  ]).slice(0, 24);

  return { foods, warnings };
}
