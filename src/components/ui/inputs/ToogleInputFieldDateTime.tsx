import { useId, useState, useEffect } from 'react'
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
  const [internalValue, setInternalValue] = useState('')
  
  // Convert external value to HTML datetime-local format (YYYY-MM-DDThh:mm)
  useEffect(() => {
    if (!value) {
      setInternalValue('')
      return
    }
    
    try {
      // Try to parse the value as a date
      const dateObj = new Date(value)
      if (!isNaN(dateObj.getTime())) {
        // Valid date, format for datetime-local input
        const year = dateObj.getFullYear()
        const month = String(dateObj.getMonth() + 1).padStart(2, '0')
        const day = String(dateObj.getDate()).padStart(2, '0')
        const hours = String(dateObj.getHours()).padStart(2, '0')
        const minutes = String(dateObj.getMinutes()).padStart(2, '0')
        
        setInternalValue(`${year}-${month}-${day}T${hours}:${minutes}`)
      }
    } catch (e) {
      // If parsing fails, keep the input value empty
      setInternalValue('')
    }
  }, [value])


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
          className={`w-5 h-5 flex items-center justify-center 
            rounded-md border-2 transition-all duration-150 border-black bg-white`}>
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

