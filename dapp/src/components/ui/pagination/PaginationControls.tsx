import React from 'react'

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  itemsPerPage: number
  totalItems: number
  onNextPage: () => void
  onPrevPage: () => void
  disabled?: boolean
}

function PaginationControls({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onNextPage,
  onPrevPage,
  disabled = false
}: PaginationControlsProps) {
  const startItem = currentPage * itemsPerPage + 1
  const endItem = Math.min((currentPage + 1) * itemsPerPage, totalItems)

  return (
    <div className="flex justify-center mt-2">
      <div className="flex space-x-3">
        <button
          onClick={onPrevPage}
          disabled={currentPage === 0 || disabled}
          className="text-black rounded-full px-3 py-1 border border-black hover:bg-gray-100 disabled:opacity-30 transition"
        >
          ↑
        </button>
        <div className="flex items-center justify-center w-10 h-8">
          <span className="text-black text-sm">
            {startItem} - {endItem}
          </span>
        </div>
        <button
          onClick={onNextPage}
          disabled={currentPage >= totalPages - 1 || disabled}
          className="text-black rounded-full px-3 py-1 border border-black hover:bg-gray-100 disabled:opacity-30 transition"
        >
          ↓
        </button>
      </div>
    </div>
  )
}

export default PaginationControls
