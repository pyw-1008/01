import { useEffect, useState } from 'react'

const USGS_DAY_FEED =
  'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'

export type Earthquake = {
  id: string
  mag: number | null
  place: string
  time: number
  lng: number
  lat: number
  depth: number | null
}

type UsgsFeature = {
  id?: string
  properties?: {
    mag?: number | null
    place?: string | null
    time?: number | null
  }
  geometry?: {
    coordinates?: [number, number, number?]
  } | null
}

type UsgsResponse = {
  features?: UsgsFeature[]
}

type EarthquakeState = {
  data: Earthquake[]
  loading: boolean
  error: string | null
  empty: boolean
}

function isValidCoordinate(lng: unknown, lat: unknown) {
  return (
    typeof lng === 'number' &&
    Number.isFinite(lng) &&
    typeof lat === 'number' &&
    Number.isFinite(lat)
  )
}

function toEarthquake(feature: UsgsFeature): Earthquake | null {
  const coordinates = feature.geometry?.coordinates

  if (!coordinates) {
    return null
  }

  const [lng, lat, depth] = coordinates

  if (!isValidCoordinate(lng, lat)) {
    return null
  }

  const mag = feature.properties?.mag
  const time = feature.properties?.time

  return {
    id: feature.id ?? `${lng},${lat},${time ?? 'unknown'}`,
    mag: typeof mag === 'number' && Number.isFinite(mag) ? mag : null,
    place: feature.properties?.place || 'Unknown location',
    time: typeof time === 'number' && Number.isFinite(time) ? time : 0,
    lng: lng,
    lat: lat,
    depth: typeof depth === 'number' && Number.isFinite(depth) ? depth : null,
  }
}

export function useEarthquakes(): EarthquakeState {
  const [state, setState] = useState<EarthquakeState>({
    data: [],
    loading: true,
    error: null,
    empty: false,
  })

  useEffect(() => {
    const controller = new AbortController()

    async function loadEarthquakes() {
      setState((current) => ({ ...current, loading: true, error: null }))

      try {
        const response = await fetch(USGS_DAY_FEED, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`USGS request failed with ${response.status}`)
        }

        const payload = (await response.json()) as UsgsResponse
        const data = (payload.features ?? [])
          .map(toEarthquake)
          .filter((quake): quake is Earthquake => quake !== null)
          .sort((a, b) => b.time - a.time)

        setState({
          data,
          loading: false,
          error: null,
          empty: data.length === 0,
        })
      } catch (error) {
        if (controller.signal.aborted) {
          return
        }

        setState({
          data: [],
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to load earthquakes',
          empty: false,
        })
      }
    }

    void loadEarthquakes()

    return () => controller.abort()
  }, [])

  return state
}
