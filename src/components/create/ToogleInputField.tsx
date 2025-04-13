// Version with persistent flyover //

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
//    <div className="flex items-center space-x-3 relative w-full">
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
//      {/* Champ input avec flyover */}
//      <div className="flex-1 relative">
//        {value && (
//          <label
//            htmlFor={id}
//            className="absolute -top-3 left-2 text-xs text-gray-500 bg-white px-1 rounded"
//          >
//            {placeholder}
//          </label>
//        )}
//
//        <input
//          id={id}
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

// Version with active Flyover but bad positionning//

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
//      {/* Input with dynamic flyover */}
//      <div className="flex-1 relative">
//        {/* Flyover visible uniquement quand il y a une valeur */}
//        {value && (
//          <label
//            htmlFor={id + '-input'}
//            className="absolute left-3 top-0 text-xs text-gray-500 bg-white px-1 z-10"
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
//            ${value ? 'pt-5' : ''}
//          `}
//          value={value}
//          onChange={(e) => setValue(e.target.value)}
//          disabled={!enabled}
//        />
//      </div>
//    </div>
//  )
//}


// Good version but extended field of input //

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
//      {/* Input avec flyover */}
//      <div className="flex-1 relative">
//        {/* Flyover si une valeur est présente */}
//        {value && (
//          <label
//            htmlFor={id + '-input'}
//            className="absolute -top-3 left-2 text-xs text-gray-500 bg-white px-1 rounded"
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
//            ${value ? 'pt-5' : ''}
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

interface ToggleInputFieldProps {
  label: string
  placeholder: string
  enabled: boolean
  setEnabled: (v: boolean) => void
  value: string
  setValue: (v: string) => void
}

export default function ToggleInputField({
  label,
  placeholder,
  enabled,
  setEnabled,
  value,
  setValue,
}: ToggleInputFieldProps) {
  const id = useId()

  return (
    <div className="flex items-center space-x-3 w-full relative">
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

      {/* Input + flyover */}
      <div className="flex-1 relative">
        {value && (
          <label
            htmlFor={id + '-input'}
            className="absolute -top-3 left-2 text-xs text-gray-500 bg-white px-1 rounded pointer-events-none"
          >
            {placeholder}
          </label>
        )}

        <input
          id={id + '-input'}
          type="text"
          placeholder={value ? '' : placeholder}
          className={`
            w-full px-3 py-2 border-2 rounded-2xl transition
            ${enabled
              ? 'bg-white text-black border-black'
              : 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'}
          `}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!enabled}
        />
      </div>
    </div>
  )
}




