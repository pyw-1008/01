import { useCallback, useEffect, useRef, useState } from 'react'
import { USGS_FEEDS, type TimeRangeKey } from '../lib/usgsFeeds'

export type Earthquake = {
  id: string
  mag: number | null
  place: string
  time: number
  lng: number
  lat: number
  depth: number | null
  detailUrl?: string
}

type UsgsFeature = {
  id?: string
  properties?: {
    mag?: number | null
    place?: string | null
    time?: number | null
    url?: string | null
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
  refreshing: boolean
  error: string | null
  empty: boolean
  lastUpdated: number | null
  newEventIds: Set<string>
  refresh: () => void
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
    detailUrl: feature.properties?.url ?? undefined,
  }
}

export function useEarthquakes(timeRange: TimeRangeKey): EarthquakeState {
  const abortRef = useRef<AbortController | null>(null)
  const [state, setState] = useState<EarthquakeState>({
    data: [],
    loading: true,
    refreshing: false,
    error: null,
    empty: false,
    lastUpdated: null,
    newEventIds: new Set(),
    refresh: () => undefined,
  })

  const loadEarthquakes = useCallback(
    async (mode: 'range' | 'refresh' | 'manual' = 'range') => {
      abortRef.current?.abort()
    const controller = new AbortController()
      abortRef.current = controller

      setState((current) => ({
        ...current,
        loading: current.data.length === 0,
        refreshing: current.data.length > 0 || mode !== 'range',
        error: null,
      }))

      try {
        const response = await fetch(USGS_FEEDS[timeRange].url, {
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

        setState((current) => {
          const previousIds = new Set(current.data.map((quake) => quake.id))
          const newEventIds =
            mode !== 'range' && previousIds.size > 0
              ? new Set(data.filter((quake) => !previousIds.has(quake.id)).map((quake) => quake.id))
              : new Set<string>()

          return {
            data,
            loading: false,
            refreshing: false,
            error: null,
            empty: data.length === 0,
            lastUpdated: Date.now(),
            newEventIds,
            refresh: current.refresh,
          }
        })
      } catch (error) {
        if (controller.signal.aborted) {
          return
        }

        setState((current) => ({
          data: current.data,
          loading: false,
          refreshing: false,
          error: error instanceof Error ? error.message : 'Failed to load earthquakes',
          empty: current.data.length === 0,
          lastUpdated: current.lastUpdated,
          newEventIds: new Set(),
          refresh: current.refresh,
        }))
      }
    },
    [timeRange],
  )

  const refresh = useCallback(() => {
    void loadEarthquakes('manual')
  }, [loadEarthquakes])

  useEffect(() => {
    setState((current) => ({ ...current, refresh }))
  }, [refresh])

  useEffect(() => {
    void loadEarthquakes('range')
    const intervalId = window.setInterval(() => {
      void loadEarthquakes('refresh')
    }, 60_000)

    return () => {
      window.clearInterval(intervalId)
      abortRef.current?.abort()
    }
  }, [loadEarthquakes])

  return state
}
