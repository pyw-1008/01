const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

export function timeAgo(time: number, now = Date.now()): string {
  if (!Number.isFinite(time) || time <= 0) {
    return '未知时间'
  }

  const diff = Math.max(0, now - time)

  if (diff < MINUTE) {
    return '刚刚'
  }

  if (diff < HOUR) {
    return `${Math.floor(diff / MINUTE)} 分钟前`
  }

  if (diff < DAY) {
    return `${Math.floor(diff / HOUR)} 小时前`
  }

  return `${Math.floor(diff / DAY)} 天前`
}
