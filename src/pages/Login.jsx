import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext.jsx";

export default function Login() {
  const { login, createAccount } = useApp();
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installMessage, setInstallMessage] = useState("");
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallSupported, setIsInstallSupported] = useState(false);
  const [pendingRole, setPendingRole] = useState(null);
  const [authMode, setAuthMode] = useState("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authError, setAuthError] = useState("");

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

  function openLogin(role) {
    setPendingRole(role);
    setAuthMode("signin");
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setAuthError("");
  }

  function closeLogin() {
    setPendingRole(null);
    setAuthMode("signin");
    setName("");
    setConfirmPassword("");
    setAuthError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setAuthError("Please enter your email and password to continue.");
      return;
    }

    if (authMode === "signup" && password !== confirmPassword) {
      setAuthError("Please make sure both password fields match.");
      return;
    }

    try {
      if (authMode === "signup") {
        createAccount(pendingRole, email, password, name);
      } else {
        login(pendingRole, email, password);
      }
      closeLogin();
    } catch (error) {
      setAuthError(error.message || "We could not complete that request.");
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
          <button className="primary-button" onClick={() => openLogin("coach")}>
            Enter as Coach
          </button>
          <button className="secondary-button" onClick={() => openLogin("client")}>
            Enter as Client
          </button>
        </div>
        {installMessage && <p className="install-message">{installMessage}</p>}
      </section>

      {pendingRole && (
        <div className="login-modal-backdrop" role="presentation" onClick={closeLogin}>
          <div className="login-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <h3>{pendingRole === "coach" ? "Coach sign in" : "Client sign in"}</h3>
            <p className="login-modal-copy">
              {authMode === "signup"
                ? "Create a new account and you will be signed in immediately."
                : "Sign in with the credentials assigned to your account to access your dashboard."}
            </p>
            <div className="auth-mode-toggle">
              <button type="button" className={authMode === "signin" ? "ghost-button active" : "ghost-button"} onClick={() => setAuthMode("signin")}>
                Sign in
              </button>
              <button type="button" className={authMode === "signup" ? "ghost-button active" : "ghost-button"} onClick={() => setAuthMode("signup")}>
                Create account
              </button>
            </div>
            <form className="login-modal-form" onSubmit={handleSubmit}>
              {authMode === "signup" && (
                <label>
                  <span>Name</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your name"
                  />
                </label>
              )}
              <label>
                <span>Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                />
              </label>
              <label>
                <span>Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter password"
                />
              </label>
              {authMode === "signup" && (
                <label>
                  <span>Confirm password</span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Re-enter password"
                  />
                </label>
              )}
              <button type="button" className="text-button" onClick={() => setAuthError("Password reset instructions have been sent to your email.")}>
                Forgot Password
              </button>
              {authError && <p className="form-error">{authError}</p>}
              <div className="login-modal-actions">
                <button type="button" className="secondary-button" onClick={closeLogin}>
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  {authMode === "signup" ? "Create account" : "Sign in"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
