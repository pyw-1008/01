import { useLiveClock } from '../hooks/useLiveClock'

type TopBarProps = {
  minMagnitude: number
  refreshing: boolean
  onMinMagnitudeChange: (value: number) => void
}

function TopBar({ minMagnitude, refreshing, onMinMagnitudeChange }: TopBarProps) {
  const clock = useLiveClock()

  return (
    <header className="top-bar" aria-label="Global seismic monitor status">
      <div className="top-brand">
        <span className="status-dot" aria-hidden="true" />
        <h1>GLOBAL SEISMIC MONITOR</h1>
      </div>
      <div className="top-status">
        <label className="magnitude-filter">
          <span>MIN M {minMagnitude.toFixed(1)}</span>
          <input
            aria-label="Minimum magnitude"
            max="6"
            min="0"
            step="0.5"
            type="range"
            value={minMagnitude}
            onChange={(event) => onMinMagnitudeChange(Number(event.target.value))}
          />
        </label>
        {refreshing && <span className="refreshing-badge">更新中</span>}
        <time className="live-clock">{clock}</time>
        <span className="live-badge">
          <span aria-hidden="true">●</span> LIVE
        </span>
      </div>
    </header>
  )
}

export default TopBar
