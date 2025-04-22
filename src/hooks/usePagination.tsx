import { useState } from 'react'

interface PaginationOptions {
  totalItems: number
  itemsPerPage: number
  initialPage?: number
}

interface PaginationResult<T> {
  currentItems: T[]
  currentPage: number
  totalPages: number
  isScrolling: boolean
  goToNextPage: () => void
  goToPrevPage: () => void
  goToPage: (page: number) => void
  hasNextPage: boolean
  hasPrevPage: boolean
}

function usePagination<T>(items: T[], options: PaginationOptions): PaginationResult<T> {
  const { totalItems, itemsPerPage, initialPage = 0 } = options
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [isScrolling, setIsScrolling] = useState(false)

  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = currentPage * itemsPerPage
  const currentItems = items.slice(startIndex, startIndex + itemsPerPage)

  const animateScroll = (callback: () => void) => {
    setIsScrolling(true)
    callback()
    setTimeout(() => setIsScrolling(false), 300) // Same duration as transition
  }

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      animateScroll(() => setCurrentPage(prev => prev + 1))
    }
  }

  const goToPrevPage = () => {
    if (currentPage > 0) {
      animateScroll(() => setCurrentPage(prev => prev - 1))
    }
  }

  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      animateScroll(() => setCurrentPage(page))
    }
  }

  return {
    currentItems,
    currentPage,
    totalPages,
    isScrolling,
    goToNextPage,
    goToPrevPage,
    goToPage,
    hasNextPage: currentPage < totalPages - 1,
    hasPrevPage: currentPage > 0
  }
}

export default usePagination