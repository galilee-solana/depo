'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import { useAnchorProvider } from '../solana/solana-provider'
import { useWallet } from '@solana/wallet-adapter-react'
import DepoClient from '@/utils/depo_client'

export default function CreateButton() {
  const router = useRouter()

  
  const provider = useAnchorProvider()
  const wallet = useWallet()
  const depoClient = new DepoClient(provider, wallet)

  const handleClick = async () => {
    //router.push('/escrow/create') // Route to page = src/app/escrow/create/page.tsx
    const uuid = await depoClient.createEscrow("Test", "Test")
    console.log("Escrow created", uuid)
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
