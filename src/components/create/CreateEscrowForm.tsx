'use client'

import { useWallet } from '@solana/wallet-adapter-react'

export function CreateEscrowForm() {
  const { publicKey } = useWallet()

  return (
    <div className="mt-4 p-4 border rounded-xl bg-gray-100 shadow-lg">
      <h2 className="text-xl font-bold mb-2">Créer un contrat Escrow</h2>
      {publicKey ? (
        <p className="mb-4 text-sm text-gray-700">Wallet connecté : {publicKey.toBase58()}</p>
      ) : (
        <p className="text-red-500 mb-4">Aucun wallet connecté</p>
      )}
      {/* Form to add here */}
    </div>
  )
}
