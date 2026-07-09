import ClientCard from "../components/ClientCard.jsx";
import StatCard from "../components/StatCard.jsx";
import { useApp } from "../context/AppContext.jsx";

export default function Clients({ setActivePage }) {
  const { user, clients, activeClient, activeClientId, setActiveClientId, updateClient } = useApp();

  if (user.role !== "coach") {
    return (
      <section className="panel">
        <h3>Client CRM is coach-only.</h3>
        <p className="muted">Clients can still access dashboard, nutrition, workouts, messages, progress, check-ins, and plans.</p>
      </section>
    );
  }

  const needsAttention = clients.filter((client) => client.status === "Needs attention").length;
  const avgAdherence = Math.round(clients.reduce((sum, client) => sum + client.adherence, 0) / clients.length);

  return (
    <div className="page-grid clients-page">
      <section className="panel wide-panel">
        <div className="section-header">
          <div>
            <p className="eyebrow">Business overview</p>
            <h3>Client roster</h3>
          </div>
          <button className="primary-button">Invite client</button>
        </div>

        <div className="stats-grid compact">
          <StatCard label="Active clients" value={clients.length} helper="current roster" icon="◎" tone="green" />
          <StatCard label="Need attention" value={needsAttention} helper="priority" icon="!" tone="orange" />
          <StatCard label="Avg adherence" value={`${avgAdherence}%`} helper="all clients" icon="✓" tone="blue" />
          <StatCard label="Coach" value={user.name || ""} helper="signed in" icon="◎" tone="purple" />
        </div>
      </section>

      <section className="panel">
        <div className="section-header">
          <div>
            <p className="eyebrow">CRM</p>
            <h3>Clients</h3>
          </div>
        </div>
        <div className="client-list">
          {clients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              active={client.id === activeClientId}
              onClick={() => setActiveClientId(client.id)}
            />
          ))}
        </div>
      </section>

      <section className="panel client-detail">
        <div className="section-header">
          <div>
            <p className="eyebrow">Selected client</p>
            <h3>{activeClient?.name || "No client selected"}</h3>
          </div>
          <span className="status-pill">{activeClient?.status || ""}</span>
        </div>

        <div className="detail-grid">
          <div><span>Email</span><strong>{activeClient?.email || ""}</strong></div>
          <div><span>Goal</span><strong>{activeClient?.goal || ""}</strong></div>
          <div><span>Weight</span><strong>{activeClient?.weight ? `${activeClient.weight} lb` : "0 lb"}</strong></div>
          <div><span>Calories</span><strong>{activeClient?.caloriesTarget || 0}</strong></div>
          <div><span>Protein</span><strong>{activeClient?.proteinTarget ? `${activeClient.proteinTarget}g` : "0g"}</strong></div>
          <div><span>Last check-in</span><strong>{activeClient?.lastCheckIn || ""}</strong></div>
        </div>

        <label className="note-box">
          Coach notes
          <textarea
            value={activeClient?.notes || ""}
            onChange={(event) => updateClient(activeClient?.id, { notes: event.target.value })}
          />
        </label>

        <div className="hero-actions">
          <button className="primary-button" onClick={() => setActivePage("messages")}>Message</button>
          <button className="secondary-button" onClick={() => setActivePage("plans")}>Assign plan</button>
        </div>
      </section>
    </div>
  );
}
