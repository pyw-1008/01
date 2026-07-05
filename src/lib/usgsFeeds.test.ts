import { TIME_RANGE_OPTIONS, USGS_FEEDS } from './usgsFeeds.ts'

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message)
  }
}

export function runUsgsFeedsTests() {
  assert(TIME_RANGE_OPTIONS.length === 4, 'should expose four time ranges')

  for (const range of TIME_RANGE_OPTIONS) {
    const feed = USGS_FEEDS[range]

    assert(Boolean(feed.label), `${range} should have a label`)
    assert(Boolean(feed.shortLabel), `${range} should have a short label`)
    assert(feed.url.startsWith('https://earthquake.usgs.gov/'), `${range} should use USGS`)
    assert(feed.url.endsWith('.geojson'), `${range} should point to GeoJSON`)
  }
}

runUsgsFeedsTests()
