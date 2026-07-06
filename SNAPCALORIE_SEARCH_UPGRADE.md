# SnapCalorie-style Search Upgrade

This version improves the food search so simple foods work.

## Search order

1. Built-in common foods database
   - apple
   - banana
   - steak
   - eggs
   - rice
   - lentils
   - chicken breast
   - salmon
   - potatoes
   - beans
   - yogurt
   - peanut butter
   - and more

2. USDA FoodData Central
   - better for generic foods and whole foods

3. Open Food Facts
   - better for packaged/branded foods

## USDA key

The app defaults to:

```bash
VITE_USDA_API_KEY=DEMO_KEY
```

For real client use, create a `.env` file and add your own key:

```bash
VITE_USDA_API_KEY=your_key_here
```

Then restart:

```bash
npm run dev
```

## Files changed

- `.env.example`
- `package.json`
- `src/data/commonFoods.js`
- `src/lib/foodApi.js`
- `src/components/FoodSearch.jsx`
- `src/pages/Nutrition.jsx`
- `src/index.css`
