<<<<<<< HEAD
'use client'

import { useState, useEffect } from 'react'
import EscrowList from '@/components/escrow_list/EscrowList'
import { useDepoClient } from '@/contexts/useDepoClientCtx'
import Escrow from '@/utils/models/escrow'
import toast from 'react-hot-toast'
export default function EscrowPage() {
  const { getAllEscrows } = useDepoClient()
  const [escrows, setEscrows] = useState<Escrow[]>([])

  useEffect(() => {
    const fetchEscrows = async () => {
      try {
        const escrows = await getAllEscrows()
        if (escrows) {
          setEscrows(escrows)
        }
      } catch (error: any) {
        toast.error('Error fetching escrows: ', error)
      }
    }
    fetchEscrows()
  }, [getAllEscrows])

  return (
    <div>
        <EscrowList list={escrows}/>
    </div>
  )
=======
import EscrowPage from '@/components/escrow/EscrowForm'

export default function Page() {
  return <EscrowPage />
>>>>>>> ff839cc (ui-layout.tsx = update EscrowCard visible if wallet connected | layout.tsx = update layout general to delete unusefull links)
}