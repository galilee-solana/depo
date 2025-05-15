'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Page() {
    const { connected } = useWallet()
    const router = useRouter()
  
    useEffect(() => {
      if (connected) {
        router.push('/escrow')
      }
    }, [connected, router])
  
    return (
      <div className="flex items-center justify-center h-full text-center text-gray-600">
        Please connect your wallet.
      </div>
    )
}

