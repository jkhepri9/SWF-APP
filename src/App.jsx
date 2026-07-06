import { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext.jsx";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Nutrition from "./pages/Nutrition.jsx";
import Workouts from "./pages/Workouts.jsx";
import Messages from "./pages/Messages.jsx";
import Progress from "./pages/Progress.jsx";
import Clients from "./pages/Clients.jsx";
import CheckIns from "./pages/CheckIns.jsx";
import Plans from "./pages/Plans.jsx";
import Settings from "./pages/Settings.jsx";

const pages = {
  dashboard: Dashboard,
  clients: Clients,
  nutrition: Nutrition,
  workouts: Workouts,
  messages: Messages,
  progress: Progress,
  checkins: CheckIns,
  plans: Plans,
  settings: Settings
};

function AppShell() {
  const { user } = useApp();
  const [activePage, setActivePage] = useState("dashboard");

  if (!user) return <Login />;

  const CurrentPage = pages[activePage] || Dashboard;

  return (
    <Layout activePage={activePage} setActivePage={setActivePage}>
      <CurrentPage setActivePage={setActivePage} />
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
