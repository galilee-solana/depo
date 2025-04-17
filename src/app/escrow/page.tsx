'use client'

console.log('ESCROW PAGE LOADED')

import { useState, useEffect } from 'react'
import EscrowCard from '@/components/escrowcard/EscrowCard'
import { useDepoClient } from '@/contexts/useDepoClientCtx'
import Escrow from '@/utils/models/escrow'

export default function EscrowPage() {
  const { getAllEscrows } = useDepoClient()
  const [escrows, setEscrows] = useState<Escrow[]>([])

  useEffect(() => {
    getAllEscrows().then(setEscrows)
  }, [])

  return (
    <div>
        <EscrowCard EscrowList={escrows}/>
    </div>
  )
}