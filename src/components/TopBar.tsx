import { useLiveClock } from '../hooks/useLiveClock'

function TopBar() {
  const clock = useLiveClock()

  return (
    <header className="top-bar" aria-label="Global seismic monitor status">
      <div className="top-brand">
        <span className="status-dot" aria-hidden="true" />
        <h1>GLOBAL SEISMIC MONITOR</h1>
      </div>
      <div className="top-status">
        <time className="live-clock">{clock}</time>
        <span className="live-badge">
          <span aria-hidden="true">●</span> LIVE
        </span>
      </div>
    </header>
  )
}

export default TopBar
