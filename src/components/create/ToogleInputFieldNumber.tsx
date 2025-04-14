import { useId } from 'react'

interface ToggleInputFieldNumberProps {
  label: string
  placeholder: string
  enabled: boolean
  setEnabled: (v: boolean) => void
  value: string
  setValue: (v: string) => void
}

export default function ToggleInputFieldNumber({
  label,
  placeholder,
  enabled,
  setEnabled,
  value,
  setValue,
}: ToggleInputFieldNumberProps) {
  const id = useId()
  const isValid = value === '' || /^\d+$/.test(value)

  return (
    <div className="flex items-center space-x-3 relative">
      <label htmlFor={id} className="relative">
        <input
          id={id}
          type="checkbox"
          checked={enabled}
          onChange={() => setEnabled(!enabled)}
          className="peer hidden"
        />
        <div
          className={`
            w-5 h-5 flex items-center justify-center rounded-md border-2 
            transition-all duration-150
            ${enabled ? 'bg-white border-black' : 'bg-gray-200 border-gray-400'}
          `}
        >
          {enabled && (
            <svg
              className="w-3 h-3 text-black"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
      </label>

      <div className="relative flex-1">
        {value && (
          <span className="absolute -top-3 left-2 text-xs text-gray-500 bg-white px-1 rounded pointer-events-none">
            {placeholder}
          </span>
        )}
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder={placeholder}
          className={`
            w-full px-3 py-2 border-2 rounded-2xl transition 
            ${enabled
              ? 'bg-white text-black border-black'
              : 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'}
            ${!isValid && 'border-red-500'}
          `}
          value={value}
          onChange={(e) => {
            const newValue = e.target.value
            if (newValue === '' || /^\d+$/.test(newValue)) {
              setValue(newValue)
            }
          }}
          disabled={!enabled}
        />
      </div>
    </div>
  )
}
