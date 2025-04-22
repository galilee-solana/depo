import usePagination from "@/hooks/usePagination"
import PaginationControls from "@/components/ui/pagination/PaginationControls"
import useDynamicInputList from "@/hooks/useDynamicInputList"
import { useEffect, useState, useRef } from "react"

type DynamicInputListProps = {
  label: string
  description?: string
  itemsPerPage: number
  placeholder?: string
  initialValues?: string[]
  onChange?: (value: string[]) => void
}

function DynamicInputList({ label, description, itemsPerPage = 3, placeholder, initialValues, onChange}: DynamicInputListProps) {
  const { count, inputFields, addInputField, handleInputChange, removeInputField } = useDynamicInputList(itemsPerPage, { initialValues, onChange }  )
  
  const [pendingNavigation, setPendingNavigation] = useState(false)
  const isFirstRender = useRef(true)

  const {
    currentItems: visibleInputFields,
    currentPage,
    totalPages,
    isScrolling,
    goToNextPage,
    goToPrevPage,
  } = usePagination(inputFields, {
    totalItems: inputFields.length,
    itemsPerPage
  })

  const handleAdd = () => {
    addInputField()
    
    if (count % itemsPerPage === 0) {
      setPendingNavigation(true)
    }
  }

  const handleRemove = (id: number) => {
    removeInputField(id)

    const itemsOnCurrentPage = inputFields.filter(
      (_, index) => Math.floor(index / itemsPerPage) === currentPage
    ).length
  
    if (itemsOnCurrentPage === 1 && currentPage > 0) {
      goToPrevPage()
    }
  }
  
  // Effect for handling navigation after state updates
  useEffect(() => {
    if (pendingNavigation && !isScrolling) {
      setPendingNavigation(false)
      goToNextPage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingNavigation, isScrolling, goToNextPage])

  useEffect(() => {
    if (isFirstRender.current) {
        isFirstRender.current = false
        return
    }

    if (onChange) {
        const values = inputFields.map(field => field.value)
        onChange(values)
    }
  }, [inputFields])

  return (
    <div className="px-6 space-y-2">
      <p className="text-xl font-bold">{label} - <span>{count}</span></p>
      {description && <p className="text-md text-gray-700">{description}</p>}
      {/* Input fields with transition animation */}
      <div className={`relative space-y-3 transition-all duration-300 ease-in-out transform 
        ${isScrolling ? 'opacity-50 translate-y-2' : 'opacity-100 translate-y-0'}`}>
        {visibleInputFields.map((field, index) => (
          <div key={field.id} className="flex items-center space-x-2">
            <input
              placeholder={placeholder}
              className="flex-1 px-3 py-2 border-2 border-black rounded-2xl bg-white text-black"
              value={field.value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
            />
            {inputFields.length > 1 && (
              <button
                onClick={() => handleRemove(field.id)}
                className="p-2 text-red-500 hover:text-red-700"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between">
        <button
          onClick={handleAdd}
          className="px-4 py-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <g>
            <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="12" x2="12" y1="19" y2="5"/>
            <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="5" x2="19" y1="12" y2="12"/>
            </g>
          </svg>
        </button>

        {/* Pagination controls */}
        {inputFields.length > itemsPerPage && (
          <div className="mx-8">
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={inputFields.length}
              onNextPage={goToNextPage}
              onPrevPage={goToPrevPage}
              disabled={isScrolling}
            />
          </div>
        )}
      </div>
    </div>    
  )
}

export default DynamicInputList