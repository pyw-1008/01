export type MagnitudeLevel = '微弱' | '轻微' | '中等' | '强烈'

export type Severity = {
  level: MagnitudeLevel
  color: string
}

export function severity(mag: number | null | undefined): Severity {
  const value = typeof mag === 'number' && Number.isFinite(mag) ? mag : 0

  if (value < 2) {
    return { level: '微弱', color: '#22d3ee' }
  }

  if (value < 4) {
    return { level: '轻微', color: '#22c55e' }
  }

  if (value < 6) {
    return { level: '中等', color: '#f59e0b' }
  }

  return { level: '强烈', color: '#ef4444' }
}
