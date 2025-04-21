'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import { useDepoClient } from '@/contexts/useDepoClientCtx'
import toast from 'react-hot-toast'
import ToastWithLinks from '../toasts/ToastWithLinks'
import { useCluster } from '@/components/cluster/cluster-data-access'

export default function DepositButton() {
  const { client } = useDepoClient()
  const router = useRouter()
  const { getExplorerUrl } = useCluster()

  const handleClick = async () => {
    router.push('/escrow/deposit')
  }

  return (
    <button
      onClick={handleClick}
      className="px-6 py-3 border-2 border-black text-black bg-white rounded-lg hover:bg-gray-100 transition"
    >
      Deposit
    </button>
  )
}
