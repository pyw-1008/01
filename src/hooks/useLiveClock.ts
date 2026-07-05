import { useEffect, useState } from 'react'

function formatClock(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date)
}

export function useLiveClock() {
  const [clock, setClock] = useState(() => formatClock(new Date()))

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setClock(formatClock(new Date()))
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [])

  return clock
}
