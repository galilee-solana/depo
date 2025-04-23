import {useState, useEffect} from 'react'
import { KeyboardEvent } from 'react'

interface BaseInputProps {
    label?: string
    type: string
    id: string
    enabled: boolean
    placeholder: string
    value: string
    setValue: (value: string) => void
    pattern?: string
    inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'
    onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void
    max?: string
}

function BaseInput({label, type, id, enabled, placeholder, value, setValue, pattern, inputMode, onKeyDown, max}: BaseInputProps ) {
  const [showFakePlaceholder, setShowFakePlaceholder] = useState(true)

  useEffect(() => {
    setShowFakePlaceholder(!enabled && value.trim() === '')
  }, [enabled, value])

  return (
      <>
      {/* Faux placeholder */}
      {showFakePlaceholder && (
        <div className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
          {placeholder}
        </div>
      )}

      <div className="relative flex-1">
        {value && (
          <span className="absolute -top-3 left-2 text-xs text-gray-500 bg-white px-1 rounded pointer-events-none">
            {label}
          </span>
        )}
        <input
          type={type}
          id={id}
          className={`
            w-full px-3 py-2 border-2 rounded-2xl appearance-none transition
            ${enabled
              ? 'bg-white text-black border-black placeholder-gray-400'
              : 'bg-gray-100 text-gray-100 border-gray-300 placeholder-gray-100 cursor-not-allowed'}
          `}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!enabled}
          {...(pattern && { pattern })}
          {...(inputMode && { inputMode })}
          {...(onKeyDown && { onKeyDown })}
          {...(max && { max })}
        />
      </div>
      </>
    )
}

export default BaseInput