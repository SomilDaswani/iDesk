const STATUS_MAP = {
  idle: { label: "AWAITING CONNECTION", color: "var(--muted)" },
  listening: { label: "LISTENING", color: "var(--cyan)" },
  speaking: { label: "AGENT SPEAKING", color: "var(--purple)" },
};

const CALL_STATUS_MAP = {
  idle: { label: "AWAITING CONNECTION", color: "var(--muted)" },
  connecting: { label: "ESTABLISHING SECURE LINK...", color: "var(--cyan)" },
  ended: { label: "SESSION TERMINATED", color: "var(--muted)" },
};

export default function StatusIndicator({ status, callStatus }) {
  const info =
    callStatus === "active"
      ? STATUS_MAP[status] || STATUS_MAP.idle
      : CALL_STATUS_MAP[callStatus] || CALL_STATUS_MAP.idle;

  return (
    <div className="status-indicator">
      <div className="status-bar-wrap">
        {callStatus === "active" && (
          <div
            className="wave-bars"
            data-active={status === "speaking" || status === "listening"}
          >
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="wave-bar"
                style={{ animationDelay: `${i * 0.08}s` }}
              />
            ))}
          </div>
        )}
      </div>
      <div className="status-label" style={{ color: info.color }}>
        {info.label}
      </div>
    </div>
  );
}