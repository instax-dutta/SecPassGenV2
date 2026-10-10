'use client'

import { useEffect, useState } from 'react'

/**
 * Counts real data requests made by this document.
 *
 * This is a measurement, not a decoration. The value is read from the browser's
 * own Resource Timing entries, filtered to fetch and XHR initiators, so page
 * assets, fonts and stylesheets are correctly excluded and any actual data
 * request would show up. If someone reintroduced a network call, this readout
 * would stop reading zero and the claim above it would visibly stop being
 * true. That is the whole point: the number is checkable by the person
 * reading it, which is the only kind of privacy claim worth making.
 */
function useDataRequestCount(): number | null {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    const measure = () => {
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
      const dataRequests = entries.filter(
        (e) => e.initiatorType === 'fetch' || e.initiatorType === 'xmlhttprequest'
      )
      setCount(dataRequests.length)
    }

    measure()

    if (typeof PerformanceObserver === 'undefined') return
    const observer = new PerformanceObserver(measure)
    try {
      observer.observe({ type: 'resource', buffered: true })
    } catch {
      observer.observe({ entryTypes: ['resource'] })
    }
    return () => observer.disconnect()
  }, [])

  return count
}

interface AssuranceStripProps {
  isDarkMode: boolean
}

export default function AssuranceStrip({ isDarkMode }: AssuranceStripProps) {
  const requests = useDataRequestCount()

  const items = [
    {
      label: 'Runs on',
      value: 'this device',
      note: 'Your browser does the work, not our server.',
    },
    {
      label: 'Requests sent',
      value: requests === null ? '—' : String(requests),
      note: 'Your password is never sent. This counts data requests since load.',
      emphasise: true,
    },
    {
      label: 'We can recover it',
      value: 'no',
      note: 'We never receive it, so there is nothing to return.',
    },
  ]

return (
    <div
      className={`rounded-xl border ${
        isDarkMode ? 'border-white/[0.07] bg-white/[0.02]' : 'border-black/[0.07] bg-black/[0.02]'
      }`}
    >
      {/* Narrow screens get the three facts as one compact row: all three
          claims survive, but the explanatory notes would eat a third of the
          viewport on a phone. The notes return from sm up. */}
      <dl className="grid grid-cols-3 divide-x sm:hidden">
        {items.map((item) => (
          <div key={item.label} className="px-2.5 py-3 text-center">
            <dt className={`text-[8px] uppercase leading-tight tracking-[0.12em] ${isDarkMode ? 'text-white/60' : 'text-black/60'}`}>
              {item.label}
            </dt>
            <dd
              className={`readout mt-1 text-[13px] font-medium leading-none ${
                item.emphasise ? 'text-[rgb(var(--signal))]' : isDarkMode ? 'text-white/90' : 'text-black/90'
              }`}
            >
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      <dl className="hidden grid-cols-3 sm:grid">
        {items.map((item, i) => (
          <div
            key={item.label}
            className={`px-4 py-3.5 ${i > 0 ? `border-l ${isDarkMode ? 'border-white/[0.07]' : 'border-black/[0.07]'}` : ''}`}
          >
            <dt
              className={`text-[9px] uppercase tracking-[0.16em] ${
                isDarkMode ? 'text-white/60' : 'text-black/60'
              }`}
            >
              {item.label}
            </dt>
            <dd
              className={`readout mt-1 text-[15px] font-medium leading-none ${
                item.emphasise
                  ? 'text-[rgb(var(--signal))]'
                  : isDarkMode
                    ? 'text-white/90'
                    : 'text-black/90'
              }`}
            >
              {item.value}
            </dd>
            <p className={`mt-1.5 text-[10px] leading-snug ${isDarkMode ? 'text-white/55' : 'text-black/55'}`}>
              {item.note}
            </p>
          </div>
        ))}
      </dl>
    </div>
  )
}