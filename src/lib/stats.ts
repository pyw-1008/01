import type { Earthquake } from '../hooks/useEarthquakes'
import { severity, type MagnitudeLevel } from './severity.ts'

export type SeverityBucket = {
  level: MagnitudeLevel
  color: string
  count: number
  percent: number
}

export type QuakeStats = {
  total: number
  averageMagnitude: number | null
  strongCount: number
  maxMagnitude: {
    mag: number
    place: string
  } | null
  buckets: SeverityBucket[]
}

const BUCKET_ORDER: MagnitudeLevel[] = ['微弱', '轻微', '中等', '强烈']

type KnownMagnitudeQuake = Earthquake & {
  mag: number
}

function isKnownMagnitude(mag: number | null): mag is number {
  return typeof mag === 'number' && Number.isFinite(mag)
}

export function stats(quakes: Earthquake[]): QuakeStats {
  const knownMagnitudeQuakes: KnownMagnitudeQuake[] = quakes
    .filter((quake) => isKnownMagnitude(quake.mag))
    .map((quake) => ({ ...quake, mag: quake.mag as number }))
  const bucketCounts = new Map<MagnitudeLevel, SeverityBucket>()

  for (const level of BUCKET_ORDER) {
    const bucketSeverity = severity(
      level === '微弱' ? 0 : level === '轻微' ? 2 : level === '中等' ? 4 : 6,
    )

    bucketCounts.set(level, {
      level,
      color: bucketSeverity.color,
      count: 0,
      percent: 0,
    })
  }

  let maxMagnitude: QuakeStats['maxMagnitude'] = null

  for (const quake of knownMagnitudeQuakes) {
    const quakeSeverity = severity(quake.mag)
    const bucket = bucketCounts.get(quakeSeverity.level)

    if (bucket) {
      bucket.count += 1
    }

    if (!maxMagnitude || quake.mag > maxMagnitude.mag) {
      maxMagnitude = {
        mag: quake.mag,
        place: quake.place || 'Unknown location',
      }
    }
  }

  const knownTotal = knownMagnitudeQuakes.length
  const averageMagnitude =
    knownTotal === 0
      ? null
      : knownMagnitudeQuakes.reduce((sum, quake) => sum + quake.mag, 0) / knownTotal
  const strongCount = knownMagnitudeQuakes.filter((quake) => quake.mag >= 6).length
  const buckets = BUCKET_ORDER.map((level) => {
    const bucket = bucketCounts.get(level)!

    return {
      ...bucket,
      percent: knownTotal === 0 ? 0 : Math.round((bucket.count / knownTotal) * 100),
    }
  })

  return {
    total: quakes.length,
    averageMagnitude,
    strongCount,
    maxMagnitude,
    buckets,
  }
}
