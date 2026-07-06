import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { useApp } from "../context/AppContext.jsx";
import { lookupFoodByBarcode } from "../lib/foodApi.js";
import FoodLogEditor from "./FoodLogEditor.jsx";

export default function BarcodeScanner() {
  const { addMeal } = useApp();
  const videoRef = useRef(null);
  const controlsRef = useRef(null);
  const readerRef = useRef(null);

  const [barcode, setBarcode] = useState("");
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [lookupError, setLookupError] = useState("");
  const [foundFood, setFoundFood] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => stopScanner();
  }, []);

  function stopScanner() {
    try {
      controlsRef.current?.stop?.();
      controlsRef.current = null;
      setScanning(false);
    } catch {
      setScanning(false);
    }
  }

  async function startScanner() {
    setCameraError("");
    setLookupError("");
    setFoundFood(null);

    try {
      const reader = new BrowserMultiFormatReader();
      readerRef.current = reader;

      setScanning(true);

      const controls = await reader.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        async (result) => {
          if (!result) return;

          const value = result.getText();
          setBarcode(value);
          stopScanner();
          await runLookup(value);
        }
      );

      controlsRef.current = controls;
    } catch (err) {
      setScanning(false);
      setCameraError(err.message || "Camera barcode scanner failed. You can still type the barcode manually.");
    }
  }

  async function runLookup(value = barcode) {
    const cleanValue = String(value || "").replace(/\D/g, "");

    if (!cleanValue) {
      setLookupError("Enter or scan a barcode first.");
      return;
    }

    setBarcode(cleanValue);
    setLoading(true);
    setLookupError("");
    setFoundFood(null);

    try {
      const food = await lookupFoodByBarcode(cleanValue);
      setFoundFood(food);
    } catch (err) {
      setLookupError(err.message || "Barcode lookup failed.");
    } finally {
      setLoading(false);
    }
  }

  function logFood(meal) {
    addMeal(meal);
    setFoundFood(null);
    setBarcode("");
  }

  return (
    <section className="panel nutrition-option-panel" id="barcode-scan">
      <div className="section-header">
        <div>
          <p className="eyebrow">Option 3</p>
          <h3>Scan barcode</h3>
        </div>
        <span className="status-pill">Packaged foods</span>
      </div>

      <p className="muted">
        Use this for packaged foods with UPC/EAN barcodes. For apples, bananas,
        steak, and home-cooked meals, use typed search or label scan instead.
      </p>

      <div className="barcode-controls">
        <button className={scanning ? "danger-button" : "primary-button"} type="button" onClick={scanning ? stopScanner : startScanner}>
          {scanning ? "Stop camera" : "Start camera scan"}
        </button>
      </div>

      <div className={`barcode-video-wrap ${scanning ? "active" : ""}`}>
        <video ref={videoRef} muted playsInline />
        {!scanning && <span>Camera preview appears here</span>}
      </div>

      {cameraError && <p className="form-error">{cameraError}</p>}

      <div className="barcode-manual">
        <label>
          Or type barcode manually
          <input
            value={barcode}
            onChange={(event) => setBarcode(event.target.value)}
            placeholder="Example: 737628064502"
            inputMode="numeric"
          />
        </label>
        <button className="secondary-button" type="button" onClick={() => runLookup()} disabled={loading}>
          {loading ? "Looking up..." : "Lookup barcode"}
        </button>
      </div>

      {lookupError && <p className="form-error">{lookupError}</p>}

      <FoodLogEditor
        food={foundFood}
        defaultMealType="Snack"
        onLog={logFood}
        onCancel={() => setFoundFood(null)}
      />
    </section>
  );
}
