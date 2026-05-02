export default function GridBackground({ agentStatus }) {
  return (
    <div className="grid-bg" data-status={agentStatus}>
      <div className="grid-lines" />
      <div className="glow-orb glow-1" />
      <div className="glow-orb glow-2" />
      <div className="glow-orb glow-3" />
      <div className="scanline" />
      <div className="noise" />
    </div>
  );
}