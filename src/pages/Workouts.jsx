import WorkoutForm from "../components/WorkoutForm.jsx";
import StatCard from "../components/StatCard.jsx";
import { useApp } from "../context/AppContext.jsx";
import { exerciseLibrary } from "../data/mockData.js";

export default function Workouts() {
  const { activeClient, activeClientWorkouts, toggleWorkoutStatus } = useApp();

  const completed = activeClientWorkouts.filter((workout) => workout.status === "Completed").length;
  const totalMinutes = activeClientWorkouts.reduce((sum, workout) => sum + Number(workout.duration || 0), 0);

  return (
    <div className="page-grid">
      <section className="panel wide-panel">
        <div className="section-header">
          <div>
            <p className="eyebrow">Training</p>
            <h3>{activeClient.name}'s workouts</h3>
          </div>
        </div>

        <div className="stats-grid compact">
          <StatCard label="Completed" value={completed} helper="workouts" icon="✓" tone="green" />
          <StatCard label="Training time" value={`${totalMinutes}m`} helper="logged" icon="◷" tone="blue" />
          <StatCard label="This week" value="4/5" helper="planned sessions" icon="◆" tone="purple" />
          <StatCard label="PRs" value="2" helper="new records" icon="↗" tone="orange" />
        </div>
      </section>

      <WorkoutForm />

      <section className="panel wide-panel">
        <div className="section-header">
          <div>
            <p className="eyebrow">Workout history</p>
            <h3>Program log</h3>
          </div>
        </div>

        <div className="workout-list">
          {activeClientWorkouts.map((workout) => (
            <article className="workout-card" key={workout.id}>
              <div>
                <span className="status-pill">{workout.type}</span>
                <h4>{workout.title}</h4>
                <p>{workout.date} • {workout.duration} minutes</p>
              </div>
              <div className="exercise-stack">
                {workout.exercises.map((exercise) => (
                  <span key={exercise.name}>
                    {exercise.name}: {exercise.sets}x{exercise.reps} {exercise.load ? `@ ${exercise.load}` : ""}
                  </span>
                ))}
              </div>
              <button className={workout.status === "Completed" ? "success-button" : "secondary-button"} onClick={() => toggleWorkoutStatus(workout.id)}>
                {workout.status}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="section-header">
          <div>
            <p className="eyebrow">Exercise library</p>
            <h3>Quick references</h3>
          </div>
        </div>

        <div className="library-grid">
          {exerciseLibrary.map((exercise) => (
            <div className="library-card" key={exercise.name}>
              <strong>{exercise.name}</strong>
              <span>{exercise.category}</span>
              <p>{exercise.equipment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
