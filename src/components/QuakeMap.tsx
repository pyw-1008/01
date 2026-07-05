import 'leaflet/dist/leaflet.css'
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'
import { useEarthquakes, type Earthquake } from '../hooks/useEarthquakes'
import { severity } from '../lib/severity'

function markerRadius(mag: number | null) {
  return Math.max(4, Math.min(18, 4 + (mag ?? 0) * 2.2))
}

function pulseRadius(mag: number | null) {
  return markerRadius(mag) + Math.max(8, (mag ?? 0) * 3.5)
}

function pulseOpacity(mag: number | null) {
  return Math.min(0.34, 0.12 + (mag ?? 0) * 0.035)
}

function formatMagnitude(mag: number | null) {
  return mag === null ? 'Unknown' : mag.toFixed(1)
}

function formatDepth(depth: number | null) {
  return depth === null ? 'Unknown' : `${depth.toFixed(1)} km`
}

function formatTime(time: number) {
  if (time <= 0) {
    return 'Unknown'
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(new Date(time))
}

function QuakeMarker({ quake }: { quake: Earthquake }) {
  const quakeSeverity = severity(quake.mag)
  const radius = markerRadius(quake.mag)

  return (
    <>
      <CircleMarker
        center={[quake.lat, quake.lng]}
        radius={pulseRadius(quake.mag)}
        interactive={false}
        className="quake-pulse-ring"
        pathOptions={{
          color: quakeSeverity.color,
          fillColor: quakeSeverity.color,
          fillOpacity: pulseOpacity(quake.mag),
          opacity: pulseOpacity(quake.mag),
          weight: 1,
        }}
      />
      <CircleMarker
        center={[quake.lat, quake.lng]}
        radius={radius}
        pathOptions={{
          color: quakeSeverity.color,
          fillColor: quakeSeverity.color,
          fillOpacity: 0.74,
          opacity: 0.94,
          weight: 1.5,
        }}
      >
        <Popup>
          <div className="quake-popup">
            <strong>{quake.place}</strong>
            <span>Magnitude: {formatMagnitude(quake.mag)}</span>
            <span>Depth: {formatDepth(quake.depth)}</span>
            <span>Time: {formatTime(quake.time)}</span>
          </div>
        </Popup>
      </CircleMarker>
    </>
  )
}

function QuakeMap() {
  const { data, loading, error, empty } = useEarthquakes()

  return (
    <main className="quake-map-screen">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        maxZoom={8}
        zoomControl={false}
        worldCopyJump
        className="quake-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {data.map((quake) => (
          <QuakeMarker key={quake.id} quake={quake} />
        ))}
      </MapContainer>
      {(loading || error || empty) && (
        <div className="map-status" role="status">
          {loading && 'Loading USGS earthquakes...'}
          {error && `USGS data unavailable: ${error}`}
          {empty && 'No earthquakes reported in the last 24 hours.'}
        </div>
      )}
      <div className="map-vignette" aria-hidden="true" />
      <div className="map-grid" aria-hidden="true" />
    </main>
  )
}

export default QuakeMap
