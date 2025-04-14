'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PublicKey } from '@solana/web3.js'
import ToogleInputFieldSolAddress from '@/components/create/ToogleInputFieldSolAddress'

export default function Add_description() {
  const router = useRouter()

  const [description, setDescription] = useState('')
  const [singleApprovalEnabled, setSingleApprovalEnabled] = useState(false)
  const [singleApprovalAddress, setSingleApprovalAddress] = useState('')

  const descriptionData = {
    id: crypto.randomUUID(), // To change to an iterative add
    single_approval: setSingleApprovalAddress,
  }

  const handleConfirm = () => {
    // Add logic to confirm add of description
    // To prepare for API set up
    console.log("Description Data:", descriptionData)
    router.push('/escrow/create') // Redirect to previous page
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Add a single approval address to your DEPO.</h1>

      <ToogleInputFieldSolAddress
        label="Single approval public address"
        placeholder="Please enter a valid Solana public address."
        enabled={singleApprovalEnabled}
        setEnabled={setSingleApprovalEnabled}
<<<<<<< HEAD
        value={singleApprovalAddress}
=======
        value={setSingleApprovalAddress}
>>>>>>> d37932f (keep track of set_depositor_address | set_recipient_address | add_single_approval | add_multisig_approval)
        setValue={setSingleApprovalAddress}
      />
    {/* Add confirm button to add description*/}
    <button
        onClick={handleConfirm}
        className="px-6 py-3 border-2 border-black text-black bg-white rounded-lg hover:bg-gray-100 transition"
      >
        Confirm Single Approval Address
      </button>
    </div>
  )
}
