import React from 'react'

interface ReadOnlyInputProps {
  label: string
  value: string
  id?: string
  placeholder?: string
}

function ReadOnlyInput({ label, value, id, placeholder = "" }: ReadOnlyInputProps) {
  const displayValue = value || "";
  const showPlaceholder = !displayValue && placeholder;

  return (
    <div className="relative flex-1">
      {displayValue && (
        <span className="absolute -top-3 left-2 text-xs text-gray-500 bg-white px-1 rounded pointer-events-none">
          {label}
        </span>
      )}
      
      {showPlaceholder && (
        <div className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
          {placeholder}
        </div>
      )}
      
      <input
        type="text"
        id={id}
        className="w-full px-3 py-2 border-2 rounded-2xl appearance-none
                  bg-gray-50 text-gray-700 border-gray-300 cursor-not-allowed"
        value={displayValue}
        readOnly
      />
    </div>
  )
}

export default ReadOnlyInput