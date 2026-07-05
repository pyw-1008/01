import type { Earthquake } from '../hooks/useEarthquakes'
import { stats } from '../lib/stats'

type StatsPanelProps = {
  quakes: Earthquake[]
  lastUpdated: number | null
  timeRangeLabel: string
}

function formatMagnitude(mag: number) {
  return mag.toFixed(1)
}

function formatLastUpdated(lastUpdated: number | null) {
  if (lastUpdated === null) {
    return 'Pending'
  }

  return new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date(lastUpdated))
}

function StatsPanel({ quakes, lastUpdated, timeRangeLabel }: StatsPanelProps) {
  const quakeStats = stats(quakes)

  return (
    <aside className="stats-panel" aria-label="Earthquake statistics">
      <section className="stats-card stats-card-primary">
        <span className="stats-label">{timeRangeLabel}</span>
        <strong className="stats-total">{quakeStats.total}</strong>
        <span className="stats-hint">recorded earthquakes</span>
        <div className="stats-mini-grid" aria-label="Summary metrics">
          <span>
            <strong>
              {quakeStats.averageMagnitude === null
                ? '—'
                : quakeStats.averageMagnitude.toFixed(1)}
            </strong>
            Avg mag
          </span>
          <span>
            <strong>{quakeStats.strongCount}</strong>
            M6+
          </span>
          <span>
            <strong>{formatLastUpdated(lastUpdated)}</strong>
            Updated
          </span>
        </div>
      </section>

      <section className="stats-card">
        <span className="stats-label">Max magnitude</span>
        {quakeStats.maxMagnitude ? (
          <>
            <strong className="stats-max">
              M {formatMagnitude(quakeStats.maxMagnitude.mag)}
            </strong>
            <span className="stats-place">{quakeStats.maxMagnitude.place}</span>
          </>
        ) : (
          <>
            <strong className="stats-max">No data</strong>
            <span className="stats-place">Waiting for valid magnitudes</span>
          </>
        )}
      </section>

      <section className="stats-card">
        <span className="stats-label">Severity distribution</span>
        <div className="severity-bars">
          {quakeStats.buckets.map((bucket) => (
            <div className="severity-row" key={bucket.level}>
              <div className="severity-row-head">
                <span>{bucket.level}</span>
                <span>{bucket.count}</span>
              </div>
              <div className="severity-track">
                <div
                  className="severity-fill"
                  style={{
                    width: `${bucket.percent}%`,
                    backgroundColor: bucket.color,
                    boxShadow: `0 0 16px ${bucket.color}`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </aside>
  )
}

export default StatsPanel
