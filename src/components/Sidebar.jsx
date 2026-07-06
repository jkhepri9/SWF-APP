import { useApp } from "../context/AppContext.jsx";

const coachNav = [
  { id: "dashboard", label: "Dashboard", icon: "⌁" },
  { id: "clients", label: "Clients", icon: "◎" },
  { id: "nutrition", label: "Nutrition", icon: "◒" },
  { id: "workouts", label: "Workouts", icon: "◆" },
  { id: "messages", label: "Messages", icon: "✦" },
  { id: "progress", label: "Progress", icon: "↗" },
  { id: "checkins", label: "Check-ins", icon: "✓" },
  { id: "plans", label: "Plans", icon: "▣" },
  { id: "settings", label: "Settings", icon: "⚙" }
];

const clientNav = coachNav.filter((item) => item.id !== "clients");

export default function Sidebar({ activePage, setActivePage }) {
  const { user, logout, sidebarOpen, setSidebarOpen } = useApp();
  const nav = user.role === "coach" ? coachNav : clientNav;

  function go(page) {
    setActivePage(page);
    setSidebarOpen(false);
  }

  return (
    <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      <div className="brand">
        <img className="brand-mark" src="/sun-warrior-logo.png" alt="Sun Warrior Fitness logo" />
        <div>
          <h1>Sun Warrior</h1>
          <p>Fitness OS</p>
        </div>
      </div>

      <nav className="nav-list">
        {nav.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activePage === item.id ? "active" : ""}`}
            onClick={() => go(item.id)}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-pill">
          <div className="avatar">{user.role === "coach" ? "CD" : "MR"}</div>
          <div>
            <strong>{user.name}</strong>
            <span>{user.role}</span>
          </div>
        </div>
        <button className="ghost-button full" onClick={logout}>
          Log out
        </button>
      </div>
    </aside>
  );
}
