import type { Earthquake } from '../hooks/useEarthquakes'
import { stats } from './stats.ts'

const baseQuake = {
  id: 'sample',
  place: 'Unknown location',
  time: 0,
  lng: 0,
  lat: 0,
  depth: null,
} satisfies Omit<Earthquake, 'mag'>

function quake(id: string, mag: number | null, place = 'Test location'): Earthquake {
  return {
    ...baseQuake,
    id,
    mag,
    place,
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message)
  }
}

function assertClose(actual: number | null, expected: number, message: string) {
  assert(actual !== null && Math.abs(actual - expected) < 0.0001, message)
}

export function runStatsTests() {
  const empty = stats([])

  assert(empty.total === 0, 'empty stats should have total 0')
  assert(empty.averageMagnitude === null, 'empty stats should have no average magnitude')
  assert(empty.strongCount === 0, 'empty stats should have no strong events')
  assert(empty.maxMagnitude === null, 'empty stats should have no max magnitude')
  assert(empty.buckets.every((bucket) => bucket.count === 0), 'empty buckets should be 0')

  const result = stats([
    quake('a', 1.2),
    quake('b', 2.4),
    quake('c', 4.8),
    quake('d', 6.1, 'Strong place'),
    quake('dirty', null),
  ])

  assert(result.total === 5, 'total should include null magnitude events')
  assertClose(result.averageMagnitude, 3.625, 'average should ignore null values')
  assert(result.strongCount === 1, 'strong count should count magnitude >= 6')
  assert(result.maxMagnitude?.mag === 6.1, 'max magnitude should ignore null values')
  assert(result.maxMagnitude?.place === 'Strong place', 'max magnitude should keep place')
  assert(result.buckets[0].count === 1, 'weak bucket count should be 1')
  assert(result.buckets[1].count === 1, 'light bucket count should be 1')
  assert(result.buckets[2].count === 1, 'moderate bucket count should be 1')
  assert(result.buckets[3].count === 1, 'strong bucket count should be 1')
}

runStatsTests()
