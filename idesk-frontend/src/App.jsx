import { useState, useEffect, useRef } from "react";
import { RetellWebClient } from "retell-client-js-sdk";
import CallButton from "./components/CallButton";
import TranscriptPanel from "./components/TranscriptPanel";
import StatusIndicator from "./components/StatusIndicator";
import GridBackground from "./components/GridBackground";
import "./App.css";

const retellClient = new RetellWebClient();

export default function App() {
  const [callStatus, setCallStatus] = useState("idle");
  const [agentStatus, setAgentStatus] = useState("idle");
  const [transcript, setTranscript] = useState([]);
  const [error, setError] = useState(null);
  const transcriptRef = useRef([]);

  useEffect(() => {
    retellClient.on("call_started", () => {
      setCallStatus("active");
      setAgentStatus("listening");
    });

    retellClient.on("call_ended", () => {
      setCallStatus("ended");
      setAgentStatus("idle");
      setTimeout(() => setCallStatus("idle"), 5000);
      // transcript intentionally NOT cleared — keeps full history visible
    });

    retellClient.on("agent_start_talking", () => setAgentStatus("speaking"));
    retellClient.on("agent_stop_talking", () => setAgentStatus("listening"));

    retellClient.on("update", (update) => {
  if (!update.transcript || update.transcript.length === 0) return;

  const incoming = update.transcript;
  const acc = transcriptRef.current;

  if (acc.length === 0) {
    transcriptRef.current = [...incoming];
    setTranscript([...incoming]);
    return;
  }

  // Find where incoming[0] matches in accumulated history
  // Match = same role + one content is a prefix of the other (streaming)
  let matchIdx = -1;
  for (let i = acc.length - 1; i >= Math.max(0, acc.length - incoming.length - 2); i--) {
    const a = acc[i].content;
    const b = incoming[0].content;
    const sameRole = acc[i].role === incoming[0].role;
    const isPrefix = a.startsWith(b) || b.startsWith(a) || a === b;
    if (sameRole && isPrefix) {
      matchIdx = i;
      break;
    }
  }

  let merged;
  if (matchIdx !== -1) {
    // Splice: keep everything before matchIdx, replace from there with incoming
    merged = [...acc.slice(0, matchIdx), ...incoming];
  } else {
    // No overlap — append incoming, deduplicating against last message
    merged = [...acc];
    for (const msg of incoming) {
      const last = merged[merged.length - 1];
      const sameRole = last && last.role === msg.role;
      const isPrefix = sameRole && (
        last.content.startsWith(msg.content) ||
        msg.content.startsWith(last.content) ||
        last.content === msg.content
      );
      if (isPrefix) {
        // Streaming update — replace with longer version
        merged[merged.length - 1] = msg.content.length >= last.content.length ? msg : last;
      } else {
        merged.push(msg);
      }
    }
  }

  transcriptRef.current = merged;
  setTranscript([...merged]);
});

    retellClient.on("error", (err) => {
      console.error("Retell error:", err);
      setError("Connection error. Please try again.");
      setCallStatus("idle");
      setAgentStatus("idle");
    });

    return () => {
      retellClient.off("call_started");
      retellClient.off("call_ended");
      retellClient.off("agent_start_talking");
      retellClient.off("agent_stop_talking");
      retellClient.off("update");
      retellClient.off("error");
    };
  }, []);

  const startCall = async () => {
    setError(null);
    transcriptRef.current = [];
    setCallStatus("connecting");

    try {
      const response = await fetch("https://idesk-backend.vercel.app/create-web-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (!data.access_token) throw new Error("No access token");

      await retellClient.startCall({
        accessToken: data.access_token,
        sampleRate: 24000,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to connect. Is the backend running on port 3000?");
      setCallStatus("idle");
    }
  };

  const endCall = () => {
    retellClient.stopCall();
    setCallStatus("idle");
    setAgentStatus("idle");
  };

  return (
    <div className="app">
      <GridBackground agentStatus={agentStatus} />

      <div className="app-inner">
        <header className="header">
          <div className="logo">
            <div className="logo-icon">i</div>
            <div className="logo-text">
              <span className="logo-name">iDesk</span>
              <span className="logo-sub">AI Support Terminal</span>
            </div>
          </div>
          <div className="status-badge" data-live={callStatus === "active"}>
            <span className="status-dot" />
            {callStatus === "active" ? "LIVE SESSION" : "STANDBY"}
          </div>
        </header>

        <main className="main">
          <div className="call-panel">
            <div className="call-panel-inner">
              <div className="agent-visual" data-status={agentStatus}>
                <div className="ring ring-1" />
                <div className="ring ring-2" />
                <div className="ring ring-3" />
                <div className="agent-core">⬡</div>
              </div>

              <StatusIndicator status={agentStatus} callStatus={callStatus} />

              <CallButton
                callStatus={callStatus}
                onStart={startCall}
                onEnd={endCall}
              />

              {error && <div className="error-msg">⚠ {error}</div>}

              <div className="call-info">
                <div className="info-row">
                  <span className="info-label">Agent</span>
                  <span className="info-value">iDesk v1.0</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Mode</span>
                  <span className="info-value">IT Helpdesk</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Engine</span>
                  <span className="info-value">Retell AI</span>
                </div>
              </div>
            </div>
          </div>

          <div className="transcript-col">
            <TranscriptPanel transcript={transcript} callStatus={callStatus} />
          </div>
        </main>

        <footer className="footer">
          <span>iDesk © 2026</span>
          <span className="sep">·</span>
          <span>Powered by Retell AI</span>
        </footer>
      </div>
    </div>
  );
}