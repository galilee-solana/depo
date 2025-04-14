'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Add_description() {
  const router = useRouter()

  const [description, setDescription] = useState('')

  const descriptionData = {
    id: crypto.randomUUID(), // To change to an iterative add
    description
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Add a description to your DEPO.</h1>

      <input
        placeholder="Add your description here"
        className="w-full h-full px-3 py-2 border-2 border-black rounded-2xl bg-white text-black"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    {/* Add confirm button to add description*/}
    </div>
  )
}
