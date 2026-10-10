import { Checkbox } from "@/components/ui/checkbox"

interface CustomCheckboxProps {
  label: string
  title?: string
  checked: boolean
  onChange: (checked: boolean) => void
  isDarkMode: boolean
}

/**
 * A single interactive control, not a wrapper around one.
 *
 * Radix renders its checkbox as a <button role="checkbox">, so wrapping it in
 * another <button> nests interactive elements and triggers a hydration
 * mismatch. The accessible name is carried on the control itself instead of
 * via a <label for>, which does not activate a button anyway.
 */
export default function CustomCheckbox({ label, title, checked, onChange, isDarkMode }: CustomCheckboxProps) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={title ?? label}
        checked={checked}
        onCheckedChange={onChange}
        aria-label={title ?? label}
        className={`h-3.5 w-3.5 rounded-[3px] border transition-colors duration-200 ${
          checked
            ? isDarkMode
              ? 'border-white bg-white text-black'
              : 'border-black bg-black text-white'
            : isDarkMode
              ? 'border-white/25 bg-transparent text-transparent'
              : 'border-black/25 bg-transparent text-transparent'
        }`}
      />
      <span
        className={`pointer-events-none font-mono text-[12px] leading-none transition-colors duration-200 ${
          checked
            ? isDarkMode
              ? 'text-white/80'
              : 'text-black/80'
            : isDarkMode
              ? 'text-white/25'
              : 'text-black/25'
        }`}
      >
        {label}
      </span>
    </div>
  )
}