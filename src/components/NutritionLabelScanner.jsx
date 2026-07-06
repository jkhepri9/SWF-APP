import { useState } from "react";
import { recognize } from "tesseract.js";
import { useApp } from "../context/AppContext.jsx";
import { hasUsefulNutrition, parseNutritionLabel } from "../lib/labelParser.js";

export default function NutritionLabelScanner() {
  const { addMeal } = useApp();
  const [imagePreview, setImagePreview] = useState("");
  const [ocrText, setOcrText] = useState("");
  const [parsedMeal, setParsedMeal] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  async function scanImage(file) {
    if (!file) return;

    setError("");
    setOcrText("");
    setParsedMeal(null);
    setProgress(0);
    setImagePreview(URL.createObjectURL(file));
    setScanning(true);

    try {
      const result = await recognize(file, "eng", {
        logger: (message) => {
          if (message.status === "recognizing text") {
            setProgress(Math.round((message.progress || 0) * 100));
          }
        }
      });

      const text = result?.data?.text || "";
      const parsed = parseNutritionLabel(text);

      setOcrText(text);
      setParsedMeal(parsed);

      if (!hasUsefulNutrition(parsed)) {
        setError("I could not confidently read calories/macros. Try a clearer, closer photo of the Nutrition Facts panel.");
      }
    } catch (err) {
      setError(err.message || "Nutrition label scan failed.");
    } finally {
      setScanning(false);
    }
  }

  function updateParsed(field, value) {
    setParsedMeal((current) => ({
      ...current,
      [field]: field === "name" || field === "mealType" ? value : Number(value || 0)
    }));
  }

  function logScannedMeal() {
    if (!parsedMeal) return;
    addMeal(parsedMeal);
    setParsedMeal(null);
    setOcrText("");
    setImagePreview("");
    setProgress(0);
  }

  return (
    <section className="panel nutrition-option-panel" id="label-scan">
      <div className="section-header">
        <div>
          <p className="eyebrow">Option 2</p>
          <h3>Take a picture of the nutrition label</h3>
        </div>
        <span className="status-pill">OCR scan</span>
      </div>

      <label className="upload-box">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(event) => scanImage(event.target.files?.[0])}
        />
        <span>Upload or take a label photo</span>
        <small>Best results: flat label, good light, close crop.</small>
      </label>

      {scanning && (
        <div className="scan-progress">
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <p>Reading label... {progress}%</p>
        </div>
      )}

      {imagePreview && <img className="label-preview" src={imagePreview} alt="Nutrition label preview" />}

      {error && <p className="form-error">{error}</p>}

      {parsedMeal && (
        <div className="scanner-results">
          <div className="form-grid two">
            <label>
              Name
              <input value={parsedMeal.name} onChange={(event) => updateParsed("name", event.target.value)} />
            </label>
            <label>
              Meal
              <select value={parsedMeal.mealType} onChange={(event) => updateParsed("mealType", event.target.value)}>
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Dinner</option>
                <option>Snack</option>
                <option>Post-workout</option>
              </select>
            </label>
          </div>

          <div className="form-grid four">
            <label>Calories<input type="number" value={parsedMeal.calories} onChange={(event) => updateParsed("calories", event.target.value)} /></label>
            <label>Protein<input type="number" value={parsedMeal.protein} onChange={(event) => updateParsed("protein", event.target.value)} /></label>
            <label>Carbs<input type="number" value={parsedMeal.carbs} onChange={(event) => updateParsed("carbs", event.target.value)} /></label>
            <label>Fat<input type="number" value={parsedMeal.fat} onChange={(event) => updateParsed("fat", event.target.value)} /></label>
            <label>Fiber<input type="number" value={parsedMeal.fiber} onChange={(event) => updateParsed("fiber", event.target.value)} /></label>
            <label>Sodium mg<input type="number" value={parsedMeal.sodium} onChange={(event) => updateParsed("sodium", event.target.value)} /></label>
            <label>Potassium mg<input type="number" value={parsedMeal.potassium} onChange={(event) => updateParsed("potassium", event.target.value)} /></label>
            <label>Calcium mg<input type="number" value={parsedMeal.calcium} onChange={(event) => updateParsed("calcium", event.target.value)} /></label>
          </div>

          <button className="primary-button" type="button" onClick={logScannedMeal}>
            Log scanned nutrition
          </button>
        </div>
      )}

      {ocrText && (
        <details className="ocr-details">
          <summary>View OCR text</summary>
          <pre>{ocrText}</pre>
        </details>
      )}
    </section>
  );
}
