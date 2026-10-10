'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, RefreshCw, Check, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { addToHistory } from '@/lib/passwordHistory'
import { SessionDedup } from '@/lib/sessionDedup'
import { MIN_ENTROPY_BITS, MIN_LENGTH, minimumLengthForFlags, totalEntropy } from '@/lib/entropy'
import CustomCheckbox from './CustomCheckbox'

const MAX_LENGTH_UI = 64
const MAX_GENERATION_ATTEMPTS = 8

interface PasswordGeneratorProps {
  isDarkMode: boolean
}

export default function PasswordGenerator({ isDarkMode }: PasswordGeneratorProps) {
  const [passwords, setPasswords] = useState<string[]>([])
  const [length, setLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  // Randomness above the entropy floor already makes a repeat unobservable, so
  // this ring only has to cover the case entropy cannot: the same visitor
  // pressing generate twice in one sitting.
  const sessionDedup = useRef<SessionDedup | null>(null)
  if (sessionDedup.current === null) {
    sessionDedup.current = new SessionDedup()
  }

  const flags = useMemo(
    () => ({
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols,
    }),
    [includeUppercase, includeLowercase, includeNumbers, includeSymbols]
  )

  // Mirrors the server-side floor so the control never offers a configuration
  // the API will reject.
  const minimumLength = useMemo(() => {
    const required = minimumLengthForFlags(flags)
    return Number.isFinite(required) ? Math.max(MIN_LENGTH, required) : MIN_LENGTH
  }, [flags])

  const entropyBits = useMemo(() => totalEntropy(flags, length), [flags, length])

  useEffect(() => {
    setLength((previous) => Math.max(previous, minimumLength))
  }, [minimumLength])

  const generatePasswords = async () => {
    setIsGenerating(true)

    try {
      let accepted: string | null = null

      for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS && accepted === null; attempt++) {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            length,
            count: 1,
            includeUppercase,
            includeLowercase,
            includeNumbers,
            includeSymbols,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          toast.error(data.error || 'Generation failed')
          return
        }

        const candidate: string | undefined = data.passwords?.[0]
        if (!candidate) {
          toast.error('Generation failed')
          return
        }

        if (await sessionDedup.current!.admit(candidate)) {
          accepted = candidate
        }
      }

      if (accepted === null) {
        toast.error('Could not produce a new password. Try again.')
        return
      }

      setPasswords([accepted])
      await addToHistory(accepted, length)
      toast.success('Generated new password')
    } catch (error) {
      toast.error('Network error')
      console.error('Generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async (password: string, index: number) => {
    try {
      await navigator.clipboard.writeText(password)
      setCopiedIndex(index)
      toast.success('Copied')
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (error) {
      toast.error('Copy failed')
    }
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full space-y-6"
    >
      {/* Main Generator Card */}
      <div className={`rounded-2xl p-6 sm:p-8 border backdrop-blur-xl transition-all duration-700 ${isDarkMode
        ? 'bg-white/5 border-white/10'
        : 'bg-black/5 border-black/10'
        }`}>

        {/* Password Display */}
        <div className="mb-6 space-y-3">
          <AnimatePresence mode="wait">
            {passwords.length === 0 ? (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`h-14 rounded-lg border-2 border-dashed flex items-center justify-center transition-colors duration-700 ${isDarkMode ? 'border-white/10 text-white/30' : 'border-black/10 text-black/30'
                  }`}
              >
                <span className="text-sm">Generate a password to begin</span>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-2 group"
              >
                <Input
                  type="text"
                  value={passwords[0]}
                  readOnly
                  className={`font-mono text-base border-2 transition-all duration-300 ${isDarkMode
                    ? 'bg-white/5 text-white border-white/10 hover:border-white/20 focus:border-white/30'
                    : 'bg-black/5 text-black border-black/10 hover:border-black/20 focus:border-black/30'
                    }`}
                />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => copyToClipboard(passwords[0], 0)}
                    size="lg"
                    className={`transition-all duration-300 ${copiedIndex === 0
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : isDarkMode
                        ? 'bg-white text-black hover:bg-white/90'
                        : 'bg-black text-white hover:bg-black/90'
                      }`}
                  >
                    {copiedIndex === 0 ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Generate Button */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={generatePasswords}
            disabled={isGenerating}
            size="lg"
            className={`w-full mb-6 text-base font-semibold transition-all duration-300 ${isDarkMode
              ? 'bg-white text-black hover:bg-white/90'
              : 'bg-black text-white hover:bg-black/90'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-5 w-5" />
                Generate Password
              </>
            )}
          </Button>
        </motion.div>

        {/* Length Slider */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <label className={`text-sm font-semibold ${isDarkMode ? 'text-white/70' : 'text-black/70'}`}>
              Length
            </label>
            <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
              {length}
            </span>
          </div>
          <Slider
            value={[length]}
            onValueChange={(value) => setLength(value[0])}
            max={MAX_LENGTH_UI}
            min={minimumLength}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between mt-1">
            <span className={`text-xs ${isDarkMode ? 'text-white/30' : 'text-black/30'}`}>{minimumLength}</span>
            <span className={`text-xs ${isDarkMode ? 'text-white/30' : 'text-black/30'}`}>
              {entropyBits.toFixed(0)} bits
            </span>
            <span className={`text-xs ${isDarkMode ? 'text-white/30' : 'text-black/30'}`}>{MAX_LENGTH_UI}</span>
          </div>
          <p className={`mt-2 text-[10px] ${isDarkMode ? 'text-white/30' : 'text-black/30'}`}>
            Minimum {minimumLength} characters keeps this above {MIN_ENTROPY_BITS} bits of entropy.
          </p>
        </div>


        {/* Character Options */}
        <div className="grid grid-cols-2 gap-4">
          <CustomCheckbox
            label="Uppercase"
            checked={includeUppercase}
            onChange={setIncludeUppercase}
            isDarkMode={isDarkMode}
          />
          <CustomCheckbox
            label="Lowercase"
            checked={includeLowercase}
            onChange={setIncludeLowercase}
            isDarkMode={isDarkMode}
          />
          <CustomCheckbox
            label="Numbers"
            checked={includeNumbers}
            onChange={setIncludeNumbers}
            isDarkMode={isDarkMode}
          />
          <CustomCheckbox
            label="Symbols"
            checked={includeSymbols}
            onChange={setIncludeSymbols}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
    </motion.div>
  )
}
