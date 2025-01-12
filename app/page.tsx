'use client'

import { useState } from 'react'
import PasswordGenerator from '../components/PasswordGenerator'
import AnimatedBackground from '../components/AnimatedBackground'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true)

  return (
    <main className={`flex min-h-screen flex-col items-center justify-center p-4 relative overflow-hidden ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'
    }`}>
      <AnimatedBackground isDarkMode={isDarkMode} />
      <div className="absolute top-4 right-4 z-20 flex items-center">
        <Switch
          id="dark-mode"
          checked={isDarkMode}
          onCheckedChange={setIsDarkMode}
        />
        <Label htmlFor="dark-mode" className="ml-2">
          Dark Mode
        </Label>
      </div>
      <div className="z-10 flex flex-col items-center justify-center w-full max-w-md">
        <h1 className={`mb-8 text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r ${
          isDarkMode ? 'from-purple-400 to-pink-600' : 'from-purple-600 to-pink-800'
        } animate-pulse`}>
          SecPassGen
        </h1>
        <PasswordGenerator isDarkMode={isDarkMode} />
      </div>
    </main>
  )
}

