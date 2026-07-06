import ProgressRing from "./ProgressRing.jsx";
import MacroBar from "./MacroBar.jsx";
import { calculateCompliance } from "../lib/calculations.js";
import { useApp } from "../context/AppContext.jsx";

export default function ComplianceScore() {
  const { activeClient, activeTotals, workouts, activeClientHabits } = useApp();

  const score = calculateCompliance({
    mealsTotal: activeTotals,
    client: activeClient,
    workouts,
    habits: activeClientHabits
  });

  return (
    <section className="panel compliance-panel">
      <div>
        <p className="eyebrow">AI compliance score</p>
        <h3>Today’s execution</h3>
        <p className="muted">
          A single score based on calories, protein, workout completion, and habits.
        </p>

        <div className="macro-stack">
          <MacroBar label="Calories" value={activeTotals.calories} target={activeClient.caloriesTarget} unit="" />
          <MacroBar label="Protein" value={activeTotals.protein} target={activeClient.proteinTarget} />
          <MacroBar label="Carbs" value={activeTotals.carbs} target={activeClient.carbsTarget} />
          <MacroBar label="Fat" value={activeTotals.fat} target={activeClient.fatTarget} />
        </div>
      </div>

      <ProgressRing value={score} label="Score" />
    </section>
  );
}
