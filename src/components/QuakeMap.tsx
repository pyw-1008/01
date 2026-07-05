import 'leaflet/dist/leaflet.css'
import { useEffect, useMemo, useState } from 'react'
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'
import { useMap } from 'react-leaflet/hooks'
import { useEarthquakes, type Earthquake } from '../hooks/useEarthquakes'
import { severity } from '../lib/severity'
import EventList from './EventList'
import StatsPanel from './StatsPanel'
import TopBar from './TopBar'

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

function FlyToSelected({ quake }: { quake: Earthquake | null }) {
  const map = useMap()

  useEffect(() => {
    if (!quake) {
      return
    }

    map.flyTo([quake.lat, quake.lng], Math.max(map.getZoom(), 5), {
      duration: 1.1,
      easeLinearity: 0.2,
    })
  }, [map, quake])

  return null
}

function SelectedQuakePopup({ quake }: { quake: Earthquake | null }) {
  if (!quake) {
    return null
  }

  return (
    <Popup position={[quake.lat, quake.lng]}>
      <div className="quake-popup">
        <strong>{quake.place}</strong>
        <span>Magnitude: {formatMagnitude(quake.mag)}</span>
        <span>Depth: {formatDepth(quake.depth)}</span>
        <span>Time: {formatTime(quake.time)}</span>
      </div>
    </Popup>
  )
}

function QuakeMap() {
  const { data, loading, refreshing, error, empty, lastUpdated, newEventIds } =
    useEarthquakes()
  const [minMagnitude, setMinMagnitude] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const visibleQuakes = useMemo(
    () => data.filter((quake) => (quake.mag ?? 0) >= minMagnitude),
    [data, minMagnitude],
  )
  const selectedQuake = visibleQuakes.find((quake) => quake.id === selectedId) ?? null

  function handleSelectQuake(quake: Earthquake) {
    setSelectedId(quake.id)
  }

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
        {visibleQuakes.map((quake) => (
          <QuakeMarker key={quake.id} quake={quake} />
        ))}
        <FlyToSelected quake={selectedQuake} />
        <SelectedQuakePopup quake={selectedQuake} />
      </MapContainer>
      {(loading || error || empty) && (
        <div className="map-status" role="status">
          {loading && 'Loading USGS earthquakes...'}
          {error && `USGS data unavailable: ${error}`}
          {empty && 'No earthquakes reported in the last 24 hours.'}
        </div>
      )}
      <TopBar
        minMagnitude={minMagnitude}
        refreshing={refreshing}
        onMinMagnitudeChange={setMinMagnitude}
      />
      <StatsPanel quakes={visibleQuakes} lastUpdated={lastUpdated} />
      <EventList
        newEventIds={newEventIds}
        quakes={visibleQuakes}
        selectedId={selectedId}
        onSelect={handleSelectQuake}
      />
      <div className="map-vignette" aria-hidden="true" />
      <div className="map-grid" aria-hidden="true" />
    </main>
  )
}

export default QuakeMap
