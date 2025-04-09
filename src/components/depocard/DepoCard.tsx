'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

type PubkeyDepo = {
  id: number // u32
  name: string
}

export default function DepoCard({ PubkeyDepoList }: { PubkeyDepoList: PubkeyDepo[] }) {
  const router = useRouter()

  // Sorted by ID number
  const sortedList = [...PubkeyDepoList].sort((a, b) => a.id - b.id)

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="space-y-4">
        {sortedList.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-black text-white rounded-2xl px-4 py-3 cursor-pointer shadow-md hover:bg-gray-900 transition"
            onClick={() => router.push(`/depo/${item.id}`)} // Redirect ID to update page still to be done
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
                {item.name.length > 19 ? item.name.slice(0, 19) + '…' : item.name}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center space-y-4 mt-8 mb-4">
      <button
        onClick={() => router.push('/CreateDepo')}
        className="px-6 py-3 border-2 border-black text-black bg-white rounded-lg hover:bg-gray-100 transition"
      >
        Create Depo
      </button>
      <button
        onClick={() => router.push('/FindDepo')}
        className="px-6 py-3 border-2 border-black text-black bg-white rounded-lg hover:bg-gray-100 transition"
      >
        Find Depo
      </button>
    </div>
    </div>
  )
}
