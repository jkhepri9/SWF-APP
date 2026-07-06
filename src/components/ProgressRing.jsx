export default function ProgressRing({ value = 0, label = "Score", size = 138 }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;

  return (
    <div className="progress-ring" style={{ width: size, height: size }}>
      <svg viewBox="0 0 140 140">
        <circle className="ring-bg" cx="70" cy="70" r={radius} />
        <circle
          className="ring-fill"
          cx="70"
          cy="70"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="ring-center">
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}
