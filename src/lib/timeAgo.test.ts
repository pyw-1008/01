import { timeAgo } from './timeAgo'

function assertEqual(actual: string, expected: string) {
  if (actual !== expected) {
    throw new Error(`Expected "${expected}", got "${actual}"`)
  }
}

export function runTimeAgoTests() {
  const now = 1_700_000_000_000

  assertEqual(timeAgo(0, now), '未知时间')
  assertEqual(timeAgo(now - 20_000, now), '刚刚')
  assertEqual(timeAgo(now - 12 * 60_000, now), '12 分钟前')
  assertEqual(timeAgo(now - 3 * 60 * 60_000, now), '3 小时前')
  assertEqual(timeAgo(now - 2 * 24 * 60 * 60_000, now), '2 天前')
}

runTimeAgoTests()
