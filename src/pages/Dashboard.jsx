import ComplianceScore from "../components/ComplianceScore.jsx";
import StatCard from "../components/StatCard.jsx";
import MacroBar from "../components/MacroBar.jsx";
import ClientCard from "../components/ClientCard.jsx";
import { useApp } from "../context/AppContext.jsx";
import { formatNumber } from "../lib/calculations.js";

export default function Dashboard({ setActivePage }) {
  const {
    user,
    clients,
    activeClient,
    setActiveClientId,
    activeTotals,
    activeClientWorkouts,
    activeClientHabits,
    checkIns
  } = useApp();

  const completedWorkout = activeClientWorkouts.some((workout) => workout.date === "Today" && workout.status === "Completed");
  const clientCheckIn = checkIns.find((checkIn) => checkIn.clientId === activeClient.id);

  return (
    <div className="page-grid">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">{user.role === "coach" ? "Coach overview" : "Client dashboard"}</p>
          <h2>
            {user.role === "coach"
              ? `Today’s coaching command center`
              : `Welcome back, ${activeClient.name.split(" ")[0]}`}
          </h2>
          <p>
            Keep nutrition, training, check-ins, and messaging connected so the plan
            does not live in five different places.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => setActivePage("messages")}>
              Message {user.role === "coach" ? "client" : "coach"}
            </button>
            <button className="secondary-button" onClick={() => setActivePage("nutrition")}>
              Log food
            </button>
          </div>
        </div>
        <div className="hero-metrics">
          <strong>{activeClient.adherence}%</strong>
          <span>7-day adherence</span>
        </div>
      </section>

      <div className="stats-grid">
        <StatCard label="Calories" value={formatNumber(activeTotals.calories)} helper={`of ${activeClient.caloriesTarget}`} icon="◒" tone="green" />
        <StatCard label="Protein" value={`${activeTotals.protein}g`} helper={`of ${activeClient.proteinTarget}g`} icon="△" tone="blue" />
        <StatCard label="Workout" value={completedWorkout ? "Done" : "Pending"} helper="today" icon="◆" tone="purple" />
        <StatCard label="Check-in" value={clientCheckIn ? clientCheckIn.date : "Missing"} helper="weekly" icon="✓" tone="orange" />
      </div>

      <ComplianceScore />

      <section className="panel">
        <div className="section-header">
          <div>
            <p className="eyebrow">Macro targets</p>
            <h3>Today’s fuel</h3>
          </div>
          <button className="ghost-button" onClick={() => setActivePage("nutrition")}>Open nutrition</button>
        </div>
        <div className="macro-stack">
          <MacroBar label="Calories" value={activeTotals.calories} target={activeClient.caloriesTarget} unit="" />
          <MacroBar label="Protein" value={activeTotals.protein} target={activeClient.proteinTarget} />
          <MacroBar label="Carbs" value={activeTotals.carbs} target={activeClient.carbsTarget} />
          <MacroBar label="Fat" value={activeTotals.fat} target={activeClient.fatTarget} />
        </div>
      </section>

      <section className="panel">
        <div className="section-header">
          <div>
            <p className="eyebrow">Daily checklist</p>
            <h3>Habits</h3>
          </div>
        </div>
        <div className="habit-list">
          {activeClientHabits.map((habit) => (
            <div className="habit-item" key={habit.id}>
              <span className={habit.done ? "check done" : "check"}>{habit.done ? "✓" : ""}</span>
              <div>
                <strong>{habit.title}</strong>
                <p>{habit.target}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {user.role === "coach" && (
        <section className="panel wide-panel">
          <div className="section-header">
            <div>
              <p className="eyebrow">Clients needing attention</p>
              <h3>Coach priority list</h3>
            </div>
            <button className="ghost-button" onClick={() => setActivePage("clients")}>Open CRM</button>
          </div>
          <div className="client-list">
            {clients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                active={client.id === activeClient.id}
                onClick={() => setActiveClientId(client.id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
