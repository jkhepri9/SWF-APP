# Three-Way Nutrition Logging Upgrade

This update gives clients all three calorie-tracking options:

1. Type food search
2. Nutrition label photo scan
3. Barcode scanner

## Files added

- `src/components/BarcodeScanner.jsx`
- `src/components/FoodLogEditor.jsx`
- `src/components/NutritionLabelScanner.jsx`
- `src/lib/labelParser.js`

## Files changed

- `package.json`
- `.env.example`
- `src/lib/foodApi.js`
- `src/components/FoodSearch.jsx`
- `src/pages/Nutrition.jsx`
- `src/index.css`

## Install

Run:

```bash
npm install
npm run dev
```

## Notes

Barcode scanning uses camera access, so it works best on `https://` or `localhost`.

Barcode lookup uses Open Food Facts by barcode.

Label scanning uses browser OCR through Tesseract.js.

Typed food search uses:

1. built-in common foods
2. USDA FoodData Central
3. Open Food Facts
