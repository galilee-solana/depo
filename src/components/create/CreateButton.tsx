'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

export default function CreateButton() {
  const router = useRouter()

  const handleClick = async () => {
    router.push('/demo/escrow/create')
  }

  return (
    <button
      onClick={handleClick}
      className="px-6 py-3 border-2 border-black text-black bg-white rounded-lg hover:bg-gray-100 transition"
    >
      Create DEPO
    </button>
  )
}