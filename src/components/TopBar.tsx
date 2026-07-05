import { useLiveClock } from '../hooks/useLiveClock'
import { TIME_RANGE_OPTIONS, USGS_FEEDS, type TimeRangeKey } from '../lib/usgsFeeds'

type TopBarProps = {
  minMagnitude: number
  refreshing: boolean
  timeRange: TimeRangeKey
  onMinMagnitudeChange: (value: number) => void
  onRefresh: () => void
  onTimeRangeChange: (value: TimeRangeKey) => void
}

function TopBar({
  minMagnitude,
  refreshing,
  timeRange,
  onMinMagnitudeChange,
  onRefresh,
  onTimeRangeChange,
}: TopBarProps) {
  const clock = useLiveClock()

  return (
    <header className="top-bar" aria-label="Global seismic monitor status">
      <div className="top-brand">
        <span className="status-dot" aria-hidden="true" />
        <h1>GLOBAL SEISMIC MONITOR</h1>
      </div>
      <div className="top-status">
        <div className="time-range-switch" aria-label="Time range">
          {TIME_RANGE_OPTIONS.map((range) => (
            <button
              className={`time-range-button${range === timeRange ? ' is-active' : ''}`}
              key={range}
              type="button"
              onClick={() => onTimeRangeChange(range)}
            >
              {USGS_FEEDS[range].shortLabel}
            </button>
          ))}
        </div>
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
        <button className="refresh-button" type="button" onClick={onRefresh}>
          Refresh
        </button>
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
