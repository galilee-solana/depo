import { useId } from 'react'
import { useState, useEffect } from 'react'

interface ToggleInputFieldDateTimeProps {
  label: string
  placeholder: string
  enabled: boolean
  setEnabled: (v: boolean) => void
  value: string
  setValue: (v: string) => void
}

export default function ToggleInputFieldDateTime({
  label,
  placeholder,
  enabled,
  setEnabled,
  value,
  setValue,
}: ToggleInputFieldDateTimeProps) {
  const id = useId()

  const showFlyover = value.trim().length > 0 || enabled
  const showFakePlaceholder = !enabled && value.trim() === ''

  return (
    <div className="flex items-center space-x-3 relative w-full">
      {/* Checkbox */}
      <label htmlFor={id} className="relative">
        <input
          id={id}
          type="checkbox"
          checked={enabled}
          onChange={() => setEnabled(!enabled)}
          className="peer hidden"
        />
        <div
          className={`w-5 h-5 flex items-center justify-center rounded-md border-2 transition-all duration-150
            ${enabled ? 'bg-white border-black' : 'bg-gray-200 border-gray-400'}`}
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

      {/* Input avec flyover et gestion placeholder */}
      <div className="relative flex-1">
        {/* Flyover label */}
        {showFlyover && (
          <div className="absolute -top-3 left-2 text-xs text-gray-500 bg-white px-1 rounded pointer-events-none">
            {label}
          </div>
        )}

        {/* Faux placeholder */}
        {showFakePlaceholder && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {placeholder}
          </div>
        )}

        <input
          type="datetime-local"
          id={`${id}-input`}
          className={`
            w-full px-3 py-2 border-2 rounded-2xl appearance-none transition
            ${enabled
              ? 'bg-white text-black border-black placeholder-gray-400'
              : 'bg-gray-100 text-gray-100 border-gray-300 placeholder-gray-100 cursor-not-allowed'}
          `}
          placeholder="YY/MM/DD hh:mm:ss"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!enabled}
        />
      </div>
    </div>
  )
}

