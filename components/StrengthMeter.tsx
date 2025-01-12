import { useEffect, useState } from 'react'

interface StrengthMeterProps {
  password: string
  isDarkMode: boolean
}

export default function StrengthMeter({ password, isDarkMode }: StrengthMeterProps) {
  const [strength, setStrength] = useState(0)

  useEffect(() => {
    const calculateStrength = () => {
      let score = 0
      if (password.length > 8) score++
      if (password.match(/[A-Z]/)) score++
      if (password.match(/[a-z]/)) score++
      if (password.match(/[0-9]/)) score++
      if (password.match(/[^A-Za-z0-9]/)) score++
      setStrength(score)
    }

    calculateStrength()
  }, [password])

  const getStrengthLabel = () => {
    if (strength === 0) return 'Very Weak'
    if (strength === 1) return 'Weak'
    if (strength === 2) return 'Fair'
    if (strength === 3) return 'Good'
    if (strength === 4) return 'Strong'
    return 'Very Strong'
  }

  const getStrengthColor = () => {
    if (strength === 0) return 'bg-red-600'
    if (strength === 1) return 'bg-orange-500'
    if (strength === 2) return 'bg-yellow-500'
    if (strength === 3) return 'bg-green-500'
    if (strength === 4) return 'bg-blue-500'
    return 'bg-purple-600'
  }

  return (
    <div className="mt-4 animate-fadeIn">
      <div className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        Password Strength: {getStrengthLabel()}
      </div>
      <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded-full h-2.5 overflow-hidden`}>
        <div
          className={`h-2.5 rounded-full ${getStrengthColor()} transition-all duration-500 ease-in-out`}
          style={{ width: `${(strength / 5) * 100}%` }}
        ></div>
      </div>
    </div>
  )
}

