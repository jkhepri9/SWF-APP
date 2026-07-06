export default function StatCard({ label, value, helper, icon, tone = "default" }) {
  return (
    <article className={`stat-card tone-${tone}`}>
      <div className="stat-icon">{icon}</div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        {helper && <span>{helper}</span>}
      </div>
    </article>
  );
}
