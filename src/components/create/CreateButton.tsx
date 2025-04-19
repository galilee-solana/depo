'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import { useDepoClient } from '@/contexts/useDepoClientCtx'
import toast from 'react-hot-toast'

export default function CreateButton() {
  const { client } = useDepoClient()
  const router = useRouter()

  const handleClick = async () => {
    router.push('/escrow/create') // Route to page = src/app/escrow/create/page.tsx
    //try { 
    //  const result = await client?.createEscrow("test", "test")
    //  if (result) {
    //    router.push(`/escrow/${result.escrow.uuid}`)
    //    toast.success(`Escrow created successfully. ${result.tx}`)
    //  } else {
    //    toast.error('Error creating escrow')
    //  }
    //} catch (error: any) {
    //  toast.error(error.message)
    //}
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