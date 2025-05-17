'use client'

import { useDepoClient } from '@/contexts/useDepoClientCtx'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useEscrow } from '@/contexts/useEscrowCtx'
import { useRouter } from 'next/navigation'
import SmallButton from '../ui/buttons/SmallButton'

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
    try { 
      const result = await create()
      setLoading(false)
      if (result) {
        router.push(`/demo/escrow/${result.escrow.uuid}`)
      }
    } catch (error: any) {
      setLoading(false)
      toast.error('Error: ' + error.message)
    }
  }
  
return (
    <SmallButton
        onClick={handleCreate}
        disabled={loading}
    >
        {loading ? 'Creating...' : 'Create'}
    </SmallButton>
  )
}