import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { supabase } from "../lib/supabaseClient.js";

export default function Login() {
  const { refreshUser, authNotice } = useApp();

  const [installPrompt, setInstallPrompt] = useState(null);
  const [installMessage, setInstallMessage] = useState("");
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallSupported, setIsInstallSupported] = useState(false);

  const [mode, setMode] = useState("login");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [authError, setAuthError] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone;

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

    setIsInstallSupported(
      Boolean(
        window.matchMedia("(display-mode: standalone)").matches ||
          window.navigator.standalone ||
          window.deferredPrompt
      )
    );

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
      } else if (
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone
      ) {
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

  async function upsertProfile(authUser, selectedRole) {
    const safeRole = selectedRole === "coach" ? "coach" : "client";

    const { error } = await supabase.from("profiles").upsert(
      {
        id: authUser.id,
        email: authUser.email,
        full_name: fullName.trim() || authUser.email?.split("@")[0] || "Sun Warrior",
        role: safeRole,
        client_id: safeRole === "client" ? "client-1" : null
      },
      { onConflict: "id" }
    );

    if (error) {
      console.warn("Profile save failed. Auth user still exists.", error);
    }
  }

  async function handleAuth(event) {
    event.preventDefault();

    setIsAuthenticating(true);
    setAuthError("");
    setAuthMessage("");

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              role
            }
          }
        });

        if (error) throw error;

        if (data?.session && data?.user) {
          await upsertProfile(data.user, role);
          setAuthMessage("Account created. Loading your dashboard...");
          await refreshUser(role);
          return;
        }

        setAuthMessage("Account created. Check your email to confirm your account, then come back and log in.");
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) throw error;

      if (!data?.user) {
        throw new Error("Login succeeded, but no user session was returned.");
      }

      setAuthMessage("Logged in. Loading your dashboard...");
      await refreshUser("client");
    } catch (error) {
      console.error("Auth failed", error);
      setAuthError(error?.message || "Unable to sign in right now. Please try again.");
    } finally {
      setIsAuthenticating(false);
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
          <img
            className="brand-mark login-logo"
            src="/sun-warrior-logo.png"
            alt="Sun Warrior Fitness logo"
          />
        </div>

        <div className="hero-copy">
          <p className="eyebrow">Premium coach/client app</p>
          <h2>Welcome, Sun Warrior. Your next level starts today.</h2>
          <p>
            Stay focused on your nutrition, workouts, progress, and daily wins as you
            build strength from the inside out.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleAuth}>
          {mode === "signup" && (
            <>
              <label>
                Full name
                <input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Your name"
                  required
                />
              </label>

              <label>
                Account type
                <select value={role} onChange={(event) => setRole(event.target.value)}>
                  <option value="client">Client</option>
                  <option value="coach">Coach</option>
                </select>
              </label>
            </>
          )}

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@email.com"
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimum 6 characters"
              minLength={6}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              required
            />
          </label>

          <button className="primary-button" type="submit" disabled={isAuthenticating}>
            {isAuthenticating
              ? "Working..."
              : mode === "signup"
                ? "Create Account"
                : "Log In"}
          </button>
        </form>

        <button
          className="ghost-button auth-toggle-button"
          type="button"
          onClick={() => {
            setAuthError("");
            setAuthMessage("");
            setMode(mode === "login" ? "signup" : "login");
          }}
        >
          {mode === "login"
            ? "Need an account? Create one"
            : "Already have an account? Log in"}
        </button>

        {authError && <p className="install-message">{authError}</p>}
        {authMessage && <p className="install-message">{authMessage}</p>}
        {authNotice && <p className="install-message">{authNotice}</p>}
        {installMessage && <p className="install-message">{installMessage}</p>}
      </section>
    </main>
  );
}
