import { useId } from 'react'
import useToggle from '@/hooks/useToggle'
import BaseInput from './BaseInput'

interface ToggleInputFieldDateTimeProps {
  label: string
  placeholder: string
  value: string
  setValue: (v: string) => void
}

export default function ToggleInputFieldDateTime({
  label,
  placeholder,
  value,
  setValue,
}: ToggleInputFieldDateTimeProps) {
  const id = useId()
  const [enabled, toggle] = useToggle(false)

  return (
    <div className="flex items-center space-x-3 relative w-full">
      {/* Checkbox */}
      <label htmlFor={id} className="relative">
        <input
          id={id}
          type="checkbox"
          checked={enabled}
          onChange={toggle}
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

      <BaseInput
        type="datetime-local"
        id={`${id}-input`}
        enabled={enabled}
        placeholder={placeholder}
        value={value}
        setValue={setValue}
        label={label}
      />
    </div>
  )
}

