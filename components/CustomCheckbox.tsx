import { Checkbox } from "@/components/ui/checkbox"

interface CustomCheckboxProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  isDarkMode: boolean
}

export default function CustomCheckbox({ label, checked, onChange, isDarkMode }: CustomCheckboxProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={label}
        checked={checked}
        onCheckedChange={onChange}
        className={`${
          isDarkMode ? 'border-purple-400 text-purple-600' : 'border-purple-600 text-purple-800'
        } focus:ring-purple-500`}
      />
      <label
        htmlFor={label}
        className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
          isDarkMode ? 'text-gray-300 hover:text-purple-400' : 'text-gray-700 hover:text-purple-600'
        } transition-colors duration-300`}
      >
        {label}
      </label>
    </div>
  )
}

