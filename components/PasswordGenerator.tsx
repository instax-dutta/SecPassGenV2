'use client'

import { useState, useEffect } from 'react'
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, RefreshCw } from 'lucide-react'
import StrengthMeter from './StrengthMeter'
import CustomCheckbox from './CustomCheckbox'

export default function PasswordGenerator({ isDarkMode }: { isDarkMode: boolean }) {
  const [passwords, setPasswords] = useState<string[]>([])
  const [length, setLength] = useState(12)
  const [count, setCount] = useState(1)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [isShuffling, setIsShuffling] = useState(false)

  const generatePassword = (charset: string): string => {
    let newPassword = ''
    for (let j = 0; j < length; j++) {
      newPassword += charset.charAt(Math.random() * charset.length)
    }
    return newPassword
  }

  const generatePasswords = () => {
    setIsShuffling(true)
    let charset = ''
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (includeNumbers) charset += '0123456789'
    if (includeSymbols) charset += '!@#$%^&*()_+{}[]|:;<>,.?/~'

    const newPasswords = new Set<string>()
    let attempts = 0
    const maxAttempts = count * 10 // Prevent infinite loop

    while (newPasswords.size < count && attempts < maxAttempts) {
      const password = generatePassword(charset)
      newPasswords.add(password)
      attempts++
    }

    setPasswords(Array.from(newPasswords))
  }

  useEffect(() => {
    if (isShuffling) {
      const shuffleInterval = setInterval(() => {
        const shuffledPasswords = passwords.map(password => 
          password.split('').sort(() => Math.random() - 0.5).join('')
        )
        setPasswords(shuffledPasswords)
      }, 50)

      setTimeout(() => {
        clearInterval(shuffleInterval)
        setIsShuffling(false)
        generatePasswords()
      }, 500)

      return () => clearInterval(shuffleInterval)
    }
  }, [isShuffling])

  const copyToClipboard = (password: string) => {
    navigator.clipboard.writeText(password)
  }

  return (
    <div className={`w-full max-w-md p-6 rounded-lg shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl ${
      isDarkMode ? 'bg-gray-800 bg-opacity-80 hover:bg-opacity-90' : 'bg-white bg-opacity-80 hover:bg-opacity-90'
    }`}>
      <div className="mb-4 space-y-2">
        {passwords.map((password, index) => (
          <div key={index} className="flex items-center space-x-2 animate-fadeIn">
            <Input
              type="text"
              value={password}
              readOnly
              className={`w-full text-lg border-none transition-all duration-300 ${
                isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-black hover:bg-gray-200'
              }`}
            />
            <Button onClick={() => copyToClipboard(password)} className={`${
              isDarkMode ? 'bg-pink-600 hover:bg-pink-700' : 'bg-pink-500 hover:bg-pink-600'
            } transition-colors duration-300`}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <div className="flex justify-between mb-4">
        <Button onClick={generatePasswords} className={`${
          isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'
        } transition-colors duration-300 transform hover:scale-105`}>
          <RefreshCw className="mr-2 h-4 w-4" /> Generate
        </Button>
      </div>
      <div className="mb-4">
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Password Length: {length}
        </label>
        <Slider
          value={[length]}
          onValueChange={(value) => setLength(value[0])}
          max={32}
          min={8}
          step={1}
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Number of Passwords: {count}
        </label>
        <Slider
          value={[count]}
          onValueChange={(value) => setCount(value[0])}
          max={10}
          min={1}
          step={1}
          className="w-full"
        />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
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
      {passwords.length > 0 && <StrengthMeter password={passwords[0]} isDarkMode={isDarkMode} />}
    </div>
  )
}

