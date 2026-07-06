function numberFromMatch(match) {
  if (!match) return 0;
  const value = Number(String(match[1]).replace(",", ""));
  return Number.isFinite(value) ? value : 0;
}

function readValue(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    const value = numberFromMatch(match);
    if (value) return value;
  }
  return 0;
}

function normalizeNutritionText(text) {
  return text
    .replace(/[|•]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/calorles|cal0ries|calories:/gi, "calories ")
    .replace(/proteln|prolein/gi, "protein")
    .replace(/carbohydrat[e3]/gi, "carbohydrate")
    .replace(/sodlum/gi, "sodium")
    .trim();
}

export function parseNutritionLabel(rawText) {
  const text = normalizeNutritionText(rawText);

  return {
    name: "Scanned nutrition label",
    mealType: "Snack",
    calories: readValue(text, [
      /calories\s+(\d{1,4})/i,
      /amount per serving.*?(\d{1,4})\s*calories/i
    ]),
    protein: readValue(text, [
      /protein\s+(\d{1,3}(?:\.\d+)?)\s*g/i,
      /protein\s*(\d{1,3}(?:\.\d+)?)/i
    ]),
    carbs: readValue(text, [
      /total carbohydrate\s+(\d{1,3}(?:\.\d+)?)\s*g/i,
      /carbohydrate\s+(\d{1,3}(?:\.\d+)?)\s*g/i,
      /total carbs?\s+(\d{1,3}(?:\.\d+)?)\s*g/i
    ]),
    fat: readValue(text, [
      /total fat\s+(\d{1,3}(?:\.\d+)?)\s*g/i,
      /fat\s+(\d{1,3}(?:\.\d+)?)\s*g/i
    ]),
    fiber: readValue(text, [
      /dietary fiber\s+(\d{1,3}(?:\.\d+)?)\s*g/i,
      /fiber\s+(\d{1,3}(?:\.\d+)?)\s*g/i
    ]),
    sugar: readValue(text, [
      /total sugars?\s+(\d{1,3}(?:\.\d+)?)\s*g/i,
      /sugars?\s+(\d{1,3}(?:\.\d+)?)\s*g/i
    ]),
    sodium: readValue(text, [
      /sodium\s+(\d{1,5}(?:\.\d+)?)\s*mg/i,
      /sodium\s*(\d{1,5}(?:\.\d+)?)/i
    ]),
    potassium: readValue(text, [
      /potassium\s+(\d{1,5}(?:\.\d+)?)\s*mg/i,
      /potassium\s*(\d{1,5}(?:\.\d+)?)/i
    ]),
    calcium: readValue(text, [
      /calcium\s+(\d{1,5}(?:\.\d+)?)\s*mg/i,
      /calcium\s*(\d{1,5}(?:\.\d+)?)/i
    ]),
    iron: readValue(text, [
      /iron\s+(\d{1,4}(?:\.\d+)?)\s*mg/i,
      /iron\s*(\d{1,4}(?:\.\d+)?)/i
    ]),
    vitaminD: readValue(text, [
      /vitamin d\s+(\d{1,4}(?:\.\d+)?)\s*mcg/i,
      /vitamin d\s*(\d{1,4}(?:\.\d+)?)/i
    ]),
    magnesium: readValue(text, [
      /magnesium\s+(\d{1,5}(?:\.\d+)?)\s*mg/i,
      /magnesium\s*(\d{1,5}(?:\.\d+)?)/i
    ]),
    zinc: readValue(text, [
      /zinc\s+(\d{1,4}(?:\.\d+)?)\s*mg/i,
      /zinc\s*(\d{1,4}(?:\.\d+)?)/i
    ])
  };
}

export function hasUsefulNutrition(parsed) {
  return Boolean(parsed.calories || parsed.protein || parsed.carbs || parsed.fat);
}
