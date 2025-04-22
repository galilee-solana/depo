'use client'

import React from 'react'
import CreateButton from '../create/CreateButton'
import FindButton from '../find/FindButton'
import Escrow from '@/utils/sdk/models/escrow'
import EscrowCard from './EscrowCard'
import usePagination from '@/hooks/usePagination'
import PaginationControls from '@/components/ui/pagination/PaginationControls'

export default function EscrowList({ list }: { list: Escrow[] }) {
  // Sorted by create timestamp
  const sortedEscrowList = [...list].sort((a, b) => a.createdAt.cmp(b.createdAt))
  
  const maxVisible = 5
  
  // Use our custom pagination hook
  const {
    currentItems: visibleEscrow,
    currentPage,
    totalPages,
    isScrolling,
    goToNextPage,
    goToPrevPage
  } = usePagination(sortedEscrowList, {
    totalItems: sortedEscrowList.length,
    itemsPerPage: maxVisible
  })

  return (
    <div className="flex flex-col justify-between min-h-full px-4 py-6">
      {/* EscrowCard window with transition animation */}
      <div className="w-full max-w-3xl mx-auto px-4 rounded-md p-4">
        <div className={`relative space-y-4 transition-all duration-300 ease-in-out transform ${
          isScrolling ? 'opacity-50 translate-y-2' : 'opacity-100 translate-y-0'} min-h-[300px]`}>
          {visibleEscrow.map((escrow) => (
            <EscrowCard key={escrow.uuid} escrow={escrow} />
          ))}
        </div>
      </div>
      
      {/* Pagination controls */}
      {sortedEscrowList.length > maxVisible && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={maxVisible}
          totalItems={sortedEscrowList.length}
          onNextPage={goToNextPage}
          onPrevPage={goToPrevPage}
          disabled={isScrolling}
        />
      )}
      
      {/* Nav buttons */}
      <div className="flex flex-col items-center space-y-4 mt-8 mb-4 sm:hidden">
        <CreateButton></CreateButton>
        <FindButton onStartFinding={function():void {
                  throw new Error('Function not implemented.')
              } }></FindButton>
      </div>
    </div>
  )
}
