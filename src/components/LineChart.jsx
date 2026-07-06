export default function LineChart({ title, data = [], labels = [], suffix = "" }) {
  const width = 520;
  const height = 210;
  const padding = 28;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const spread = max - min || 1;

  const points = data.map((value, index) => {
    const x = padding + (index / Math.max(1, data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / spread) * (height - padding * 2);
    return { x, y, value, label: labels[index] || index + 1 };
  });

  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");

  return (
    <article className="chart-card">
      <div className="chart-header">
        <h4>{title}</h4>
        <span>
          {data[data.length - 1]}
          {suffix}
        </span>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="line-chart">
        <path className="grid-line" d={`M ${padding} ${height - padding} H ${width - padding}`} />
        <path className="grid-line" d={`M ${padding} ${padding} H ${width - padding}`} />
        <path className="line-path" d={path} />
        {points.map((point) => (
          <g key={`${point.x}-${point.y}`}>
            <circle className="line-dot" cx={point.x} cy={point.y} r="5" />
            <text x={point.x} y={height - 6} textAnchor="middle">
              {point.label}
            </text>
          </g>
        ))}
      </svg>
    </article>
  );
}
