'use client'

import { useRouter } from 'next/navigation'

export default function CreateButton() {
  const router = useRouter()
  return (
    <button
      onClick={() => router.push('/create')}
      className="px-6 py-3 border-2 border-black text-black bg-white rounded-lg hover:bg-gray-100 transition"
    >
      Create DEPO
    </button>
  )
}
