<<<<<<< HEAD
'use client'

console.log('ESCROW PAGE LOADED')

import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import EscrowCard from '@/components/escrowcard/EscrowCard'

export default function EscrowPage() {
  const { connected } = useWallet()
  const router = useRouter()

  // Redirected to / if wallet not connected
  useEffect(() => {
    if (!connected) {
      router.push('/')
    }
  }, [connected, router])
  const { connected } = useWallet()
  const router = useRouter()

  // Redirected to / if wallet not connected
  useEffect(() => {
    if (!connected) {
      router.push('/')
    }
  }, [connected, router])

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

  console.log('WALLET CONNECTED ?', connected.connected)

  return (
    <div>
        <EscrowCard EscrowList={EscrowList}/>
        <EscrowCard EscrowList={EscrowList}/>
    </div>
  )
=======
import EscrowPage from '@/components/escrow/EscrowForm'

export default function Page() {
  return <EscrowPage />
>>>>>>> ff839cc (ui-layout.tsx = update EscrowCard visible if wallet connected | layout.tsx = update layout general to delete unusefull links)
}