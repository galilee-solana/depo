'use client'

import { useDepoClient } from '@/contexts/useDepoClientCtx'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useEscrow } from '@/contexts/useEscrowCtx'
import { useRouter } from 'next/navigation'

type ConfirmButtonProps = {
    name : string
    description : string
    timelock : string
    minimumAmount : string
    targetAmount : string
}

export default function ConfirmEscrow({
    name,
    description,
    timelock,
    minimumAmount,
    targetAmount
}: ConfirmButtonProps) {
  const { create } = useEscrow()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    setLoading(true)
    const result = await create()
    setLoading(false)
    if (result) {
      router.push(`/escrow/${result.escrow.uuid}`)
    }
  }
  
return (
    <button
        onClick={handleCreate}
        disabled={loading}
        className="px-6 py-3 border-2 border-black text-black bg-white rounded-lg hover:bg-gray-100 transition"
    >
      {loading ? 'Creating...' : 'Create'}
    </button>
  )
}