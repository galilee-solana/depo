'use client'

import { useState, useEffect } from 'react'
import EscrowList from '@/components/escrow_list/EscrowList'
import { useDepoClient } from '@/contexts/useDepoClientCtx'
import Escrow from '@/utils/sdk/models/escrow'
import toast from 'react-hot-toast'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletButton } from '@/components/solana/solana-provider'

export default function EscrowPage() {
  const { getAllEscrows, wallet } = useDepoClient()
  const [escrows, setEscrows] = useState<Escrow[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchEscrows = async () => {
      if (!wallet?.connected) {
        setEscrows([])
        return  
      }
      
      try {
        setIsLoading(true)
        const fetchedEscrows = await getAllEscrows()
        setEscrows(fetchedEscrows)
      } catch (error: any) {
        toast.error('Error fetching escrows: ' + error.message)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchEscrows()
  }, [wallet?.connected, getAllEscrows])

  if (!wallet?.connected) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <p className="mb-4 text-gray-600">Please connect your wallet to view escrows.</p>
        <WalletButton />
      </div>
    )
  }

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center py-10">
          <p>Loading escrows...</p>
        </div>
      ) : (
        <EscrowList list={escrows}/>
      )}
    </div>
  )
}