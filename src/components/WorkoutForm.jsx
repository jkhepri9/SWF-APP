import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";

export default function WorkoutForm() {
  const { addWorkout } = useApp();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Strength");
  const [duration, setDuration] = useState(45);

  function submit(event) {
    event.preventDefault();
    if (!title.trim()) return;

    addWorkout({
      title: title.trim(),
      type,
      duration: Number(duration || 0),
      status: "Completed"
    });

    setTitle("");
    setType("Strength");
    setDuration(45);
  }

  return (
    <form className="panel form-panel" onSubmit={submit}>
      <div className="section-header">
        <div>
          <p className="eyebrow">Training log</p>
          <h3>Add workout</h3>
        </div>
      </div>

      <div className="form-grid three">
        <label>
          Workout title
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Push Day" />
        </label>
        <label>
          Type
          <select value={type} onChange={(event) => setType(event.target.value)}>
            <option>Strength</option>
            <option>Cardio</option>
            <option>Calisthenics</option>
            <option>HIIT</option>
            <option>Mobility</option>
          </select>
        </label>
        <label>
          Duration
          <input type="number" value={duration} onChange={(event) => setDuration(event.target.value)} />
        </label>
      </div>

      <button className="primary-button" type="submit">Log workout</button>
    </form>
  );
}
