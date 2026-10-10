'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Copy, RefreshCw, Check, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { addToHistory } from '@/lib/passwordHistory'
import { SessionDedup } from '@/lib/sessionDedup'
import { MIN_ENTROPY_BITS, MIN_LENGTH, buildCharset, meetsEntropyFloor, minimumLengthForFlags, totalEntropy } from '@/lib/entropy'
import { generatePassword } from '@/lib/random'
import EntropyMeter from './EntropyMeter'
import CustomCheckbox from './CustomCheckbox'

const MAX_LENGTH_UI = 64
const MAX_GENERATION_ATTEMPTS = 8

const GROUPS: { key: string; label: string }[] = [
  { key: 'Uppercase', label: 'A-Z' },
  { key: 'Lowercase', label: 'a-z' },
  { key: 'Numbers', label: '0-9' },
  { key: 'Symbols', label: '!@#' },
]

interface PasswordGeneratorProps {
  isDarkMode: boolean
}

export default function PasswordGenerator({ isDarkMode }: PasswordGeneratorProps) {
  const [password, setPassword] = useState<string | null>(null)
  const [length, setLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const sessionDedup = useRef<SessionDedup | null>(null)
  if (sessionDedup.current === null) {
    sessionDedup.current = new SessionDedup()
  }

  const flags = useMemo(
    () => ({ includeUppercase, includeLowercase, includeNumbers, includeSymbols }),
    [includeUppercase, includeLowercase, includeNumbers, includeSymbols]
  )

  const minimumLength = useMemo(() => {
    const required = minimumLengthForFlags(flags)
    return Number.isFinite(required) ? Math.max(MIN_LENGTH, required) : MIN_LENGTH
  }, [flags])

  const bits = useMemo(() => totalEntropy(flags, length), [flags, length])
  const alphabetSize = useMemo(() => buildCharset(flags).length, [flags])

  useEffect(() => {
    setLength((previous) => Math.max(previous, minimumLength))
  }, [minimumLength])

  const generate = async () => {
    setIsGenerating(true)
    try {
      if (!meetsEntropyFloor(flags, length)) {
        toast.error(`Too weak: ${bits.toFixed(1)} bits is below the ${MIN_ENTROPY_BITS} bit floor.`)
        return
      }

      const charset = buildCharset(flags)
      let accepted: string | null = null

      for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS && accepted === null; attempt++) {
        const candidate = generatePassword(charset, length)
        if (await sessionDedup.current!.admit(candidate)) accepted = candidate
      }

      if (accepted === null) {
        toast.error('Could not produce a new password. Try again.')
        return
      }

      setPassword(accepted)
      setCopied(false)
      await addToHistory(accepted, length)
    } catch (error) {
      toast.error('Generation failed')
      console.error('Generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copy = async () => {
    if (!password) return
    try {
      await navigator.clipboard.writeText(password)
      setCopied(true)
      toast.success('Copied')
      setTimeout(() => setCopied(false), 2400)
    } catch {
      toast.error('Copy failed')
    }
  }

  const line = isDarkMode ? 'border-white/10' : 'border-black/10'
  const dim = isDarkMode ? 'text-white/60' : 'text-black/60'
  const body = isDarkMode ? 'text-white/85' : 'text-black/85'


  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`rounded-2xl border backdrop-blur-xl ${line} ${
        isDarkMode ? 'bg-white/[0.03]' : 'bg-black/[0.02]'
      }`}
    >
      {/* Readout ------------------------------------------------------ */}
      <div className="px-5 pb-5 pt-6 sm:px-6 sm:pb-6 sm:pt-7">
        <div className="mb-2.5 flex items-baseline justify-between">
          <span className={`text-[9px] uppercase tracking-[0.18em] ${dim}`}>Your password</span>
          <AnimatePresence>
            {copied && (
              <motion.span
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="readout text-[9px] uppercase tracking-[0.18em] text-[rgb(var(--signal))]"
              >
                Copied
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-stretch gap-2">
          <div className="min-w-0 flex-1">
            <AnimatePresence mode="wait" initial={false}>
              {password === null ? (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`readout flex h-[72px] items-center rounded-lg border border-dashed px-4 text-[14px] ${line} ${dim}`}
                >
                  Press generate to draw one
                </motion.div>
              ) : (
                <motion.div
                  key="value"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className={`readout-display flex h-[72px] items-center overflow-x-auto rounded-lg border px-4 font-mono text-[17px] sm:text-[19px] leading-none ${line} ${
                    isDarkMode ? 'bg-white/[0.04] text-white' : 'bg-black/[0.03] text-black'
                  }`}
                >
                  <input
                    readOnly
                    value={password}
                    aria-label="Generated password"
                    onFocus={(e) => e.currentTarget.select()}
                    className="w-full bg-transparent outline-none"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button
            onClick={copy}
            disabled={password === null}
            aria-label="Copy password"
            className={`h-[72px] w-[72px] shrink-0 rounded-lg border transition-all duration-200 ${
              copied
                ? 'border-[rgb(var(--signal))] bg-[rgb(var(--signal))] text-black'
                : password === null
                  ? `border-transparent ${isDarkMode ? 'bg-white/[0.02] text-white/15' : 'bg-black/[0.01] text-black/15'}`
                  : isDarkMode
                    ? 'border-white/15 bg-transparent text-white/70 hover:border-white/35 hover:bg-white/[0.05] hover:text-white'
                    : 'border-black/15 bg-transparent text-black/70 hover:border-black/35 hover:bg-black/[0.04] hover:text-black'
            }`}
          >
            {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Action ------------------------------------------------------- */}
      <div className="px-5 pb-6 sm:px-6 sm:pb-7">
        <Button
          onClick={generate}
          disabled={isGenerating}
          className={`h-[52px] w-full rounded-lg text-[14px] font-medium tracking-wide transition-all duration-200 ${
            isDarkMode ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90'
          } disabled:opacity-60`}
        >
          {isGenerating ? (
            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
          )}
          Generate Password
        </Button>
      </div>

      {/* Instrumentation ----------------------------------------------- */}
      <div className={`border-t px-5 py-7 sm:px-6 ${line}`}>
        <div className="mb-5 flex items-end justify-between">
          <div>
            <div className={`mb-1.5 text-[9px] uppercase tracking-[0.18em] ${dim}`}>Length</div>
            <div className={`readout text-2xl font-medium leading-none ${body}`}>
              {length}
              <span className={`ml-1 text-[11px] font-normal ${dim}`}>chars</span>
            </div>
          </div>
          <div className="text-right">
            <div className={`mb-1.5 text-[9px] uppercase tracking-[0.18em] ${dim}`}>Entropy</div>
            <div className="readout text-2xl font-medium leading-none text-[rgb(var(--signal))]">
              {bits.toFixed(0)}
              <span className="ml-1 text-[11px] font-normal tracking-wide">bits</span>
            </div>
          </div>
        </div>

        <Slider
          value={[length]}
          onValueChange={(value) => setLength(value[0])}
          min={minimumLength}
          max={MAX_LENGTH_UI}
          step={1}
          aria-label="Password length"
          className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:bg-white [&_[role=slider]]:border-0 [&_[role=slider]]:shadow-[0_0_0_4px_rgba(255,255,255,0.06)]"
        />
        <div className={`mt-1.5 flex justify-between text-[10px] ${dim}`}>
          <span className="readout">{minimumLength}</span>
          <span className="readout">{MAX_LENGTH_UI}</span>
        </div>

        <div className="mt-7">
          <EntropyMeter bits={bits} isDarkMode={isDarkMode} />
          {/* States the derivation so the bits figure can be checked rather
              than taken on faith, and the guarantee in the same breath. */}
          <p className={`mt-3 text-[11px] leading-snug ${dim}`}>
            {length} characters from a {alphabetSize}-symbol alphabet. The {MIN_ENTROPY_BITS}-bit floor is
            always enforced, so nothing weaker can reach you.
          </p>
        </div>
      </div>

      {/* Alphabet ------------------------------------------------------- */}
      <div className={`grid grid-cols-4 border-t ${line}`}>
        {GROUPS.map((group, i) => {
          const setter = {
            Uppercase: setIncludeUppercase,
            Lowercase: setIncludeLowercase,
            Numbers: setIncludeNumbers,
            Symbols: setIncludeSymbols,
          }[group.key]!
          const active = flags[`include${group.key}` as keyof typeof flags]

          return (
            <div
              key={group.key}
              className={`px-4 py-4 ${i > 0 ? `border-l ${line}` : ''}`}
            >
              <CustomCheckbox
                label={group.label}
                title={group.key}
                checked={active}
                onChange={setter}
                isDarkMode={isDarkMode}
              />
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}