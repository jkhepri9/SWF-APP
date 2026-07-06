import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";

const emptyMeal = {
  name: "",
  mealType: "Breakfast",
  calories: "",
  protein: "",
  carbs: "",
  fat: "",
  fiber: "",
  sodium: "",
  potassium: "",
  iron: "",
  calcium: "",
  vitaminD: "",
  magnesium: "",
  zinc: ""
};

export default function MealForm() {
  const { addMeal } = useApp();
  const [meal, setMeal] = useState(emptyMeal);

  function update(field, value) {
    setMeal((current) => ({ ...current, [field]: value }));
  }

  function submit(event) {
    event.preventDefault();

    if (!meal.name.trim()) return;

    addMeal(
      Object.fromEntries(
        Object.entries(meal).map(([key, value]) => {
          if (key === "name" || key === "mealType") return [key, value];
          return [key, Number(value || 0)];
        })
      )
    );

    setMeal(emptyMeal);
  }

  function mockAIEstimate() {
    setMeal({
      name: "AI estimated salmon rice bowl",
      mealType: "Lunch",
      calories: 685,
      protein: 45,
      carbs: 72,
      fat: 22,
      fiber: 7,
      sodium: 720,
      potassium: 860,
      iron: 4,
      calcium: 110,
      vitaminD: 8,
      magnesium: 95,
      zinc: 3
    });
  }

  return (
    <form className="panel form-panel" onSubmit={submit}>
      <div className="section-header">
        <div>
          <p className="eyebrow">Food log</p>
          <h3>Add meal</h3>
        </div>
        <button type="button" className="ghost-button" onClick={mockAIEstimate}>
          Mock AI scan
        </button>
      </div>

      <div className="form-grid two">
        <label>
          Food / meal name
          <input value={meal.name} onChange={(event) => update("name", event.target.value)} placeholder="Chicken rice bowl" />
        </label>
        <label>
          Meal type
          <select value={meal.mealType} onChange={(event) => update("mealType", event.target.value)}>
            <option>Breakfast</option>
            <option>Lunch</option>
            <option>Dinner</option>
            <option>Snack</option>
            <option>Post-workout</option>
          </select>
        </label>
      </div>

      <div className="form-grid four">
        <label>Calories<input type="number" value={meal.calories} onChange={(event) => update("calories", event.target.value)} /></label>
        <label>Protein<input type="number" value={meal.protein} onChange={(event) => update("protein", event.target.value)} /></label>
        <label>Carbs<input type="number" value={meal.carbs} onChange={(event) => update("carbs", event.target.value)} /></label>
        <label>Fat<input type="number" value={meal.fat} onChange={(event) => update("fat", event.target.value)} /></label>
        <label>Fiber<input type="number" value={meal.fiber} onChange={(event) => update("fiber", event.target.value)} /></label>
        <label>Sodium<input type="number" value={meal.sodium} onChange={(event) => update("sodium", event.target.value)} /></label>
        <label>Potassium<input type="number" value={meal.potassium} onChange={(event) => update("potassium", event.target.value)} /></label>
        <label>Iron<input type="number" value={meal.iron} onChange={(event) => update("iron", event.target.value)} /></label>
      </div>

      <button className="primary-button" type="submit">Add meal</button>
    </form>
  );
}
