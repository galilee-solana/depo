import usePagination from "@/hooks/usePagination"
import PaginationControls from "@/components/ui/pagination/PaginationControls"
import useDynamicInputList from "@/hooks/useDynamicInputList"
import { useEffect, useState, ReactNode } from "react"

type DynamicComponentListProps = {
  label: string
  description?: string
  itemsPerPage: number
  toRender: ReactNode[] | undefined
  onChange?: (value: string[]) => void
}

function DynamicComponentList({ label, description, itemsPerPage = 3, toRender}: DynamicComponentListProps) {
  const [count] = useState(toRender?.length || 0)
  const [pendingNavigation, setPendingNavigation] = useState(false)

  const {
    currentItems: visibleInputFields,
    currentPage,
    totalPages,
    isScrolling,
    goToNextPage,
    goToPrevPage,
  } = usePagination(toRender || [], {
    totalItems: toRender?.length || 0,
    itemsPerPage
  })

  // Effect for handling navigation after state updates
  useEffect(() => {
    if (pendingNavigation && !isScrolling) {
      setPendingNavigation(false)
      goToNextPage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingNavigation, isScrolling, goToNextPage])

  return (
    <div className="px-6 space-y-2">
      <p className="text-xl font-bold">{label} - <span>{count}</span></p>
      {description && <p className="text-md text-gray-700">{description}</p>}
      {/* Input fields with transition animation */}
      <div className={`relative space-y-3 transition-all duration-300 ease-in-out transform 
        ${isScrolling ? 'opacity-50 translate-y-2' : 'opacity-100 translate-y-0'}`}>
        {visibleInputFields.map((component, index) => (
          <div key={index} className="flex items-center space-x-2">
            {component}
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between">
        {/* Pagination controls */}
        {toRender?.length && toRender.length > itemsPerPage && (
          <div className="mx-8">
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={toRender.length}
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

export default DynamicComponentList