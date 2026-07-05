export type TimeRangeKey = '1h' | '24h' | '7d' | '30d'

export type UsgsFeed = {
  label: string
  shortLabel: string
  url: string
}

export const DEFAULT_TIME_RANGE: TimeRangeKey = '24h'

export const USGS_FEEDS: Record<TimeRangeKey, UsgsFeed> = {
  '1h': {
    label: 'Past 1 hour',
    shortLabel: '1H',
    url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson',
  },
  '24h': {
    label: 'Past 24 hours',
    shortLabel: '24H',
    url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson',
  },
  '7d': {
    label: 'Past 7 days',
    shortLabel: '7D',
    url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson',
  },
  '30d': {
    label: 'Past 30 days',
    shortLabel: '30D',
    url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson',
  },
}

export const TIME_RANGE_OPTIONS = Object.keys(USGS_FEEDS) as TimeRangeKey[]
