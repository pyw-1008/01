import { severity, type MagnitudeLevel } from './severity.ts'

type SeverityCase = {
  mag: number | null | undefined
  level: MagnitudeLevel
  color: string
}

const cases: SeverityCase[] = [
  { mag: 1.9, level: '微弱', color: '#22d3ee' },
  { mag: 2, level: '轻微', color: '#22c55e' },
  { mag: 3.9, level: '轻微', color: '#22c55e' },
  { mag: 4, level: '中等', color: '#f59e0b' },
  { mag: 5.9, level: '中等', color: '#f59e0b' },
  { mag: 6, level: '强烈', color: '#ef4444' },
  { mag: null, level: '微弱', color: '#22d3ee' },
]

export function runSeverityTests() {
  for (const testCase of cases) {
    const result = severity(testCase.mag)

    if (result.level !== testCase.level || result.color !== testCase.color) {
      throw new Error(
        `severity(${String(testCase.mag)}) expected ${testCase.level}/${testCase.color}, got ${result.level}/${result.color}`,
      )
    }
  }
}

runSeverityTests()
