'use client'

import { useState } from 'react'
import { CreateEscrowForm } from './CreateEscrowForm'

export default function CreateButton({ onStartCreating }: { onStartCreating: () => void }) {
  return (
    <button
      onClick={onStartCreating}
      className="px-6 py-3 border-2 border-black text-black bg-white rounded-lg hover:bg-gray-100 transition"
    >
      Create DEPO
    </button>
  )
}

