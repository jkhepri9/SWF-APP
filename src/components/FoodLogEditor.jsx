import { useState } from "react";
import { servingUnits } from "../data/commonFoods.js";

function round(value) {
  return Math.round(Number(value || 0) * 10) / 10;
}

export default function FoodLogEditor({ food, defaultMealType = "Snack", onLog, onCancel }) {
  const [amount, setAmount] = useState(1);
  const [unit, setUnit] = useState("serving");
  const [mealType, setMealType] = useState(defaultMealType);

  if (!food) return null;

  function multiplier() {
    const quantity = Number(amount || 0);

    if (unit === "grams") {
      return food.grams ? quantity / Number(food.grams) : quantity / 100;
    }

    if (unit === "ounces") {
      const grams = quantity * 28.3495;
      return food.grams ? grams / Number(food.grams) : grams / 100;
    }

    return quantity;
  }

  function multiply(value) {
    return round(Number(value || 0) * multiplier());
  }

  function logFood() {
    const unitLabel = unit === "serving" ? "serving" : unit;
    const amountLabel = `${amount} ${unitLabel}${Number(amount) === 1 ? "" : "s"}`;

    onLog({
      name: `${food.name} (${amountLabel})`,
      mealType,
      calories: multiply(food.calories),
      protein: multiply(food.protein),
      carbs: multiply(food.carbs),
      fat: multiply(food.fat),
      fiber: multiply(food.fiber),
      sodium: Math.round(multiply(food.sodium)),
      potassium: Math.round(multiply(food.potassium)),
      iron: multiply(food.iron),
      calcium: Math.round(multiply(food.calcium)),
      vitaminD: multiply(food.vitaminD),
      magnesium: Math.round(multiply(food.magnesium)),
      zinc: multiply(food.zinc)
    });
  }

  return (
    <div className="selected-food-card">
      <div>
        <p className="eyebrow">Selected food</p>
        <h4>{food.name}</h4>
        <p>{food.brand} • {food.serving} • {food.source}</p>
        {food.barcode && <p>Barcode: {food.barcode}</p>}
      </div>

      <label>
        Meal
        <select value={mealType} onChange={(event) => setMealType(event.target.value)}>
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Dinner</option>
          <option>Snack</option>
          <option>Post-workout</option>
        </select>
      </label>

      <label>
        Amount
        <input
          type="number"
          min="0.1"
          step="0.1"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
      </label>

      <label>
        Unit
        <select value={unit} onChange={(event) => setUnit(event.target.value)}>
          {servingUnits.map((servingUnit) => (
            <option key={servingUnit.value} value={servingUnit.value}>
              {servingUnit.label}
            </option>
          ))}
        </select>
      </label>

      <div className="macro-preview">
        <span>{multiply(food.calories)} cal</span>
        <span>{multiply(food.protein)}g protein</span>
        <span>{multiply(food.carbs)}g carbs</span>
        <span>{multiply(food.fat)}g fat</span>
      </div>

      <div className="food-editor-actions">
        {onCancel && <button className="ghost-button" type="button" onClick={onCancel}>Cancel</button>}
        <button className="primary-button" type="button" onClick={logFood}>Log food</button>
      </div>
    </div>
  );
}
