import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext.jsx";

export default function Login() {
  const { login } = useApp();
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installMessage, setInstallMessage] = useState("");
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallSupported, setIsInstallSupported] = useState(false);

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
      setIsInstallSupported(true);
      setInstallMessage("");
    }

    function handleAppInstalled() {
      setInstallPrompt(null);
      setIsInstallSupported(false);
      setIsInstalled(true);
      setInstallMessage("");
    }

    setIsInstallSupported(Boolean(window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone || window.deferredPrompt));

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
      if (window.navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
        setInstallMessage("On iPhone or iPad, use Share > Add to Home Screen to install this app.");
      } else if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone) {
        setInstallMessage("Sun Warrior Fitness is already installed.");
      } else {
        setInstallMessage("Your browser is not offering an install prompt right now. Try using the browser menu to install this app.");
      }
      return;
    }

    try {
      installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      setInstallPrompt(null);
      setInstallMessage(
        choice.outcome === "accepted"
          ? "Sun Warrior Fitness is installing."
          : "Installation was cancelled. You can try again anytime."
      );
    } catch (error) {
      console.error("Install prompt failed", error);
      setInstallMessage("The installation prompt could not be opened. Please try again from your browser menu.");
    }
  }

  return (
    <main className="login-page">
      {!isInstalled && (
        <button className="install-button login-install-button" onClick={installApp}>
          {isInstallSupported ? "Install App" : "Install App"}
        </button>
      )}
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
      </section>
    </main>
  );
}
