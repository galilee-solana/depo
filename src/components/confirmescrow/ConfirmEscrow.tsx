'use client'

import { useDepoClientCtx } from '@/components/contexts/useDepoClientCtx'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

type ConfirmButtonProps = {
    name : string
    description : string
    timelockEnabled : boolean
    timelock : string
    minimumAmountEnabled : boolean
    minimumAmount : string
    targetAmountEnabled : boolean
    targetAmount : string
    walletPublicKey : string
}

export default function ConfirmEscrow({
    name,
    description,
    timelockEnabled,
    timelock,
    minimumAmountEnabled,
    minimumAmount,
    targetAmountEnabled,
    targetAmount,
    walletPublicKey,
}: ConfirmButtonProps) {
  const { client } = useDepoClientCtx()
  const [loading, setLoading] = useState(false)

  const handleConfirmEscrow = async () => {
    // Check if name and description are not empty
    if (!name || description) {
        toast.error('Name and description are required')
        return
    }

    // START TIME ACTIVATE WHEN READY
    //if (startTimeEnabled) {
    //  const now = new Date()
    //  const selectedStartTime = new Date(startTime)
    //  if (selectedStartTime <= now) {
    //    errors.push("Start time must be in the future.")
    //  }
    //}
    
    // Set minimum timelock -> 5min ahead : We can discuss about that.
    if (timelockEnabled) {
        const now = new Date()
        const lockTime = new Date(timelock)
        if (isNaN(lockTime.getTime()) || lockTime.getTime() < now.getTime() + 5 * 60 * 1000) {
            toast.error("Timelock must be at least 5 minutes in the future.")
            return
        }
    }

    // If target_amount only -> must be > 0
    if (targetAmountEnabled && parseFloat(targetAmount) <= 0) {
        toast.error('Target amount must be greater than 0')
        return
    }

    // If minimum_amount only -> must be > 0
    if (minimumAmountEnabled && parseFloat(minimumAmount) <= 0) {
        toast.error('Minimum amount must be greater than 0')
        return
    }

    // If both min & target active -> target > min
    if (minimumAmountEnabled && targetAmountEnabled &&
        parseFloat(minimumAmount) > parseFloat(targetAmount)
      ) {
        toast.error('Minimum amount cannot exceed target amount')
        return
    }

    if (!client) {
        toast.error("DepoClient is not available")
        return
    }

    try {
        setLoading(true)
        const loadingToastId = toast.loading("Creating your escrow...")
  
        // Seuls name & description sont passés pour l’instant :
        const { tx, escrow } = await client.createEscrow({
          name,
          description,
          // timelock: timelockEnabled ? new Date(timelock) : null,
          // minimumAmount: minimumAmountEnabled ? parseFloat(minimumAmount) : null,
          // targetAmount: targetAmountEnabled ? parseFloat(targetAmount) : null,
        })
  
        toast.dismiss(loadingToastId)
        toast.success(`Escrow created 🎉 TX: ${tx.slice(0, 8)}...`)
  
        console.log('Escrow created:', escrow)
      } catch (err: any) {
        toast.dismiss()
        toast.error(`Error: ${err.message}`)
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
  
  
return (
    <button
        onClick={handleConfirmEscrow}
        disabled={loading}
        className="px-6 py-3 border-2 border-black text-black bg-white rounded-lg hover:bg-gray-100 transition"
    >
        Confirm DEPO
    </button>
  )
}