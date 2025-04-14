//import { useId } from 'react'
//
//interface ToggleInputFieldProps {
//  label: string
//  placeholder: string
//  enabled: boolean
//  setEnabled: (v: boolean) => void
//  value: string
//  setValue: (v: string) => void
//}
//
//export default function ToggleInputField({
//  label,
//  placeholder,
//  enabled,
//  setEnabled,
//  value,
//  setValue,
//}: ToggleInputFieldProps) {
//  const id = useId()
//
//  return (
//    <div className="flex items-center space-x-3 w-full relative">
//      {/* Checkbox */}
//      <label htmlFor={id} className="relative">
//        <input
//          id={id}
//          type="checkbox"
//          checked={enabled}
//          onChange={() => setEnabled(!enabled)}
//          className="peer hidden"
//        />
//        <div
//          className={`
//            w-5 h-5 flex items-center justify-center rounded-md border-2
//            transition-all duration-150
//            ${enabled
//              ? 'bg-white border-black'
//              : 'bg-gray-200 border-gray-400'}
//          `}
//        >
//          {enabled && (
//            <svg
//              className="w-3 h-3 text-black"
//              viewBox="0 0 24 24"
//              fill="none"
//              stroke="currentColor"
//              strokeWidth="3"
//              strokeLinecap="round"
//              strokeLinejoin="round"
//            >
//              <polyline points="20 6 9 17 4 12" />
//            </svg>
//          )}
//        </div>
//      </label>
//
//      {/* Input + flyover */}
//      <div className="flex-1 relative">
//        {value && (
//          <label
//            htmlFor={id + '-input'}
//            className="absolute -top-3 left-2 text-xs text-gray-500 bg-white px-1 rounded pointer-events-none"
//          >
//            {placeholder}
//          </label>
//        )}
//
//        <input
//          id={id + '-input'}
//          type="text"
//          placeholder={value ? '' : placeholder}
//          className={`
//            w-full px-3 py-2 border-2 rounded-2xl transition
//            ${enabled
//              ? 'bg-white text-black border-black'
//              : 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'}
//          `}
//          value={value}
//          onChange={(e) => setValue(e.target.value)}
//          disabled={!enabled}
//        />
//      </div>
//    </div>
//  )
//}

import { useId } from 'react'
import Link from 'next/link'

interface ToggleLinkProps {
  question: string
  linkLabel: string
  href: string
  enabled: boolean
  setEnabled: (v: boolean) => void
}

export default function ToggleLink({
  question,
  linkLabel,
  href,
  enabled,
  setEnabled,
}: ToggleLinkProps) {
  const id = useId()

  return (
    <div className="flex items-center space-x-3 w-full">
      {/* Toggle Checkbox */}
      <label htmlFor={id} className="relative cursor-pointer">
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
            ${enabled
              ? 'bg-white border-black'
              : 'bg-gray-200 border-gray-400'}
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

      {/* Question or Link */}
      <div className="flex-1 text-sm">
        {!enabled ? (
          <span className="text-gray-600">{question}</span>
        ) : (
          <Link
            href={href}
            className="text-blue-600 underline hover:text-blue-800 transition"
          >
            {linkLabel}
          </Link>
        )}
      </div>
    </div>
  )
}





