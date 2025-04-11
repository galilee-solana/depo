'use client'

console.log('ESCROW PAGE LOADED')

import { useWallet } from '@solana/wallet-adapter-react'
import EscrowCard from '@/components/escrowcard/EscrowCard'

export default function EscrowPage() {
  const wallet = useWallet()

  // Add test const to check DepoCard display
  const EscrowList = [
    { id: 2, name: 'Escrow Alpha' },
    { id: 1, name: 'Paiement sécurisé très long' },
    { id: 3, name: 'Mini escrow' },
    { id: 5, name: 'Caution pour paiement 5' },
    { id: 6, name: 'Ne devrait pas apparaître' },
    { id: 4, name: '4 : Celui-ci est vraiment vraiment vraiment très très long' },
    { id: 7, name: 'Achat groupé pour 7' },
  ]

  console.log('WALLET CONNECTED ?', wallet.connected)

  return (
    <div>
      {wallet.connected ? (
        <EscrowCard EscrowList={EscrowList} />
      ) : (
        <div className="text-gray-500 text-center mt-6">
          Please connect your wallet to view escrows.
        </div>
      )}
    </div>
  )
}