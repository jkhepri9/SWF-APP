import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { searchFoods } from "../lib/foodApi.js";
import FoodLogEditor from "./FoodLogEditor.jsx";

function sourceRank(source) {
  if (source === "Built-in estimate") return 1;
  if (source === "USDA") return 2;
  return 3;
}

export default function FoodSearch() {
  const { addMeal } = useApp();
  const [query, setQuery] = useState("");
  const [mealType, setMealType] = useState("Lunch");
  const [results, setResults] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [warnings, setWarnings] = useState([]);
  const [activeSource, setActiveSource] = useState("All");

  const sourceTabs = useMemo(() => {
    const sources = Array.from(new Set(results.map((food) => food.source))).sort((a, b) => sourceRank(a) - sourceRank(b));
    return ["All", ...sources];
  }, [results]);

  const visibleResults = useMemo(() => {
    if (activeSource === "All") return results;
    return results.filter((food) => food.source === activeSource);
  }, [activeSource, results]);

  async function runSearch(searchQuery = query) {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    setLoading(true);
    setError("");
    setWarnings([]);
    setSelectedFood(null);
    setActiveSource("All");

    try {
      const { foods, warnings: nextWarnings } = await searchFoods(trimmed);
      setResults(foods);
      setWarnings(nextWarnings || []);

      if (!foods.length) {
        setError("No solid matches found. Try a simpler food name, brand name, scan a label, or log it manually below.");
      }
    } catch (err) {
      setError(err.message || "Food search failed.");
    } finally {
      setLoading(false);
    }
  }

  function submit(event) {
    event.preventDefault();
    runSearch();
  }

  function quickSearch(foodName) {
    setQuery(foodName);
    runSearch(foodName);
  }

  function logSelectedFood(meal) {
    addMeal(meal);
    setSelectedFood(null);
  }

  return (
    <section className="panel wide-panel food-search-panel" id="type-search">
      <div className="section-header">
        <div>
          <p className="eyebrow">Option 1</p>
          <h3>Search by typing food</h3>
        </div>
        <span className="status-pill">Built-in + USDA + packaged foods</span>
      </div>

      <div className="quick-foods">
        {["apple", "banana", "steak", "eggs", "rice", "lentils", "chicken breast", "salmon"].map((food) => (
          <button key={food} type="button" onClick={() => quickSearch(food)}>
            {food}
          </button>
        ))}
      </div>

      <form className="food-search-form" onSubmit={submit}>
        <label>
          Search food
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Apple, banana, steak, eggs, rice, chicken breast, Greek yogurt..."
          />
        </label>

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

        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {warnings.length > 0 && (
        <div className="warning-list">
          {warnings.map((warning) => <span key={warning}>{warning}</span>)}
        </div>
      )}

      {error && <p className="form-error">{error}</p>}

      {results.length > 0 && (
        <div className="source-tabs">
          {sourceTabs.map((source) => (
            <button
              key={source}
              className={activeSource === source ? "active" : ""}
              type="button"
              onClick={() => setActiveSource(source)}
            >
              {source}
            </button>
          ))}
        </div>
      )}

      <FoodLogEditor
        food={selectedFood}
        defaultMealType={mealType}
        onLog={logSelectedFood}
        onCancel={() => setSelectedFood(null)}
      />

      <div className="food-results-grid">
        {visibleResults.map((food) => (
          <button
            className={`food-result-card ${selectedFood?.id === food.id ? "active" : ""}`}
            key={food.id}
            onClick={() => setSelectedFood(food)}
            type="button"
          >
            {food.image ? <img src={food.image} alt="" /> : <div className="food-image-fallback">{food.source === "USDA" ? "USDA" : "Food"}</div>}
            <div>
              <strong>{food.name}</strong>
              <p>{food.brand}</p>
              <span>{food.serving}</span>
            </div>
            <div className="food-macros">
              <span>{food.calories} cal</span>
              <span>{food.protein}g P</span>
              <span>{food.carbs}g C</span>
              <span>{food.fat}g F</span>
              <span>{food.source}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
