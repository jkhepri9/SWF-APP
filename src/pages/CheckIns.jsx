import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";

export default function CheckIns() {
  const { activeClient, checkIns, submitCheckIn, user } = useApp();
  const [form, setForm] = useState({
    weight: activeClient.weight,
    energy: 7,
    sleep: 7,
    stress: 4,
    hunger: 5,
    adherence: 80,
    wins: "",
    challenges: "",
    questions: ""
  });

  const clientCheckIns = checkIns.filter((checkIn) => checkIn.clientId === activeClient.id);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submit(event) {
    event.preventDefault();
    submitCheckIn({
      ...form,
      weight: Number(form.weight),
      energy: Number(form.energy),
      sleep: Number(form.sleep),
      stress: Number(form.stress),
      hunger: Number(form.hunger),
      adherence: Number(form.adherence)
    });
    setForm((current) => ({ ...current, wins: "", challenges: "", questions: "" }));
  }

  return (
    <div className="page-grid">
      <section className="panel wide-panel">
        <div className="section-header">
          <div>
            <p className="eyebrow">Weekly review</p>
            <h3>{activeClient.name}'s check-ins</h3>
          </div>
          <span className="status-pill">{clientCheckIns.length} submitted</span>
        </div>
      </section>

      <form className="panel form-panel" onSubmit={submit}>
        <div className="section-header">
          <div>
            <p className="eyebrow">{user.role === "coach" ? "Preview client form" : "Submit check-in"}</p>
            <h3>Weekly check-in</h3>
          </div>
        </div>

        <div className="form-grid four">
          <label>Weight<input type="number" value={form.weight} onChange={(event) => update("weight", event.target.value)} /></label>
          <label>Energy 1-10<input type="number" min="1" max="10" value={form.energy} onChange={(event) => update("energy", event.target.value)} /></label>
          <label>Sleep 1-10<input type="number" min="1" max="10" value={form.sleep} onChange={(event) => update("sleep", event.target.value)} /></label>
          <label>Stress 1-10<input type="number" min="1" max="10" value={form.stress} onChange={(event) => update("stress", event.target.value)} /></label>
          <label>Hunger 1-10<input type="number" min="1" max="10" value={form.hunger} onChange={(event) => update("hunger", event.target.value)} /></label>
          <label>Adherence %<input type="number" value={form.adherence} onChange={(event) => update("adherence", event.target.value)} /></label>
        </div>

        <label>Wins<textarea value={form.wins} onChange={(event) => update("wins", event.target.value)} placeholder="What went well this week?" /></label>
        <label>Challenges<textarea value={form.challenges} onChange={(event) => update("challenges", event.target.value)} placeholder="What got in the way?" /></label>
        <label>Questions<textarea value={form.questions} onChange={(event) => update("questions", event.target.value)} placeholder="What do you need from coach?" /></label>

        <button className="primary-button" type="submit">Submit check-in</button>
      </form>

      <section className="panel wide-panel">
        <div className="section-header">
          <div>
            <p className="eyebrow">History</p>
            <h3>Submitted check-ins</h3>
          </div>
        </div>

        <div className="checkin-list">
          {clientCheckIns.map((checkIn) => (
            <article className="checkin-card" key={checkIn.id}>
              <div className="checkin-top">
                <strong>{checkIn.date}</strong>
                <span>{checkIn.adherence}% adherence</span>
              </div>
              <div className="detail-grid">
                <div><span>Weight</span><strong>{checkIn.weight}</strong></div>
                <div><span>Energy</span><strong>{checkIn.energy}/10</strong></div>
                <div><span>Sleep</span><strong>{checkIn.sleep}/10</strong></div>
                <div><span>Stress</span><strong>{checkIn.stress}/10</strong></div>
              </div>
              <p><strong>Wins:</strong> {checkIn.wins || "None added"}</p>
              <p><strong>Challenges:</strong> {checkIn.challenges || "None added"}</p>
              <p><strong>Questions:</strong> {checkIn.questions || "None added"}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
