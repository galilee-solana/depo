'use client'

import { useRouter } from 'next/navigation'
<<<<<<< HEAD
import React from 'react'

export default function CreateButton() {
  const router = useRouter()

  const handleClick = () => {
    router.push('/escrow/create') // Route to page = src/app/escrow/create/page.tsx
  }

  return (
    <button
      onClick={handleClick}
      className="px-6 py-3 border-2 border-black text-black bg-white rounded-lg hover:bg-gray-100 transition"
    >
      Create DEPO
=======

export default function CreateButton() {
  const router = useRouter()
  return (
    <button
      onClick={() => router.push('/create')}
      className="px-6 py-3 border-2 border-black text-black bg-white rounded-lg hover:bg-gray-100 transition"
    >
      Create Escrow
>>>>>>> e0776a0 (src/components/create/CreateButton.tsx = first version of CreateButton.tsx passing on data to -create page-)
    </button>
  )
}
