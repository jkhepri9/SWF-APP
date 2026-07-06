import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext.jsx";

export default function Login() {
  const { login } = useApp();
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installMessage, setInstallMessage] = useState("");
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;

    setIsInstalled(Boolean(isStandalone));

    const root = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = root.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    root.style.overflow = "hidden";
    body.style.overflow = "hidden";

    function handleBeforeInstallPrompt(event) {
      event.preventDefault();
      setInstallPrompt(event);
      setInstallMessage("");
    }

    function handleAppInstalled() {
      setInstallPrompt(null);
      setIsInstalled(true);
      setInstallMessage("Sun Warrior Fitness is installed.");
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      root.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, []);

  async function installApp() {
    if (isInstalled) {
      setInstallMessage("Sun Warrior Fitness is already installed.");
      return;
    }

    if (!installPrompt) {
      setInstallMessage("Open your browser menu and choose Install app or Add to Home Screen.");
      return;
    }

    installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    setInstallPrompt(null);
    setInstallMessage(
      choice.outcome === "accepted"
        ? "Sun Warrior Fitness is installing."
        : "You can install Sun Warrior Fitness anytime from this button."
    );
  }

  return (
    <main className="login-page">
      <button className="install-button login-install-button" onClick={installApp}>
        {isInstalled ? "App Installed" : "Install App"}
      </button>
      <section className="login-card">
        <div className="brand large">
          <img className="brand-mark login-logo" src="/sun-warrior-logo.png" alt="Sun Warrior Fitness logo" />
        </div>

        <div className="hero-copy">
          <p className="eyebrow">Premium coach/client app</p>
          <h2>Welcome, Sun Warrior. Your next level starts today.</h2>
          <p>
            Stay focused on your nutrition, workouts, progress, and daily wins as you
            build strength from the inside out.
          </p>
        </div>

        <div className="login-actions">
          <button className="primary-button" onClick={() => login("coach")}>
            Enter as Coach
          </button>
          <button className="secondary-button" onClick={() => login("client")}>
            Enter as Client
          </button>
        </div>
        {installMessage && <p className="install-message">{installMessage}</p>}

        <div className="feature-grid">
          <span>AI compliance score</span>
          <span>Macro tracking</span>
          <span>Coach messaging</span>
          <span>Progress charts</span>
          <span>Weekly check-ins</span>
          <span>Workout logs</span>
        </div>
      </section>
    </main>
  );
}
