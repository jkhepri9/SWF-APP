import { useApp } from "../context/AppContext.jsx";

export default function Plans() {
  const { plans, clients, activeClient } = useApp();

  return (
    <div className="page-grid">
      <section className="panel wide-panel">
        <div className="section-header">
          <div>
            <p className="eyebrow">Meal and workout plans</p>
            <h3>Templates & assignments</h3>
          </div>
          <button className="primary-button">Create plan</button>
        </div>
        <p className="muted">
          This page is ready for your coach-created meal plans, workout programs,
          grocery lists, and habit plans.
        </p>
      </section>

      {plans.map((plan) => (
        <article className="panel plan-card" key={plan.id}>
          <div className="section-header">
            <div>
              <p className="eyebrow">{plan.type}</p>
              <h3>{plan.title}</h3>
            </div>
            <span className="status-pill">{plan.assignedTo.length} assigned</span>
          </div>
          <p>{plan.summary}</p>
          <div className="tag-list">
            {plan.blocks.map((block) => <span key={block}>{block}</span>)}
          </div>
          <div className="assigned-list">
            <strong>Assigned clients</strong>
            <p>
              {plan.assignedTo.length
                ? plan.assignedTo.map((id) => clients.find((client) => client.id === id)?.name).join(", ")
                : `Not assigned. Suggested for ${activeClient.name}.`}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
