import { useEffect, useRef } from "react";

export default function TranscriptPanel({ transcript, callStatus }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  const isEmpty = transcript.length === 0;

  return (
    <div className="transcript-panel">
      <div className="transcript-header">
        <span className="transcript-title">LIVE TRANSCRIPT</span>
        <span className="transcript-count">
          {transcript.length > 0 ? `${transcript.length} exchanges` : ""}
        </span>
      </div>

      <div className="transcript-body">
        {isEmpty && (
          <div className="transcript-empty">
            <div className="empty-icon">⬡</div>
            <p className="empty-title">No active session</p>
            <p className="empty-sub">
              {callStatus === "connecting"
                ? "Establishing secure connection..."
                : "Start a support call to see the live transcript here."}
            </p>
          </div>
        )}

        {transcript.map((msg, i) => (
          <div key={i} className={`transcript-msg transcript-msg--${msg.role}`}>
            <div className="msg-meta">
              <span className="msg-role">
                {msg.role === "agent" ? "iDesk AI" : "You"}
              </span>
              <div className="msg-line" />
            </div>
            <div className="msg-content">{msg.content}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {callStatus === "active" && (
        <div className="transcript-footer">
          <span className="recording-dot" />
          Session is being recorded and analyzed
        </div>
      )}
    </div>
  );
}