import BarcodeScanner from "../components/BarcodeScanner.jsx";
import FoodSearch from "../components/FoodSearch.jsx";
import MealForm from "../components/MealForm.jsx";
import MacroBar from "../components/MacroBar.jsx";
import NutritionLabelScanner from "../components/NutritionLabelScanner.jsx";
import StatCard from "../components/StatCard.jsx";
import { useApp } from "../context/AppContext.jsx";
import { formatNumber } from "../lib/calculations.js";

export default function Nutrition() {
  const { activeClient, activeTotals, activeClientMeals, deleteMeal } = useApp();

  const micros = [
    ["Fiber", activeTotals.fiber, "g"],
    ["Sodium", activeTotals.sodium, "mg"],
    ["Potassium", activeTotals.potassium, "mg"],
    ["Iron", activeTotals.iron, "mg"],
    ["Calcium", activeTotals.calcium, "mg"],
    ["Vitamin D", activeTotals.vitaminD, "mcg"],
    ["Magnesium", activeTotals.magnesium, "mg"],
    ["Zinc", activeTotals.zinc, "mg"]
  ];

  return (
    <div className="page-grid">
      <section className="panel wide-panel">
        <div className="section-header">
          <div>
            <p className="eyebrow">Nutrition command</p>
            <h3>{activeClient.name}'s food log</h3>
          </div>
          <span className="status-pill">Today</span>
        </div>

        <div className="stats-grid compact">
          <StatCard label="Calories" value={formatNumber(activeTotals.calories)} helper={`target ${activeClient.caloriesTarget}`} icon="◒" tone="green" />
          <StatCard label="Protein" value={`${activeTotals.protein}g`} helper={`target ${activeClient.proteinTarget}g`} icon="△" tone="blue" />
          <StatCard label="Carbs" value={`${activeTotals.carbs}g`} helper={`target ${activeClient.carbsTarget}g`} icon="◧" tone="purple" />
          <StatCard label="Fat" value={`${activeTotals.fat}g`} helper={`target ${activeClient.fatTarget}g`} icon="◐" tone="orange" />
        </div>

        <div className="macro-stack">
          <MacroBar label="Calories" value={activeTotals.calories} target={activeClient.caloriesTarget} unit="" />
          <MacroBar label="Protein" value={activeTotals.protein} target={activeClient.proteinTarget} />
          <MacroBar label="Carbs" value={activeTotals.carbs} target={activeClient.carbsTarget} />
          <MacroBar label="Fat" value={activeTotals.fat} target={activeClient.fatTarget} />
        </div>
      </section>

      <section className="panel wide-panel nutrition-methods">
        <div className="section-header">
          <div>
            <p className="eyebrow">Three ways to log food</p>
            <h3>Pick the fastest option</h3>
          </div>
        </div>

        <div className="method-grid">
          <a href="#type-search">
            <strong>Type food</strong>
            <span>Best for apples, bananas, steak, rice, meals, and generic foods.</span>
          </a>
          <a href="#label-scan">
            <strong>Photo label</strong>
            <span>Best when the package has a Nutrition Facts panel.</span>
          </a>
          <a href="#barcode-scan">
            <strong>Barcode</strong>
            <span>Best for packaged foods with UPC/EAN barcodes.</span>
          </a>
        </div>
      </section>

      <FoodSearch />

      <NutritionLabelScanner />

      <BarcodeScanner />

      <MealForm />

      <section className="panel">
        <div className="section-header">
          <div>
            <p className="eyebrow">Micronutrients</p>
            <h3>Health markers</h3>
          </div>
        </div>
        <div className="micro-grid">
          {micros.map(([label, value, unit]) => (
            <div className="micro-card" key={label}>
              <span>{label}</span>
              <strong>{formatNumber(value)} {unit}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="panel wide-panel">
        <div className="section-header">
          <div>
            <p className="eyebrow">Meal history</p>
            <h3>Today’s meals</h3>
          </div>
        </div>

        <div className="table-list">
          {activeClientMeals.map((meal) => (
            <div className="table-row" key={meal.id}>
              <div>
                <strong>{meal.name}</strong>
                <span>{meal.mealType}</span>
              </div>
              <span>{meal.calories} cal</span>
              <span>{meal.protein}g protein</span>
              <span>{meal.carbs}g carbs</span>
              <span>{meal.fat}g fat</span>
              <button className="danger-button" onClick={() => deleteMeal(meal.id)}>Delete</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
