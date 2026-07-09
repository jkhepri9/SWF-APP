import { clearAppStorage } from "../lib/storage.js";
import { useApp } from "../context/AppContext.jsx";

export default function Settings() {
  const { user, activeClient } = useApp();

  function resetDemo() {
    clearAppStorage();
    window.location.reload();
  }

  return (
    <div className="page-grid">
      <section className="panel wide-panel">
        <div className="section-header">
          <div>
            <p className="eyebrow">App settings</p>
            <h3>Profile & production setup</h3>
          </div>
        </div>

        <div className="detail-grid">
          <div><span>Logged in as</span><strong>{user.name}</strong></div>
          <div><span>Role</span><strong>{user.role}</strong></div>
          <div><span>Viewing client</span><strong>{activeClient?.name || user.name}</strong></div>
          <div><span>Storage</span><strong>Browser localStorage</strong></div>
        </div>
      </section>

      <section className="panel">
        <div className="section-header">
          <div>
            <p className="eyebrow">Production checklist</p>
            <h3>Next upgrades</h3>
          </div>
        </div>
        <div className="checklist">
          <span>□ Supabase auth</span>
          <span>□ Database tables</span>
          <span>□ Realtime chat</span>
          <span>□ Stripe subscriptions</span>
          <span>□ AI food recognition</span>
          <span>□ Push notifications</span>
          <span>□ Coach invite links</span>
          <span>□ PWA mobile install</span>
        </div>
      </section>

      <section className="panel">
        <div className="section-header">
          <div>
            <p className="eyebrow">Demo data</p>
            <h3>Reset app</h3>
          </div>
        </div>
        <p className="muted">
          This clears the local app data and reloads the current session.
        </p>
        <button className="danger-button" onClick={resetDemo}>Reset app data</button>
      </section>
    </div>
  );
}
