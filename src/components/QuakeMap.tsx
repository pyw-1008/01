import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer } from 'react-leaflet'

function QuakeMap() {
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
      </MapContainer>
      <div className="map-vignette" aria-hidden="true" />
      <div className="map-grid" aria-hidden="true" />
    </main>
  )
}

export default QuakeMap
