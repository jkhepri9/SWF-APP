import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import { useApp } from "../context/AppContext.jsx";

export default function Layout({ activePage, setActivePage, children }) {
  const { sidebarOpen, setSidebarOpen } = useApp();

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <button
        className={`mobile-scrim ${sidebarOpen ? "show" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-label="Close menu"
      />
      <main className="main-panel">
        <Topbar activePage={activePage} />
        <section className="page-content">{children}</section>
      </main>
    </div>
  );
}
