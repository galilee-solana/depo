'use client'

import { useState, useEffect } from 'react'
import EscrowList from '@/components/escrow_list/EscrowList'
import { useDepoClient } from '@/contexts/useDepoClientCtx'
import Escrow from '@/utils/models/escrow'

export default function EscrowPage() {
  const { getAllEscrows } = useDepoClient()
  const [escrows, setEscrows] = useState<Escrow[]>([])

  useEffect(() => {
    getAllEscrows().then(setEscrows)
  })

  return (
    <div>
        <EscrowList list={escrows}/>
    </div>
  )
}