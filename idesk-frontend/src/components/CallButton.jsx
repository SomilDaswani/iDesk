export default function CallButton({ callStatus, onStart, onEnd }) {
  const isConnecting = callStatus === "connecting";
  const isActive = callStatus === "active";
  const isEnded = callStatus === "ended";

  return (
    <div className="call-btn-wrap">
      {!isActive ? (
        <button
          className="call-btn call-btn--start"
          onClick={onStart}
          disabled={isConnecting || isEnded}
        >
          <span className="call-btn-icon">
            {isConnecting ? (
              <span className="spinner" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
              </svg>
            )}
          </span>
          <span className="call-btn-label">
            {isConnecting ? "Connecting..." : isEnded ? "Call Ended" : "Start Support Call"}
          </span>
        </button>
      ) : (
        <button className="call-btn call-btn--end" onClick={onEnd}>
          <span className="call-btn-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 7l-7.59 7.59L4.41 7 3 8.41l9 9 9-9z"/>
            </svg>
          </span>
          <span className="call-btn-label">End Call</span>
        </button>
      )}
    </div>
  );
}