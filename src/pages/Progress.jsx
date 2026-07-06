import LineChart from "../components/LineChart.jsx";
import StatCard from "../components/StatCard.jsx";
import { useApp } from "../context/AppContext.jsx";

export default function Progress() {
  const { activeClient, progress } = useApp();
  const data = progress[activeClient.id];

  return (
    <div className="page-grid">
      <section className="panel wide-panel">
        <div className="section-header">
          <div>
            <p className="eyebrow">Analytics</p>
            <h3>{activeClient.name}'s progress</h3>
          </div>
        </div>

        <div className="stats-grid compact">
          <StatCard label="Start weight" value={`${activeClient.startWeight} lb`} helper="baseline" icon="◎" tone="blue" />
          <StatCard label="Current weight" value={`${activeClient.weight} lb`} helper="latest" icon="↘" tone="green" />
          <StatCard label="Body fat" value={`${activeClient.bodyFat}%`} helper="estimated" icon="◒" tone="purple" />
          <StatCard label="Adherence" value={`${activeClient.adherence}%`} helper="7-day score" icon="✓" tone="orange" />
        </div>
      </section>

      <LineChart title="Weight trend" data={data.weight} labels={data.labels} suffix=" lb" />
      <LineChart title="Average calories" data={data.calories} labels={data.labels} />
      <LineChart title="Adherence score" data={data.adherence} labels={data.labels} suffix="%" />

      <section className="panel">
        <div className="section-header">
          <div>
            <p className="eyebrow">Progress photos</p>
            <h3>Visual check</h3>
          </div>
        </div>
        <div className="photo-grid">
          <div className="photo-placeholder">Front</div>
          <div className="photo-placeholder">Side</div>
          <div className="photo-placeholder">Back</div>
        </div>
      </section>
    </div>
  );
}
