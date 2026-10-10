'use client'

import { MIN_ENTROPY_BITS } from '@/lib/entropy'

const SEGMENTS = 56
const CEILING_BITS = 256

interface EntropyMeterProps {
  bits: number
  isDarkMode: boolean
}

/**
 * Segmented scale with the enforced floor marked at its true position.
 *
 * Not a traffic light. A weak password is unreachable through this interface,
 * so a danger colour would assert a risk the user cannot actually take, and
 * telling someone they are safe for the wrong reason is worse than saying
 * nothing. The floor mark does the honest work instead: it shows where the
 * guarantee sits and how far past it the current settings sit.
 */
export default function EntropyMeter({ bits, isDarkMode }: EntropyMeterProps) {
  const label = isDarkMode ? 'text-white/60' : 'text-black/60'
  const filled = Math.max(0, Math.min(SEGMENTS, Math.round((bits / CEILING_BITS) * SEGMENTS)))
  const floorPct = (MIN_ENTROPY_BITS / CEILING_BITS) * 100
  const floorSegment = Math.round((MIN_ENTROPY_BITS / CEILING_BITS) * SEGMENTS)

  return (
    <div>
      <div className="relative">
        <div
          className="meter-track"
          role="img"
          aria-label={`${bits.toFixed(0)} bits of entropy. The enforced floor is ${MIN_ENTROPY_BITS} bits.`}
        >
          {Array.from({ length: SEGMENTS }, (_, i) => {
            const belowFloor = i < floorSegment
            return (
              <span
                key={i}
                className="meter-seg"
                data-filled={i < filled}
                data-below-floor={belowFloor && i < filled}
              />
            )
          })}
        </div>
        <div className="meter-floor" style={{ left: `${floorPct}%` }} aria-hidden="true" />
      </div>

      {/* The floor label is anchored to the mark, not to the left edge, so the
          number under it is the one the mark actually points at. */}
      <div className="relative mt-2 h-3 text-[9px] tracking-[0.14em]">
        <span
          className={`readout absolute -translate-x-1/2 whitespace-nowrap ${label}`}
          style={{ left: `${floorPct}%` }}
        >
          {MIN_ENTROPY_BITS} FLOOR
        </span>
        <span className={`readout absolute right-0 whitespace-nowrap ${label}`}>
          {CEILING_BITS} BITS
        </span>
      </div>
    </div>
  )
}