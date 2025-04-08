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
    <div className="w-full px-[30px]">
      <div className="space-y-4">
        {sortedList.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-black text-white rounded-2xl px-4 py-3 cursor-pointer shadow-md hover:bg-gray-900 transition"
            onClick={() => router.push(`/depo/${item.id}`)} // Redirect ID to update page still to be done
          >
            <div className="flex items-center space-x-4">
              <Image
                src="/D-logo-white.svg"
                alt="Logo DEPO"
                width={0}
                height={0}
                className="h-10 w-auto object-contain"
              />
              <span className="truncate max-w-[200px]">
                {item.name.length > 19 ? item.name.slice(0, 19) + '…' : item.name}
              </span>
            </div>

            <div
              onClick={(e) => {
                e.stopPropagation() // Avoid click on main map
                router.push(`/remove-depo/${item.id}`) // Redirect to remove page still to be done
              }}
              className="p-2 hover:bg-gray-800 rounded-lg"
              title="Delete"
            >
              <Image
                src="/bin.svg" // Update link with bin logo in white on black background
                alt="Remove"
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
