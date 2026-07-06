import MessageThread from "../components/MessageThread.jsx";
import ClientCard from "../components/ClientCard.jsx";
import { useApp } from "../context/AppContext.jsx";

export default function Messages() {
  const { user, clients, activeClient, setActiveClientId } = useApp();

  return (
    <div className="page-grid messages-grid">
      {user.role === "coach" && (
        <section className="panel">
          <div className="section-header">
            <div>
              <p className="eyebrow">Inbox</p>
              <h3>Clients</h3>
            </div>
          </div>
          <div className="client-list">
            {clients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                active={client.id === activeClient.id}
                onClick={() => setActiveClientId(client.id)}
              />
            ))}
          </div>
        </section>
      )}

      <MessageThread />

      <section className="panel">
        <div className="section-header">
          <div>
            <p className="eyebrow">AI assistant</p>
            <h3>Coach helper</h3>
          </div>
        </div>
        <div className="insight-list">
          <div className="insight-card">
            <strong>Suggested focus</strong>
            <p>Keep today’s message focused on protein, water, and one clear action.</p>
          </div>
          <div className="insight-card">
            <strong>Risk signal</strong>
            <p>Missed check-ins plus low food logs usually means the client needs a simpler plan.</p>
          </div>
          <div className="insight-card">
            <strong>Template</strong>
            <p>“Win the next meal. Do not worry about perfect. Execute the next rep.”</p>
          </div>
        </div>
      </section>
    </div>
  );
}
