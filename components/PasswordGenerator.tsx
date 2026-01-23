'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, RefreshCw, Check, Loader2, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { addToHistory } from '@/lib/passwordHistory'
import CustomCheckbox from './CustomCheckbox'

interface PasswordGeneratorProps {
  isDarkMode: boolean
  onGenerate?: () => void
}

export default function PasswordGenerator({ isDarkMode, onGenerate }: PasswordGeneratorProps) {
  const [passwords, setPasswords] = useState<string[]>([])
  const [length, setLength] = useState(16)
  const [count, setCount] = useState(1)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const generatePasswords = async () => {
    setIsGenerating(true)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          length,
          count,
          includeUppercase,
          includeLowercase,
          includeNumbers,
          includeSymbols,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || 'Generation failed')
        return
      }

      const data = await response.json()
      setPasswords(data.passwords)

      // Add to history
      if (data.passwords.length > 0) {
        await addToHistory(data.passwords[0], length)
      }

      toast.success(`Generated ${data.passwords.length} password${data.passwords.length > 1 ? 's' : ''}`)
      if (onGenerate) onGenerate()
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
              passwords.map((password, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-2 group"
                >
                  <Input
                    type="text"
                    value={password}
                    readOnly
                    className={`font-mono text-base border-2 transition-all duration-300 ${isDarkMode
                      ? 'bg-white/5 text-white border-white/10 hover:border-white/20 focus:border-white/30'
                      : 'bg-black/5 text-black border-black/10 hover:border-black/20 focus:border-black/30'
                      }`}
                  />
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => copyToClipboard(password, index)}
                      size="lg"
                      className={`transition-all duration-300 ${copiedIndex === index
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : isDarkMode
                          ? 'bg-white text-black hover:bg-white/90'
                          : 'bg-black text-white hover:bg-black/90'
                        }`}
                    >
                      {copiedIndex === index ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </motion.div>
                </motion.div>
              ))
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
                Generate Password{count > 1 ? 's' : ''}
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
            max={64}
            min={8}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between mt-1">
            <span className={`text-xs ${isDarkMode ? 'text-white/30' : 'text-black/30'}`}>8</span>
            <span className={`text-xs ${isDarkMode ? 'text-white/30' : 'text-black/30'}`}>64</span>
          </div>
        </div>

        {/* Count Slider */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <label className={`text-sm font-semibold ${isDarkMode ? 'text-white/70' : 'text-black/70'}`}>
              Quantity
            </label>
            <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
              {count}
            </span>
          </div>
          <Slider
            value={[count]}
            onValueChange={(value) => setCount(value[0])}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between mt-1">
            <span className={`text-xs ${isDarkMode ? 'text-white/30' : 'text-black/30'}`}>1</span>
            <span className={`text-xs ${isDarkMode ? 'text-white/30' : 'text-black/30'}`}>10</span>
          </div>
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
