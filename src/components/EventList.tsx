import type { Earthquake } from '../hooks/useEarthquakes'
import { severity } from '../lib/severity'
import { timeAgo } from '../lib/timeAgo'

type EventListProps = {
  quakes: Earthquake[]
  newEventIds: Set<string>
  selectedId: string | null
  onSelect: (quake: Earthquake) => void
}

function formatMagnitude(mag: number | null) {
  return mag === null ? '—' : mag.toFixed(1)
}

function EventList({ quakes, newEventIds, selectedId, onSelect }: EventListProps) {
  return (
    <aside className="event-list" aria-label="Realtime earthquake events">
      <div className="event-list-header">
        <span>Realtime Events</span>
        <strong>{quakes.length}</strong>
      </div>
      <div className="event-list-body">
        {quakes.length === 0 ? (
          <div className="event-empty">No events match the current filter.</div>
        ) : (
          quakes.map((quake) => {
            const quakeSeverity = severity(quake.mag)
            const isSelected = quake.id === selectedId
            const isNew = newEventIds.has(quake.id)

            return (
              <button
                className={`event-row${isSelected ? ' is-selected' : ''}${isNew ? ' is-new' : ''}`}
                key={quake.id}
                type="button"
                onClick={() => onSelect(quake)}
              >
                <span
                  className="event-mag"
                  style={{
                    borderColor: quakeSeverity.color,
                    color: quakeSeverity.color,
                    boxShadow: `0 0 16px ${quakeSeverity.color}44`,
                  }}
                >
                  M {formatMagnitude(quake.mag)}
                </span>
                <span className="event-main">
                  <span className="event-place">{quake.place}</span>
                  <span className="event-meta">{timeAgo(quake.time)}</span>
                </span>
              </button>
            )
          })
        )}
      </div>
    </aside>
  )
}

export default EventList
