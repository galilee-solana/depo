'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect } from 'react'

export default function CreateEscrow() {
  const { publicKey } = useWallet()

  useEffect(() => {
    if (publicKey) {
      console.log("Connected pubKey is :", publicKey.toBase58())
    }
  }, [publicKey])

  if (!publicKey) {
    return (
      <div className="p-6">
        <p>Please connect your wallet to create a new DEPO.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Create new Escrow</h1>
      <p>Your pubKey is : {publicKey.toBase58()}</p>

      {/* Form to add here */}
    </div>
  )
}
