'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import { useDepoClient } from '@/contexts/useDepoClientCtx'
import toast from 'react-hot-toast'
import ToastWithLinks from '../toasts/ToastWithLinks'
import { useCluster } from '@/components/cluster/cluster-data-access'

export default function CreateButton() {
  const { client } = useDepoClient()
  const router = useRouter()
  const { getExplorerUrl } = useCluster()

  const handleClick = async () => {
    // router.push('/escrow/create') // Route to page = src/app/escrow/create/page.tsx
    try { 
      const result = await client?.createEscrow("test", "test")
      if (result) {
        const result2 = await client?.addRecipient(result?.escrow.uuid, "B2FoCe8QrFmNLvvQmbNA1gUXeBeYbEv5HYdyLX38EYtJ", 100)
        if (result2) {
          router.push(`/escrow/${result.escrow.uuid}`)
          const explorerUrl = getExplorerUrl(`tx/${result.tx}`)
          toast.success(
            <ToastWithLinks
              message="Escrow created successfully."
            linkText="View transaction"
              url={explorerUrl}
            />
          )
        } else {
          toast.error('Error creating escrow')
        }
      } else {
        toast.error('Error creating escrow')
      }
    } catch (error: any) {
      toast.error(error.message)
    }
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
