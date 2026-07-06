export default function ClientCard({ client, active, onClick }) {
  return (
    <button className={`client-card ${active ? "active" : ""}`} onClick={onClick}>
      <div className="avatar">{client.avatar}</div>
      <div className="client-info">
        <div>
          <strong>{client.name}</strong>
          <span>{client.goal}</span>
        </div>
        <div className="client-meta">
          <span>{client.weight} lb</span>
          <span>{client.adherence}% adherence</span>
          <span>{client.status}</span>
        </div>
      </div>
      {client.unread > 0 && <b className="unread-badge">{client.unread}</b>}
    </button>
  );
}
