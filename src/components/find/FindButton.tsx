'use client'

import { useState } from 'react'
// import { FindEscrowSearchBarr } from './FindEscrowSearchBarr' // Still to be done

export default function FindButton({ onStartFinding }: { onStartFinding: () => void }) {
  return (
    <button
      onClick={onStartFinding}
      className="px-6 py-3 border-2 border-black text-black bg-white rounded-lg hover:bg-gray-100 transition"
    >
      Search DEPO
    </button>
  )
}