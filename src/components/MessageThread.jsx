import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext.jsx";

export default function MessageThread() {
  const { activeClient, messages, sendMessage, user } = useApp();
  const [draft, setDraft] = useState("");

  const thread = useMemo(
    () => messages.filter((message) => message.clientId === activeClient.id),
    [messages, activeClient]
  );

  function submit(event) {
    event.preventDefault();
    sendMessage(draft);
    setDraft("");
  }

  function smartReply(text) {
    setDraft(text);
  }

  return (
    <section className="panel message-panel">
      <div className="section-header">
        <div>
          <p className="eyebrow">Secure chat</p>
          <h3>{activeClient.name}</h3>
        </div>
        <span className="status-pill">Online</span>
      </div>

      <div className="smart-replies">
        {user.role === "coach" && (
          <>
            <button onClick={() => smartReply("Good work. Send me your meal log and workout completion by tonight.")}>
              Accountability
            </button>
            <button onClick={() => smartReply("Your protein is the main target today. Hit that first, then calories.")}>
              Protein reminder
            </button>
            <button onClick={() => smartReply("No stress. Move the workout to tonight and keep the plan moving.")}>
              Missed workout
            </button>
          </>
        )}
        {user.role === "client" && (
          <>
            <button onClick={() => smartReply("I finished my workout and hit my protein today.")}>Progress update</button>
            <button onClick={() => smartReply("Can you review my meals and tell me what to adjust?")}>Ask coach</button>
          </>
        )}
      </div>

      <div className="thread">
        {thread.map((message) => (
          <div key={message.id} className={`message ${message.sender === user.role ? "mine" : ""}`}>
            <p>{message.body}</p>
            <span>{message.time}</span>
          </div>
        ))}
      </div>

      <form className="message-composer" onSubmit={submit}>
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Write a message..."
        />
        <button className="primary-button" type="submit">Send</button>
      </form>
    </section>
  );
}
