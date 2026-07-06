import { percentage } from "../lib/calculations.js";

export default function MacroBar({ label, value, target, unit = "g" }) {
  const pct = percentage(value, target);

  return (
    <div className="macro-row">
      <div className="macro-label">
        <span>{label}</span>
        <strong>
          {Math.round(value || 0)} / {target}
          {unit}
        </strong>
      </div>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
