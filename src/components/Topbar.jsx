import { useApp } from "../context/AppContext.jsx";

const titles = {
  dashboard: "Command Center",
  clients: "Client CRM",
  nutrition: "Nutrition Tracker",
  workouts: "Workout Hub",
  messages: "Coach Messaging",
  progress: "Progress Analytics",
  checkins: "Weekly Check-ins",
  plans: "Plans & Templates",
  settings: "Settings"
};

export default function Topbar({ activePage }) {
  const { user, clients, activeClient, activeClientId, setActiveClientId, setSidebarOpen } = useApp();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="menu-button" onClick={() => setSidebarOpen(true)}>
          ☰
        </button>
        <div>
          <p className="eyebrow">Premium fitness coaching</p>
          <h2>{titles[activePage] || "Dashboard"}</h2>
        </div>
      </div>

      <div className="topbar-actions">
        {user.role === "coach" && (
          <label className="client-switcher">
            <span>Viewing</span>
            <select value={activeClientId} onChange={(event) => setActiveClientId(event.target.value)}>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <div className="mini-profile">
          <div className="avatar small">{activeClient?.avatar || "SW"}</div>
          <div>
            <strong>{activeClient?.name}</strong>
            <span>{activeClient?.goal}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
