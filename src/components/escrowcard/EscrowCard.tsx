'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import CreateButton from '../create/CreateButton'
import FindButton from '../find/FindButton'

type Escrow = {
  id: number // u32
  name: string
}

export default function EscrowCard({ EscrowList }: { EscrowList: Escrow[] }) {
  const router = useRouter()

  // Sorted by ID number
  const sortedEscrowList = [...EscrowList].sort((a, b) => a.id - b.id)

  // Set const State to scroll DepoCard
  const [startIndex, setStartIndex] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const maxVisible = 5
  const hasOverflow = EscrowList.length > maxVisible
  const visibleEscrow = sortedEscrowList.slice(startIndex, startIndex + maxVisible)

  const scrollUp = () => {
    if (startIndex > 0) {
      setIsScrolling(true)
      setStartIndex(startIndex - 1)
      setTimeout(() => setIsScrolling(false), 300) // Same duration as transition
    }
  }
  
  const scrollDown = () => {
    if (startIndex + maxVisible < sortedEscrowList.length) {
      setIsScrolling(true)
      setStartIndex(startIndex + 1)
      setTimeout(() => setIsScrolling(false), 300)
    }
  }  

  return (
    <div className="flex flex-col justify-between min-h-full bg-white px-4 py-6">
      {/* EscrowCard window | scroll conditions */}
      <div className="w-full max-w-3xl mx-auto px-4 rounded-md p-4 bg-white">
        <div className={`relative space-y-4 transition-all duration-300 ease-in-out transform ${
          isScrolling ? 'opacity-50 translate-y-2' : 'opacity-100 translate-y-0'} min-h-[300px]`}>
          {visibleEscrow.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-black text-white rounded-2xl px-4 py-3 cursor-pointer shadow-md hover:bg-gray-900 transition"
              onClick={() => router.push(`/escrow/${item.id}`)} // Redirect ID to update page still to be done
            >
              <div className="flex items-center space-x-4">
                <Image
                  src="/D-logo-black.svg"
                  alt="Logo DEPO"
                  width={0}
                  height={0}
                  className="h-10 w-auto object-contain"
                />
                <span className="truncate max-w-[200px]">
                  {item.name.length > 24 ? item.name.slice(0, 24) + '…' : item.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Scroll arrows */}
      {hasOverflow && (
        <div className="flex justify-center mt-1 mr-[3px]">
          <div className="flex space-x-3">
            <button
              onClick={scrollUp}
              disabled={startIndex === 0}
              className="text-black rounded-full px-3 py-1 hover:bg-gray-100 disabled:opacity-30 transition"
            >
              ↑
            </button>
            <button
              onClick={scrollDown}
              disabled={startIndex + maxVisible >= sortedEscrowList.length}
              className="text-black rounded-full px-3 py-1 hover:bg-gray-100 disabled:opacity-30 transition"
            >
              ↓
            </button>
          </div>
        </div>
      )}
      {/* Nav buttons */}
      <div className="flex flex-col items-center space-y-4 mt-8 mb-4">
        <CreateButton></CreateButton>
        <FindButton></FindButton>
      </div>
    </div>
  )
}
